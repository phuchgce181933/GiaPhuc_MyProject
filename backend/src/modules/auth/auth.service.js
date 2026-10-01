'use strict';

const userRepo = require('../staff/user.repository');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../../utils/jwt');
const ApiError = require('../../utils/ApiError');
const logger = require('../../utils/logger');

class AuthService {
  async login({ email, password }) {
    // passwordHash is select:false on User model; opt-in explicitly here.
    const user = await require('../../models/user.model')
      .findOne({ email: String(email).toLowerCase() })
      .select('+passwordHash')
      .populate({ path: 'role', populate: { path: 'permissions' } });
    if (!user) throw ApiError.unauthorized('Invalid credentials');

    const ok = await user.verifyPassword(password);
    if (!ok) throw ApiError.unauthorized('Invalid credentials');
    if (!user.isActive) throw ApiError.forbidden('Account is deactivated');

    const payload = { sub: String(user._id), role: user.role ? user.role.name : null };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ sub: payload.sub });

    logger.info('User logged in', { userId: String(user._id) });

    return {
      accessToken,
      refreshToken,
      user: user.toSafeJSON(),
    };
  }

  async refresh(token) {
    const decoded = verifyRefreshToken(token);
    const user = await userRepo.findById(decoded.sub);
    if (!user) throw ApiError.unauthorized('User not found');
    if (!user.isActive) throw ApiError.forbidden('Account is deactivated');
    const payload = { sub: String(user._id), role: user.role ? user.role.name : null };
    return { accessToken: signAccessToken(payload) };
  }
}

module.exports = new AuthService();
