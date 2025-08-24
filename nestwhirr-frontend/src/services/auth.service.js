import api from './api';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  getIdToken 
} from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut 
} from 'firebase/auth';

export const authService = {
  // Email/Password Authentication
  async login(email, password) {
    try {
      // Firebase auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Validate with our backend
      const response = await api.post('/auth/login', { 
        idToken 
      });
      
      return {
        user: response.data.user,
        token: idToken
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(username, email, password) {
    try {
      // Firebase auth - create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with username
      await updateProfile(userCredential.user, {
        displayName: username
      });
      
      // Get ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Register with our backend
      const response = await api.post('/auth/register', {
        idToken,
        username
      });
      
      return {
        user: response.data.user,
        token: idToken
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Google Authentication
  async googleSignIn() {
    try {
      // Firebase Google auth
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      // Backend validation
      const response = await api.post('/auth/firebase-login', { 
        idToken 
      });
      
      return {
        user: response.data.user,
        token: idToken
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        console.error('Get current user error:', error);
        throw error;
      }
    }
    return null;
  },

  async updateProfile(userData) {
    try {
      // Update Firebase profile if needed
      if (userData.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: userData.displayName
        });
      }
      
      // Update backend profile
      const token = await auth.currentUser.getIdToken();
      const response = await api.put('/auth/profile', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      // Firebase logout - most important part first
      await signOut(auth);
      
    } catch (error) {
      console.error('Firebase logout error:', error);
      throw error;
    }
  }
}; 