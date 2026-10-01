'use strict';

require('../setup');
const bcrypt = require('bcryptjs');
const ApiError = require('../../src/utils/ApiError');

jest.mock('../../src/modules/staff/user.repository');
jest.mock('../../src/modules/role/role.repository');
jest.mock('../../src/services/email.service');

const userRepo = require('../../src/modules/staff/user.repository');
const roleRepo = require('../../src/modules/role/role.repository');
const emailService = require('../../src/services/email.service');
const UserModel = require('../../src/models/user.model');
const staffService = require('../../src/modules/staff/staff.service');

const fakeRole = {
  _id: '66f1a2b3c4d5e6f789012999',
  name: 'STAFF',
};

const fakeCreatedUser = {
  _id: '66f1a2b3c4d5e6f789012777',
  fullName: 'Nguyen Van Test',
  email: 'nguyenvantest@example.com',
  phone: '0901234567',
  role: fakeRole,
  isActive: true,
  toSafeJSON() {
    return {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      role: this.role,
      isActive: this.isActive,
    };
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  // Make hashPassword deterministic-ish but real (so we can verify it hashes)
  jest.spyOn(UserModel, 'hashPassword').mockImplementation(async (plain) => {
    return bcrypt.hash(plain, 4);
  });
});

describe('StaffService.createStaff', () => {
  test('N — creates staff successfully and sends email', async () => {
    roleRepo.findById.mockResolvedValue(fakeRole);
    userRepo.findByEmail.mockResolvedValue(null);
    userRepo.findByPhone.mockResolvedValue(null);
    userRepo.findByUsername.mockResolvedValue(null);
    userRepo.create.mockResolvedValue(fakeCreatedUser);
    userRepo.findById.mockResolvedValue(fakeCreatedUser);
    emailService.sendStaffAccountCreatedEmail.mockResolvedValue({ ok: true, messageId: 'm-1' });

    const result = await staffService.createStaff(
      {
        fullName: 'Nguyen Van Test',
        email: 'nguyenvantest@example.com',
        phone: '0901234567',
        roleId: fakeRole._id,
      },
      { _id: 'admin-id' }
    );

    expect(result.emailNotificationSent).toBe(true);
    expect(result.user._id).toBe(fakeCreatedUser._id);
    expect(userRepo.create).toHaveBeenCalledTimes(1);
    const createdArg = userRepo.create.mock.calls[0][0];
    expect(createdArg.email).toBe('nguyenvantest@example.com');
    expect(createdArg.passwordHash).toMatch(/^\$2[aby]\$/); // bcrypt format
    expect(emailService.sendStaffAccountCreatedEmail).toHaveBeenCalledTimes(1);
  });

  test('A — duplicate email throws Conflict', async () => {
    roleRepo.findById.mockResolvedValue(fakeRole);
    userRepo.findByEmail.mockResolvedValue({ _id: 'dup-id', email: 'nguyenvantest@example.com' });

    await expect(
      staffService.createStaff(
        {
          fullName: 'Nguyen Van Test',
          email: 'nguyenvantest@example.com',
          phone: '0901234567',
          roleId: fakeRole._id,
        },
        { _id: 'admin-id' }
      )
    ).rejects.toBeInstanceOf(ApiError);

    try {
      await staffService.createStaff(
        {
          fullName: 'Nguyen Van Test',
          email: 'nguyenvantest@example.com',
          phone: '0901234567',
          roleId: fakeRole._id,
        },
        { _id: 'admin-id' }
      );
    } catch (err) {
      expect(err.statusCode).toBe(409);
      expect(err.message).toMatch(/email/i);
    }
    expect(userRepo.create).not.toHaveBeenCalled();
  });

  test('A — duplicate phone throws Conflict', async () => {
    roleRepo.findById.mockResolvedValue(fakeRole);
    userRepo.findByEmail.mockResolvedValue(null);
    userRepo.findByPhone.mockResolvedValue({ _id: 'dup-id', phone: '0901234567' });

    await expect(
      staffService.createStaff(
        {
          fullName: 'Nguyen Van Test',
          email: 'nguyenvantest@example.com',
          phone: '0901234567',
          roleId: fakeRole._id,
        },
        { _id: 'admin-id' }
      )
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(userRepo.create).not.toHaveBeenCalled();
  });

  test('A — invalid role (roleId not found) throws BadRequest', async () => {
    roleRepo.findById.mockResolvedValue(null);

    await expect(
      staffService.createStaff(
        {
          fullName: 'Nguyen Van Test',
          email: 'nguyenvantest@example.com',
          phone: '0901234567',
          roleId: '66f1a2b3c4d5e6f789012999',
        },
        { _id: 'admin-id' }
      )
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test('A — email sending failure does not throw; account is still created', async () => {
    roleRepo.findById.mockResolvedValue(fakeRole);
    userRepo.findByEmail.mockResolvedValue(null);
    userRepo.findByPhone.mockResolvedValue(null);
    userRepo.create.mockResolvedValue(fakeCreatedUser);
    userRepo.findById.mockResolvedValue(fakeCreatedUser);
    emailService.sendStaffAccountCreatedEmail.mockResolvedValue({
      ok: false,
      error: 'smtp-down',
    });

    const result = await staffService.createStaff(
      {
        fullName: 'Nguyen Van Test',
        email: 'nguyenvantest@example.com',
        phone: '0901234567',
        roleId: fakeRole._id,
      },
      { _id: 'admin-id' }
    );

    expect(userRepo.create).toHaveBeenCalled();
    expect(result.emailNotificationSent).toBe(false);
    expect(result.emailError).toBe('smtp-down');
  });

  test('N — provided temporaryPassword is honoured and hashed', async () => {
    roleRepo.findById.mockResolvedValue(fakeRole);
    userRepo.findByEmail.mockResolvedValue(null);
    userRepo.findByPhone.mockResolvedValue(null);
    userRepo.create.mockResolvedValue(fakeCreatedUser);
    userRepo.findById.mockResolvedValue(fakeCreatedUser);
    emailService.sendStaffAccountCreatedEmail.mockResolvedValue({ ok: true });

    await staffService.createStaff(
      {
        fullName: 'Phuc Staff',
        email: 'phuc.staff@gmail',
        // Note: schema validation is upstream of service in real flow; service
        // still receives what callers pass. Here we just verify hashing.
        phone: '0987654321',
        roleId: fakeRole._id,
        temporaryPassword: 'Sup3rSecret!',
      },
      { _id: 'admin-id' }
    );

    const createdArg = userRepo.create.mock.calls[0][0];
    expect(createdArg.passwordHash).not.toBe('Sup3rSecret!');
    const matches = await bcrypt.compare('Sup3rSecret!', createdArg.passwordHash);
    expect(matches).toBe(true);
  });

  test('B — empty temporaryPassword generates a non-empty fallback', async () => {
    roleRepo.findById.mockResolvedValue(fakeRole);
    userRepo.findByEmail.mockResolvedValue(null);
    userRepo.findByPhone.mockResolvedValue(null);
    userRepo.create.mockResolvedValue(fakeCreatedUser);
    userRepo.findById.mockResolvedValue(fakeCreatedUser);
    emailService.sendStaffAccountCreatedEmail.mockResolvedValue({ ok: true });

    const emailArgCapture = jest.fn();
    emailService.sendStaffAccountCreatedEmail.mockImplementation(async (args) => {
      emailArgCapture(args);
      return { ok: true };
    });

    await staffService.createStaff(
      {
        fullName: 'No Pass',
        email: 'nopass@example.com',
        phone: '0900000000',
        roleId: fakeRole._id,
      },
      { _id: 'admin-id' }
    );

    const args = emailArgCapture.mock.calls[0][0];
    expect(typeof args.temporaryPassword).toBe('string');
    expect(args.temporaryPassword.length).toBeGreaterThanOrEqual(8);
  });
});

describe('StaffService.assignRole / setActive / getStaff', () => {
  test('N — assignRole updates the user and returns safe DTO', async () => {
    const newRole = { _id: '66f1a2b3c4d5e6f789012000', name: 'ADMIN' };
    roleRepo.findById.mockResolvedValue(newRole);
    userRepo.findById.mockResolvedValueOnce(fakeCreatedUser);
    userRepo.setRole.mockResolvedValue({ ...fakeCreatedUser, role: newRole });

    const dto = await staffService.assignRole(fakeCreatedUser._id, newRole._id);
    expect(dto.role._id).toBe(newRole._id);
    expect(dto.passwordHash).toBeUndefined();
  });

  test('A — assignRole with unknown roleId throws 400', async () => {
    roleRepo.findById.mockResolvedValue(null);
    await expect(
      staffService.assignRole(fakeCreatedUser._id, '66f1a2b3c4d5e6f789012999')
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test('N — setActive toggles isActive', async () => {
    userRepo.findById.mockResolvedValue(fakeCreatedUser);
    userRepo.setActive.mockResolvedValue({ ...fakeCreatedUser, isActive: false });
    const dto = await staffService.setActive(fakeCreatedUser._id, false);
    expect(dto.isActive).toBe(false);
  });

  test('A — setActive on missing user throws 404', async () => {
    userRepo.findById.mockResolvedValue(null);
    await expect(staffService.setActive('66f1a2b3c4d5e6f789012777', true)).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
