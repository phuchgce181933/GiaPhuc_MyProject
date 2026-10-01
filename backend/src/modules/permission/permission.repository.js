'use strict';

const Permission = require('../../models/permission.model');

class PermissionRepository {
  async findByName(name) {
    return Permission.findOne({ name: String(name).toUpperCase() });
  }

  async findById(id) {
    return Permission.findById(id);
  }

  async findAll() {
    return Permission.find().sort({ name: 1 });
  }

  async create(doc) {
    return Permission.create(doc);
  }

  async upsertMany(items) {
    const ops = items.map((item) => ({
      updateOne: {
        filter: { name: item.name },
        update: { $setOnInsert: item },
        upsert: true,
      },
    }));
    if (ops.length === 0) return [];
    return Permission.bulkWrite(ops);
  }
}

module.exports = new PermissionRepository();
