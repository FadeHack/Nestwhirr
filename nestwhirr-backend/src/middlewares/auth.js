const admin = require('../config/firebase');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { User } = require('../models');

/**
 * Auth middleware for verifying Firebase tokens and checking user permissions
 * 
 * @param {...string} requiredRights - The required permissions to access the route
 * @returns {Function} Express middleware
 */
const auth = (...requiredRights) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Get user from our database using Firebase UID or email
    const user = await User.findOne({ email: decodedToken.email }).populate('roleDetails');
    
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }
    
    // Check if user or role is active
    if (user.status === 'inactive' || (user.roleDetails && !user.roleDetails.isActive)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'User account is inactive');
    }
    
    req.user = user;
    req.firebaseUser = decodedToken;
    
    // Check if user has required permissions
    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      
      if (!userRights) {
        throw new ApiError(httpStatus.FORBIDDEN, 'User role has no defined permissions');
      }
      
      const hasRequiredRights = requiredRights.every((requiredRight) => 
        userRights.includes(requiredRight)
      );
      
      if (!hasRequiredRights && req.params.userId !== user.id) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions');
      }
    }
    
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
  }
};

module.exports = auth;
