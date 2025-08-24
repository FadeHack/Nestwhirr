const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (userBody.username && await User.isUsernameTaken(userBody.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
  return User.findOne({ username });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.username && (await User.isUsernameTaken(updateBody.username, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Update user by email
 * @param {string} email
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByEmail = async (email, updateBody) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, user.id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.username && (await User.isUsernameTaken(updateBody.username, user.id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }

  await User.updateOne(
    { email },
    { $set: updateBody }
  );

  const updatedUser = await getUserByEmail(email);
  return updatedUser;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.deleteOne();
  return user;
};

/**
 * Add address to user
 * @param {ObjectId} userId
 * @param {Object} address
 * @returns {Promise<User>}
 */
const addAddress = async (userId, address) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.addresses.push(address);
  await user.save();
  return user;
};

/**
 * Get addresses from user
 * @param {ObjectId} userId
 * @param {Object} options
 * @returns {Promise<User>}
 */
const getAddresses = async (userId, options) => {
  const user = await getUserById(userId);
  return user.addresses;
};

/**
 * Get address from user
 * @param {ObjectId} userId
 * @param {ObjectId} addressId
 * @returns {Promise<User>}
 */
const getAddress = async (userId, addressId) => {
  const user = await getUserById(userId);
  const address = user.addresses.find((address) => address.id === addressId);
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  return address;
};

/**
 * Delete address from user
 * @param {ObjectId} userId
 * @param {ObjectId} addressId
 * @returns {Promise<User>}
 */
const deleteAddress = async (userId, addressId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.addresses = user.addresses.filter((address) => address.id !== addressId);
  await user.save();
  return user;
};

/**
 * Update address from user
 * @param {ObjectId} userId
 * @param {ObjectId} addressId
 * @param {Object} address
 * @returns {Promise<User>}
 */
const updateAddress = async (userId, addressId, address) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const addressIndex = user.addresses.findIndex((address) => address.id === addressId);
  if (addressIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...address };
  await user.save();
  return user;
};

/**
 * Get user with address
 * @param {string} userEmail
 * @param {ObjectId} addressId
 * @returns {Promise<User>}
 */
const getUserWithAddress = async (userEmail, addressId) => {
  const user = await getUserByEmail(userEmail);
  const address = user.addresses.find((address) => address.id === addressId);
  return address;
};

/**
 * Get user with populated role details
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const getUserWithRoleDetails = async (userId) => {
  const user = await User.findById(userId).populate('roleDetails');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUserById,
  deleteUserById,
  updateUserByEmail,
  addAddress,
  getAddresses,
  getAddress,
  deleteAddress,
  updateAddress,
  getUserWithAddress,
  getUserWithRoleDetails,
};
