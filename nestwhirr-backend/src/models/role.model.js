const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { roles, rolePriorities } = require('../config/roles');

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            enum: roles,
            unique: true,
        },
        description: {
            type: String,
            required: false,
            trim: true,
        },
        permissions: [
            {
                _id: false,
                type: String,
                required: true,
            },
        ],
        priority: {
            type: Number,
            default: function() {
                return rolePriorities[this.name] || 0;
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

// Apply plugins
roleSchema.plugin(toJSON);
roleSchema.plugin(paginate);

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
