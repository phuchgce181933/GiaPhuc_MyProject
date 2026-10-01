'use strict';

const repo = require('./role.repository');
const permissionService = require('../permission/permission.service');
const ApiError = require('../../utils/ApiError');

class RoleService {
  async list() {
    const roles = await repo.findAll();
    return roles.map((r) => ({
      id: r._id,
      name: r.name,
      description: r.description,
      isSystem: r.isSystem,
      permissions: (r.permissions || []).map((p) => p.name),
    }));
  }

  async getById(id) {
    const r = await repo.findById(id);
    if (!r) throw ApiError.notFound('Role not found');
    return {
      id: r._id,
      name: r.name,
      description: r.description,
      isSystem: r.isSystem,
      permissions: (r.permissions || []).map((p) => p.name),
    };
  }

  async findByName(name) {
    return repo.findByName(name);
  }

  async createSystemRole({ name, description, permissions }) {
    const exists = await repo.findByName(name);
    if (exists) return exists;
    const permDocs = await permissionService.resolveMany(permissions);
    return repo.create({
      name: String(name).toUpperCase(),
      description,
      permissions: permDocs.map((p) => p._id),
      isSystem: true,
    });
  }
}

module.exports = new RoleService();
