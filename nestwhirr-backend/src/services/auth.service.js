const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const admin = require('../config/firebase');
const { defaultRole } = require('../config/roles');

/**
 * Verify Firebase token and get user info
 * @param {string} idToken
 * @returns {Promise<Object>}
 */
const verifyFirebaseToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }
};

/**
 * Get or create a user from Firebase credentials
 * @param {Object} firebaseUser
 * @returns {Promise<User>}
 */
const getUserFromFirebase = async (firebaseUser) => {
  // Try to find an existing user
  let user = await userService.getUserByEmail(firebaseUser.email);
  
  if (!user) {
    // Generate username from email
    let username = firebaseUser.email.split('@')[0];
    
    try {
      // Create a new user if none exists
      user = await userService.createUser({
        email: firebaseUser.email,
        username,
        role: defaultRole,
        firebaseUid: firebaseUser.uid,
        emailVerified: firebaseUser.email_verified || false,
        photoURL: firebaseUser.picture || null,
        phoneNumber: firebaseUser.phone_number || null
      });
    } catch (error) {
      // If username is taken, add a random suffix
      if (error.statusCode === httpStatus.BAD_REQUEST && error.message === 'Username already taken') {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        user = await userService.createUser({
          email: firebaseUser.email,
          username: `${username}${randomSuffix}`,
          role: defaultRole,
          firebaseUid: firebaseUser.uid,
          emailVerified: firebaseUser.email_verified || false,
          photoURL: firebaseUser.picture || null,
          phoneNumber: firebaseUser.phone_number || null
        });
      } else {
        throw error;
      }
    }
  }
  
  return user;
};

module.exports = {
  verifyFirebaseToken,
  getUserFromFirebase
};
