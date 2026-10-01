'use strict';

require('../setup');
const validate = require('../../src/middlewares/validate.middleware');
const { createStaffSchema } = require('../../src/modules/staff/staff.validator');

function run(schema, data, source = 'body') {
  const mw = validate(schema, source);
  const req = { [source]: data };
  return new Promise((resolve) => {
    mw(req, {}, (err) => resolve({ req, err }));
  });
}

describe('staff.validator (createStaffSchema)', () => {
  test('N — passes a valid payload and lowercases email', async () => {
    const { req, err } = await run(createStaffSchema, {
      fullName: 'Nguyen Van Test',
      email: '  NVTEST@Example.COM ',
      phone: '0901234567',
      roleId: '66f1a2b3c4d5e6f789012999',
    });
    expect(err).toBeUndefined();
    expect(req.body.email).toBe('nvtest@example.com');
    expect(req.body.address).toBe('');
    expect(req.body.avatar).toBe('');
  });

  test('A — rejects invalid email', async () => {
    const { err } = await run(createStaffSchema, {
      fullName: 'Nguyen Van Test',
      email: 'not-an-email',
      phone: '0901234567',
      roleId: '66f1a2b3c4d5e6f789012999',
    });
    expect(err).toBeDefined();
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('BAD_REQUEST');
  });

  test('A — rejects missing required field fullName', async () => {
    const { err } = await run(createStaffSchema, {
      email: 'ok@example.com',
      phone: '0901234567',
      roleId: '66f1a2b3c4d5e6f789012999',
    });
    expect(err.statusCode).toBe(400);
    expect(err.details[0].path).toBe('fullName');
  });

  test('A — rejects invalid roleId (not an ObjectId)', async () => {
    const { err } = await run(createStaffSchema, {
      fullName: 'Nguyen Van Test',
      email: 'ok@example.com',
      phone: '0901234567',
      roleId: 'not-an-objectid',
    });
    expect(err.statusCode).toBe(400);
    expect(err.details[0].path).toBe('roleId');
  });

  test('A — rejects invalid phone format', async () => {
    const { err } = await run(createStaffSchema, {
      fullName: 'Nguyen Van Test',
      email: 'ok@example.com',
      phone: 'abc',
      roleId: '66f1a2b3c4d5e6f789012999',
    });
    expect(err.statusCode).toBe(400);
  });
});
