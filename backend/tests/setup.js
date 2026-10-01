'use strict';

// Jest global setup — load test env BEFORE anything that imports config/env.
// We allow required envs to be missing during unit tests because the modules
// that consume them are mocked.  We provide harmless placeholders here.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-access-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
process.env.MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:0/test-placeholder';
// Tests MUST use a dedicated database name so they never touch the
// production `giaphuc` database — even when an integration test eventually
// opens a real MongoDB connection.
process.env.MONGODB_DB = process.env.MONGODB_DB || 'test_giaPhuc';
process.env.MAIL_USER = process.env.MAIL_USER || 'tester@example.com';
process.env.MAIL_PASS = process.env.MAIL_PASS || 'test-pass';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://example.test';
process.env.BACKEND_URL = process.env.BACKEND_URL || 'http://example.test';
