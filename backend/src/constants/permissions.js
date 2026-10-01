'use strict';

/**
 * Application-wide permission constants.
 * Keep these as canonical strings — they are persisted in MongoDB.
 */

const PERMISSIONS = Object.freeze({
  CREATE_STAFF: 'CREATE_STAFF',
  UPDATE_STAFF: 'UPDATE_STAFF',
  VIEW_STAFF: 'VIEW_STAFF',
  DELETE_STAFF: 'DELETE_STAFF',
  ASSIGN_ROLE: 'ASSIGN_ROLE',
  VIEW_PROFILE: 'VIEW_PROFILE',
  MANAGE_PERMISSION: 'MANAGE_PERMISSION',
  MANAGE_ROLE: 'MANAGE_ROLE',
});

const ROLE_NAMES = Object.freeze({
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
});

const ADMIN_PERMISSIONS = Object.values(PERMISSIONS);

module.exports = { PERMISSIONS, ROLE_NAMES, ADMIN_PERMISSIONS };
