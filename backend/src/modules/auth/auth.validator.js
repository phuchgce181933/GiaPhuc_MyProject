'use strict';

const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email'),
  password: z.string().min(1, 'password is required'),
});

module.exports = { loginSchema };
