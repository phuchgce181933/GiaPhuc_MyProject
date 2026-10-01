'use strict';

const User = require('../../models/user.model');

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email: String(email).toLowerCase() });
  }
  async findByPhone(phone) {
    return User.findOne({ phone });
  }
  async findByUsername(username) {
    if (!username) return null;
    return User.findOne({ username: String(username).toLowerCase() });
  }
  async findById(id) {
    return User.findById(id).populate({ path: 'role', populate: { path: 'permissions' } });
  }
  async findAll({ page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      User.find()
        .populate({ path: 'role', populate: { path: 'permissions' } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(),
    ]);
    return { items, total, page, limit };
  }
  async create(doc) {
    return User.create(doc);
  }
  async updateById(id, update) {
    return User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).populate({
      path: 'role',
      populate: { path: 'permissions' },
    });
  }
  async setRole(id, roleId) {
    return User.findByIdAndUpdate(id, { role: roleId }, { new: true }).populate({
      path: 'role',
      populate: { path: 'permissions' },
    });
  }
  async setActive(id, isActive) {
    return User.findByIdAndUpdate(id, { isActive }, { new: true }).populate({
      path: 'role',
      populate: { path: 'permissions' },
    });
  }
}

module.exports = new UserRepository();
