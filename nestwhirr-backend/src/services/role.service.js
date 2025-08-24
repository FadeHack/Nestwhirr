const httpStatus = require('http-status');
const { Role } = require('../models');
const ApiError = require('../utils/ApiError');
const { get } = require('mongoose');
const { rolePriorities } = require('../config/roles');

/**
 * Create a new role
 * @param {object} roleBody 
 * @returns {Promise<Role>}
 */
const createRole = async (roleBody) => {
    try {
        const existingRole = await getRoleDetailsByName(roleBody.name);
        if (existingRole) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Role already exists');
        }
    } catch (error) {
        if (error.statusCode !== httpStatus.NOT_FOUND) {
            throw error;
        }
        // Role not found, which is what we want when creating a new role
    }
    
    // Set default priority if not provided
    if (!roleBody.priority && roleBody.name) {
        roleBody.priority = rolePriorities[roleBody.name] || 0;
    }
    
    return Role.create(roleBody);
}

/**
 * Get role details by name
 * @param {string} roleName 
 * @returns {Promise<Role>}
 */
const getRoleDetailsByName = async (roleName) => {
    const role = await Role.findOne({ name: roleName });
    if (!role) {
        throw new ApiError(httpStatus.NOT_FOUND, `Role '${roleName}' not found`);
    }
    return role;
}

/**
 * Get role details by ID
 * @param {string} roleId 
 * @returns {Promise<Role>}
 */
const getRoleDetailsById = async (roleId) => {
    const role = await Role.findById(roleId);
    if (!role) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    }
    return role;
}

/**
 * Query roles with pagination
 * @param {object} filter 
 * @param {object} options 
 * @returns {Promise<QueryResult>}
 */
const queryRoles = async (filter, options) => {
    // Exclude highest priority roles by default, unless explicitly requested
    if (!filter.priority) {
        const maxDisplayablePriority = Math.max(...Object.values(rolePriorities)) - 1;
        filter.priority = { $lte: maxDisplayablePriority };
    }
    
    const roles = await Role.paginate(filter, options);
    return roles;
}

/**
 * Delete a role by ID
 * @param {string} roleId 
 * @returns {Promise<Role>}
 */
const deleteRole = async (roleId) => {
    const role = await getRoleDetailsById(roleId);
    
    // Check if role can be deleted based on priority
    if (role.priority > 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot delete this role');
    }
    
    await role.deleteOne();
    return role;
}

/**
 * Update a role by ID
 * @param {string} roleId 
 * @param {object} updateBody 
 * @returns {Promise<Role>}
 */
const updateRole = async (roleId, updateBody) => {
    const role = await getRoleDetailsById(roleId);
    
    // Check if role can be updated based on priority
    if (role.priority > 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot update this role');
    }
    
    // If changing the name, check it doesn't conflict with an existing role
    if (updateBody.name && updateBody.name !== role.name) {
        try {
            const existingRole = await getRoleDetailsByName(updateBody.name);
            if (existingRole) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Role name already exists');
            }
        } catch (error) {
            if (error.statusCode !== httpStatus.NOT_FOUND) {
                throw error;
            }
            // Role not found, which is good when changing name
        }
    }
    
    // Set correct priority if changing the name
    if (updateBody.name && !updateBody.priority) {
        updateBody.priority = rolePriorities[updateBody.name] || 0;
    }
    
    Object.assign(role, updateBody);
    await role.save();
    return role;
}

module.exports = {
    createRole,
    getRoleDetailsByName,
    getRoleDetailsById,
    queryRoles,
    deleteRole,
    updateRole
}