'use strict';

require('../setup');

const requirePermission = require('../../src/middlewares/permission.middleware');
const ApiError = require('../../src/utils/ApiError');

function buildRes() {
  return {};
}

function buildReq(user) {
  return { user };
}

function runMiddleware(mw, req) {
  return new Promise((resolve) => {
    mw(req, buildRes(), (err) => resolve(err));
  });
}

describe('permission.middleware (requirePermission)', () => {
  test('N — passes when role has the required permission', async () => {
    const req = buildReq({ role: { name: 'ADMIN', permissions: [{ name: 'CREATE_STAFF' }] } });
    const err = await runMiddleware(requirePermission('CREATE_STAFF'), req);
    expect(err).toBeUndefined();
  });

  test('A — fails 403 when role is missing the permission', async () => {
    const req = buildReq({ role: { name: 'STAFF', permissions: [{ name: 'VIEW_PROFILE' }] } });
    const err = await runMiddleware(requirePermission('CREATE_STAFF'), req);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.statusCode).toBe(403);
    expect(err.message).toMatch(/CREATE_STAFF/);
  });

  test('A — fails 401 when there is no authenticated user', async () => {
    const req = buildReq(undefined);
    const err = await runMiddleware(requirePermission('VIEW_PROFILE'), req);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.statusCode).toBe(401);
  });

  test('A — fails 403 when user has no role at all', async () => {
    const req = buildReq({ role: null });
    const err = await runMiddleware(requirePermission('VIEW_PROFILE'), req);
    expect(err.statusCode).toBe(403);
  });

  test('N — accepts string-form permissions (already-populated role)', async () => {
    const req = buildReq({ role: { name: 'ADMIN', permissions: ['VIEW_STAFF', 'VIEW_PROFILE'] } });
    const err = await runMiddleware(requirePermission('VIEW_PROFILE'), req);
    expect(err).toBeUndefined();
  });

  test('B — requiring multiple permissions requires ALL of them', async () => {
    const req = buildReq({ role: { name: 'STAFF', permissions: [{ name: 'VIEW_STAFF' }] } });
    const err = await runMiddleware(requirePermission('VIEW_STAFF', 'UPDATE_STAFF'), req);
    expect(err.statusCode).toBe(403);
    expect(err.message).toMatch(/UPDATE_STAFF/);
  });
});
