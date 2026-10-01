'use strict';

const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

function notFoundHandler(_req, _res, next) {
  next(ApiError.notFound('Resource not found'));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  // Mongoose duplicate key
  if (err && err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      code: 'DUPLICATE_KEY',
      message: `Duplicate value for ${field}`,
      details: { field, value: err.keyValue ? err.keyValue[field] : undefined },
    });
  }

  // Mongoose validation
  if (err && err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: err.message,
    });
  }

  const status = err.statusCode || 500;
  const payload = {
    success: false,
    code: err.code || 'INTERNAL_ERROR',
    message:
      status >= 500 && process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error',
  };
  if (err.details) payload.details = err.details;

  if (status >= 500) {
    logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  } else {
    logger.warn(`Request failed: ${payload.message} (${payload.code})`);
  }

  res.status(status).json(payload);
}

module.exports = { notFoundHandler, errorHandler };
