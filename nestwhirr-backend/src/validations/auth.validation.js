const Joi = require('joi');
const { password } = require('./custom.validation');

/**
 * Schema for validating user registration
 * Used for registering a user after Firebase authentication
 */
const register = {
  body: Joi.object().keys({
    idToken: Joi.string().required(),
    username: Joi.string().required().min(3).max(30),
  }),
};

/**
 * Schema for validating login
 * Uses Firebase token for authentication
 */
const login = {
  body: Joi.object().keys({
    idToken: Joi.string().required(),
  }),
};

/**
 * Schema for validating user preference updates
 */
const userPreference = {
  body: Joi.object().keys({
    username: Joi.string().min(3).max(30),
    photoURL: Joi.string(),
    phoneNumber: Joi.string(),
  }).min(1)
};

/**
 * Schema for validating Firebase login with idToken
 */
const firebaseLogin = {
  body: Joi.object().keys({
    idToken: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  userPreference,
  firebaseLogin
};
