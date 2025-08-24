// Set NODE_ENV to 'development' if not already set
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const mongoose = require('mongoose');
const config = require('../config/config');
const { Role } = require('../models');
const { roles, rolePriorities } = require('../config/roles');
const logger = require('../config/logger');

/**
 * Function to populate roles in the database
 */
const populateRoles = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB for role population');

    // Check if roles already exist
    const existingRoles = await Role.find();
    if (existingRoles.length > 0) {
      logger.info(`${existingRoles.length} roles already exist in the database.`);
      
      // Update existing roles if needed
      for (const role of roles) {
        const existingRole = await Role.findOne({ name: role });
        if (existingRole) {
          logger.info(`Updating role: ${role}`);
          existingRole.priority = rolePriorities[role];
          await existingRole.save();
        } else {
          // Create missing role
          logger.info(`Creating missing role: ${role}`);
          await Role.create({
            name: role,
            description: `${role.charAt(0).toUpperCase() + role.slice(1)} role for the Reddit application`,
            permissions: require('../config/roles').roleRights.get(role),
            priority: rolePriorities[role]
          });
        }
      }
    } else {
      // Create all roles
      logger.info('No roles found. Creating all roles...');
      for (const role of roles) {
        await Role.create({
          name: role,
          description: `${role.charAt(0).toUpperCase() + role.slice(1)} role for the Reddit application`,
          permissions: require('../config/roles').roleRights.get(role),
          priority: rolePriorities[role]
        });
        logger.info(`Created role: ${role}`);
      }
    }

    logger.info('Role population completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error populating roles:', error);
    process.exit(1);
  }
};

// Run the population script
populateRoles();