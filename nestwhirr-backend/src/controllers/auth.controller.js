const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService, roleService, emailService } = require('../services');
const admin = require('../config/firebase');
const { defaultRole } = require('../config/roles');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const { idToken, username } = req.body;
  
  // Verify the Firebase ID Token
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const email = decodedToken.email;
  
  // Check if user already exists
  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }
  
  // Get role details
  const roleDetails = await roleService.getRoleDetailsByName(defaultRole);
  
  // Create user in our database
  const userCreateBody = { 
    email, 
    username,
    role: defaultRole,
    roleDetails: roleDetails._id,
    firebaseUid: decodedToken.uid,
    emailVerified: decodedToken.email_verified || false,
    photoURL: decodedToken.picture || null,
    phoneNumber: decodedToken.phone_number || null
  };
  
  const user = await userService.createUser(userCreateBody);
  
  // Send welcome email
  // await emailService.sendWelcomeEmail(email, username);
  
  res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  
  // Verify the Firebase ID Token
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const email = decodedToken.email;
  
  // Get user from database
  const user = await userService.getUserByEmail(email);
  
  if (!user) {
    res.status(httpStatus.NOT_FOUND).send({ message: 'User not found' });
    return;
  }
  
  res.send({ user });
});

const userPreference = catchAsync(async (req, res) => {
  const userPreference = req.body;
  const updatedUser = await userService.updateUserByEmail(req.user.email, userPreference);
  res.send({ user: updatedUser });
});

const firebaseLogin = catchAsync(async (req, res) => {
  const { idToken } = req.body;

  // Verify the Firebase ID Token
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const email = decodedToken.email;

  // Check if the user exists in your database
  let user = await userService.getUserByEmail(email);

  if (!user) {
    // Get role details for a new user
    const roleDetails = await roleService.getRoleDetailsByName(defaultRole);
    
    // Generate a username from email if not provided
    const username = email.split('@')[0];
    
    // Create a new user if they don't exist
    try {
      user = await userService.createUser({
        email: decodedToken.email,
        username,
        role: defaultRole,
        roleDetails: roleDetails._id,
        firebaseUid: decodedToken.uid,
        emailVerified: decodedToken.email_verified || false,
        photoURL: decodedToken.picture || null,
        phoneNumber: decodedToken.phone_number || null
      });
    } catch (error) {
      // If username is taken, add a random suffix
      if (error.statusCode === httpStatus.BAD_REQUEST && error.message === 'Username already taken') {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        user = await userService.createUser({
          email: decodedToken.email,
          username: `${username}${randomSuffix}`,
          role: defaultRole,
          roleDetails: roleDetails._id,
          firebaseUid: decodedToken.uid,
          emailVerified: decodedToken.email_verified || false,
          photoURL: decodedToken.picture || null,
          phoneNumber: decodedToken.phone_number || null
        });
      } else {
        throw error;
      }
    }
    
    // Send welcome email for new users
    // await emailService.sendWelcomeEmail(email, user.username);
  }

  res.send({ user });
});

/**
 * Get the current authenticated user
 * This endpoint relies on the auth middleware to verify the token
 * and attach the user to the request object
 */
const getCurrentUser = catchAsync(async (req, res) => {
  // req.user is set by the auth middleware
  const user = await userService.getUserById(req.user.id);
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Optionally populate additional user data if needed
  const populatedUser = await userService.getUserWithRoleDetails(user.id);
  
  res.send({ user: populatedUser });
});

module.exports = {
  register,
  login,
  userPreference,
  firebaseLogin,
  getCurrentUser
};
