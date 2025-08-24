import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import useThemeStore from './store/themeStore';
import useAuthStore from './store/authStore';
import { useEffect, useState } from 'react';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { authService } from './services/auth.service';

function App() {
  const { theme } = useThemeStore();
  const { setAuth, logout } = useAuthStore();
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Firebase auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // User is signed in
          const token = await firebaseUser.getIdToken();
          
          // Get user data from our backend
          const userData = await authService.getCurrentUser();
          
          // Update our auth store
          setAuth(userData, token);
        } catch (error) {
          console.error('Error setting auth state:', error);
          logout();
        }
      } else {
        // User is signed out
        logout();
      }
      
      // Mark auth as initialized
      setIsAuthReady(true);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, [setAuth, logout]);

  // Theme effect
  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    console.log('Theme changed to:', theme);
  }, [theme]);

  // Don't render until auth is ready
  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;