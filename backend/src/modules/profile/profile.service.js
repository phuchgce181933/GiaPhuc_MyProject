'use strict';

const userRepo = require('../staff/user.repository');
const ApiError = require('../../utils/ApiError');

/**
 * Profile service — separates "see own profile" (any authenticated user) from
 * "see another user's profile" (requires VIEW_PROFILE permission, as decided
 * by the calling middleware).
 */
class ProfileService {
  async getOwnProfile(user) {
    const full = await userRepo.findById(user._id);
    if (!full) throw ApiError.notFound('User not found');
    return full.toSafeJSON();
  }

  async getById(id) {
    const full = await userRepo.findById(id);
    if (!full) throw ApiError.notFound('Staff not found');
    return full.toSafeJSON();
  }
}

module.exports = new ProfileService();
