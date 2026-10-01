'use strict';

const crypto = require('crypto');
const userRepo = require('./user.repository');
const roleRepo = require('../role/role.repository');
const emailService = require('../../services/email.service');
const ApiError = require('../../utils/ApiError');
const env = require('../../config/env');
const logger = require('../../utils/logger');

/**
 * Generate a human-readable temporary password. Not used as a security
 * primitive — only for the one-time email + first-login flow.
 */
function generateTemporaryPassword() {
  // 10 chars, mixed case + digits, easy to copy from email
  const alphabet =
    'ABCDEFGHJKMNPQRSTUVWXYZ' + // omit I, L, O
    'abcdefghjkmnpqrstuvwxyz' + // omit l
    '23456789'; // omit 0, 1
  const bytes = crypto.randomBytes(12);
  let out = '';
  for (let i = 0; i < 10; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

class StaffService {
  /**
   * Create a new staff account.
   * Throws ApiError on validation / not-found / duplicate.
   * Never throws on email failure — returns the email status alongside the
   * created user so the controller can report both correctly.
   */
  async createStaff(input, actor) {
    const { roleId, temporaryPassword, ...rest } = input;

    // 1. Role must exist
    const role = await roleRepo.findById(roleId);
    if (!role) throw ApiError.badRequest('Role not found', { field: 'roleId' });

    // 2. Duplicate checks (explicit + index as a safety net)
    const dupeChecks = [
      ['email', await userRepo.findByEmail(rest.email)],
      ['phone', await userRepo.findByPhone(rest.phone)],
    ];
    if (rest.username) {
      dupeChecks.push(['username', await userRepo.findByUsername(rest.username)]);
    }
    for (const [field, hit] of dupeChecks) {
      if (hit) {
        throw ApiError.conflict(`Duplicate ${field}: ${rest[field] ?? hit[field]}`);
      }
    }

    // 3. Password setup
    const plainPassword = temporaryPassword || generateTemporaryPassword();
    const passwordHash = await require('../../models/user.model').hashPassword(plainPassword);

    // 4. Persist
    const user = await userRepo.create({
      ...rest,
      role: role._id,
      passwordHash,
      isActive: true,
      mustChangePassword: true,
    });

    logger.info('Staff account created successfully', {
      userId: String(user._id),
      createdBy: actor ? String(actor._id) : 'system',
    });

    // 5. Send email (do NOT throw — see spec)
    const roleName = role.name;
    const loginUrl = `${env.frontendUrl}/login`;
    const emailResult = await emailService.sendStaffAccountCreatedEmail({
      to: rest.email,
      fullName: rest.fullName,
      roleName,
      loginUrl,
      temporaryPassword: plainPassword,
    });

    return {
      user: await userRepo.findById(user._id),
      emailNotificationSent: emailResult.ok,
      emailError: emailResult.ok ? null : emailResult.error,
    };
  }

  async listStaff({ page, limit }) {
    const { items, total } = await userRepo.findAll({ page, limit });
    return {
      items: items.map((u) => u.toSafeJSON()),
      total,
      page,
      limit,
    };
  }

  async getStaff(id) {
    const user = await userRepo.findById(id);
    if (!user) throw ApiError.notFound('Staff not found');
    return user.toSafeJSON();
  }

  async updateStaff(id, patch) {
    const existing = await userRepo.findById(id);
    if (!existing) throw ApiError.notFound('Staff not found');

    // Duplicate re-check when email/phone change
    if (patch.email && patch.email !== existing.email) {
      const dupe = await userRepo.findByEmail(patch.email);
      if (dupe && String(dupe._id) !== String(id)) {
        throw ApiError.conflict(`Duplicate email: ${patch.email}`);
      }
    }
    if (patch.phone && patch.phone !== existing.phone) {
      const dupe = await userRepo.findByPhone(patch.phone);
      if (dupe && String(dupe._id) !== String(id)) {
        throw ApiError.conflict(`Duplicate phone: ${patch.phone}`);
      }
    }

    const updated = await userRepo.updateById(id, patch);
    logger.info('Staff account updated', { userId: id });
    return updated.toSafeJSON();
  }

  async assignRole(id, roleId) {
    const role = await roleRepo.findById(roleId);
    if (!role) throw ApiError.badRequest('Role not found', { field: 'roleId' });
    const user = await userRepo.findById(id);
    if (!user) throw ApiError.notFound('Staff not found');
    const updated = await userRepo.setRole(id, role._id);
    logger.info('Role assigned', { userId: id, role: role.name });
    return updated.toSafeJSON();
  }

  async setActive(id, isActive) {
    const user = await userRepo.findById(id);
    if (!user) throw ApiError.notFound('Staff not found');
    const updated = await userRepo.setActive(id, isActive);
    logger.info('Staff status changed', { userId: id, isActive });
    return updated.toSafeJSON();
  }
}

// Re-export so service has no direct dependency on the model module path
module.exports = new StaffService();
