'use strict';

const ApiError = require('../utils/ApiError');

/**
 * Authorisation middleware factory.
 * Usage:  router.post('/staff', authenticate, requirePermission('CREATE_STAFF'), handler)
 *
 * Decides purely from the JWT-populated role → permission map. No string
 * comparison against hard-coded roles lives in this file.
 */
function requirePermission(...required) {
  return function (req, _res, next) {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const role = req.user.role;
      if (!role) throw ApiError.forbidden('No role assigned to user');

      const granted = new Set(
        (role.permissions || []).map((p) => (typeof p === 'string' ? p : p.name))
      );
      const missing = required.filter((p) => !granted.has(p));
      if (missing.length > 0) {
        throw ApiError.forbidden(`Missing permission(s): ${missing.join(', ')}`);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = requirePermission;
