'use strict';

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: { type: String, default: '' },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        default: [],
      },
    ],
    isSystem: { type: Boolean, default: false }, // cannot be deleted
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
