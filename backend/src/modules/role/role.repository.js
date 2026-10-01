'use strict';

const Role = require('../../models/role.model');

class RoleRepository {
  async findByName(name) {
    return Role.findOne({ name: String(name).toUpperCase() }).populate('permissions');
  }
  async findById(id) {
    return Role.findById(id).populate('permissions');
  }
  async findAll() {
    return Role.find().populate('permissions').sort({ name: 1 });
  }
  async create(doc) {
    return Role.create(doc);
  }
  async updateById(id, update) {
    return Role.findByIdAndUpdate(id, update, { new: true }).populate('permissions');
  }
}

module.exports = new RoleRepository();
