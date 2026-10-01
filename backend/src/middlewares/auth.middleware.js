'use strict';

const { verifyAccessToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');

/**
 * Authentication middleware.
 * Reads `Authorization: Bearer <token>`, validates JWT, loads the user, and
 * attaches `req.user` for downstream middlewares/controllers.
 */
async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing or malformed Authorization header');
    }
    const token = header.slice('Bearer '.length).trim();
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.sub)
      .populate({ path: 'role', populate: { path: 'permissions' } });
    if (!user) throw ApiError.unauthorized('User not found');
    if (!user.isActive) throw ApiError.forbidden('Account is deactivated');

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authenticate;
