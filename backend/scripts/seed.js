'use strict';

/**
 * Seed script — idempotent.
 *
 *   1. Create all canonical Permission rows.
 *   2. Create system Roles (ADMIN with everything, STAFF with VIEW_PROFILE).
 *   3. Create an initial ADMIN user from environment variables if no admin
 *      exists yet.
 *
 * Run with: `npm run seed`
 */

require('dotenv').config();

const mongoose = require('mongoose');
const env = require('../src/config/env');
const permissionRepo = require('../src/modules/permission/permission.repository');
const roleService = require('../src/modules/role/role.service');
const User = require('../src/models/user.model');
const { PERMISSIONS, ROLE_NAMES, ADMIN_PERMISSIONS } = require('../src/constants/permissions');
const logger = require('../src/utils/logger');

const PERMISSION_META = {
  CREATE_STAFF: { resource: 'staff', action: 'create' },
  UPDATE_STAFF: { resource: 'staff', action: 'update' },
  VIEW_STAFF: { resource: 'staff', action: 'view' },
  DELETE_STAFF: { resource: 'staff', action: 'delete' },
  ASSIGN_ROLE: { resource: 'role', action: 'assign' },
  VIEW_PROFILE: { resource: 'profile', action: 'view' },
  MANAGE_PERMISSION: { resource: 'permission', action: 'manage' },
  MANAGE_ROLE: { resource: 'role', action: 'manage' },
};

async function seedPermissions() {
  const items = Object.values(PERMISSIONS).map((name) => ({
    name,
    description: `${PERMISSION_META[name].action.toUpperCase()} on ${PERMISSION_META[name].resource}`,
    resource: PERMISSION_META[name].resource,
    action: PERMISSION_META[name].action,
  }));
  await permissionRepo.upsertMany(items);
  logger.info(`Seeded ${items.length} permissions`);
}

async function seedRoles() {
  await roleService.createSystemRole({
    name: ROLE_NAMES.ADMIN,
    description: 'Full-access administrator',
    permissions: ADMIN_PERMISSIONS,
  });
  await roleService.createSystemRole({
    name: ROLE_NAMES.STAFF,
    description: 'Standard staff (limited)',
    permissions: [PERMISSIONS.VIEW_PROFILE],
  });
  logger.info('Seeded roles (ADMIN, STAFF)');
}

async function seedAdmin() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminName = process.env.SEED_ADMIN_NAME || 'Administrator';
  if (!adminEmail || !adminPassword) {
    logger.warn('No SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD set — skipping admin user seed');
    return;
  }
  const existing = await User.findOne({ email: adminEmail.toLowerCase() });
  if (existing) {
    logger.info(`Admin user already exists: ${adminEmail}`);
    return;
  }
  const adminRole = await require('../src/modules/role/role.repository').findByName(
    ROLE_NAMES.ADMIN
  );
  const passwordHash = await User.hashPassword(adminPassword);
  await User.create({
    fullName: adminName,
    email: adminEmail.toLowerCase(),
    phone: process.env.SEED_ADMIN_PHONE || '+84000000000',
    address: '',
    username: process.env.SEED_ADMIN_USERNAME || 'admin',
    passwordHash,
    role: adminRole._id,
    isActive: true,
    mustChangePassword: false,
  });
  logger.info(`Seeded admin user: ${adminEmail}`);
}

async function main() {
  await mongoose.connect(env.mongodbUri, {
    dbName: env.mongodbDb,
    autoIndex: false,
  });
  logger.info('Connected — running seed');
  await seedPermissions();
  await seedRoles();
  await seedAdmin();
  await mongoose.disconnect();
  logger.info('Seed complete');
}

main().catch((err) => {
  logger.error(`Seed failed: ${err.message}`);
  process.exit(1);
});
