'use strict';

const { z } = require('zod');

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId');

const createStaffSchema = z.object({
  fullName: z.string().trim().min(1, 'fullName is required').max(120),
  email: z.string().trim().toLowerCase().email('Invalid email'),
  phone: z.string().trim().min(8).max(20).regex(/^[0-9+\-\s()]+$/, 'Invalid phone'),
  address: z.string().trim().max(255).default(''),
  dateOfBirth: z.coerce.date().nullish(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).nullish(),
  avatar: z.string().default(''),
  username: z.string().trim().toLowerCase().min(3).max(50).optional(),
  roleId: objectId,
  temporaryPassword: z.string().min(8).max(64).optional(),
});

const updateStaffSchema = z
  .object({
    fullName: z.string().trim().min(1).max(120).optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    phone: z.string().trim().min(8).max(20).regex(/^[0-9+\-\s()]+$/).optional(),
    address: z.string().trim().max(255).optional(),
    dateOfBirth: z.coerce.date().nullish(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).nullish(),
    avatar: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });

const assignRoleSchema = z.object({
  roleId: objectId,
});

const updateStatusSchema = z.object({
  isActive: z.boolean({ required_error: 'isActive is required' }),
});

const staffIdParamSchema = z.object({
  id: objectId,
});

module.exports = {
  createStaffSchema,
  updateStaffSchema,
  assignRoleSchema,
  updateStatusSchema,
  staffIdParamSchema,
};
