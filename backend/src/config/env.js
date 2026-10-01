'use strict';

/**
 * Centralised, validated access to environment variables.
 * Hard-fails at boot if a required variable is missing — prevents silent
 * runtime errors caused by missing configuration.
 */

const required = (name) => {
  const v = process.env[name];
  if (v === undefined || v === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
};

const optional = (name, fallback) => {
  const v = process.env[name];
  return v === undefined || v === '' ? fallback : v;
};

const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  port: parseInt(optional('PORT', '5000'), 10),
  isProduction: optional('NODE_ENV', 'development') === 'production',

  mongodbUri: required('MONGODB_URI'),
  // Database name is intentionally separate from the URI so the same
  // cluster/credentials can target `giaphuc` in production and
  // `test_giaPhuc` (or anything else) in tests.
  mongodbDb: optional('MONGODB_DB', 'giaphuc'),

  jwt: {
    secret: required('JWT_SECRET'),
    refreshSecret: required('JWT_REFRESH_SECRET'),
    expiresIn: optional('JWT_EXPIRES_IN', '1h'),
    refreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  mail: {
    user: required('MAIL_USER'),
    pass: required('MAIL_PASS'),
    fromName: optional('MAIL_FROM_NAME', 'Gia Phuc System'),
  },

  frontendUrl: required('FRONTEND_URL'),
  backendUrl: required('BACKEND_URL'),
};

module.exports = env;
