'use strict';

const repo = require('./permission.repository');
const ApiError = require('../../utils/ApiError');

class PermissionService {
  async list() {
    const items = await repo.findAll();
    return items.map((p) => ({ id: p._id, name: p.name, description: p.description }));
  }

  async ensureExists(name, description = '', resource = '', action = '') {
    const existing = await repo.findByName(name);
    if (existing) return existing;
    return repo.create({
      name: String(name).toUpperCase(),
      description,
      resource,
      action,
    });
  }

  async resolveMany(names) {
    const found = await Promise.all(names.map((n) => repo.findByName(n)));
    const missing = names.filter((_, i) => !found[i]);
    if (missing.length) {
      throw ApiError.internal(`Permissions not initialised: ${missing.join(', ')}`);
    }
    return found;
  }
}

module.exports = new PermissionService();
