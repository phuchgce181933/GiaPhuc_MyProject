'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      unique: true,
      trim: true,
      match: [/^[0-9+\-\s()]{8,20}$/, 'Invalid phone format'],
    },
    address: { type: String, default: '', trim: true },
    dateOfBirth: { type: Date, default: null },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER', null],
      default: null,
    },
    avatar: { type: String, default: '' },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: { type: String, required: true, select: false },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: [true, 'Role is required'],
    },

    isActive: { type: Boolean, default: true },

    mustChangePassword: { type: Boolean, default: true },

    activationToken: { type: String, default: null, select: false },
    activationTokenExpires: { type: Date, default: null, select: false },
  },
  { timestamps: true }
);

userSchema.methods.verifyPassword = async function (plain) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = async function (plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

/**
 * Strip sensitive fields before returning the document to a client.
 */
userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject({ depopulate: false });
  delete obj.passwordHash;
  delete obj.activationToken;
  delete obj.activationTokenExpires;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
