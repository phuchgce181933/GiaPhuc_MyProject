'use strict';

const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Permission name is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: { type: String, default: '' },
    resource: { type: String, required: true, trim: true },
    action: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Permission', permissionSchema);
