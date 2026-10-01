'use strict';

/**
 * Standardised API error class.
 * Throwing one of these in the service layer guarantees the global error
 * middleware produces a uniform response payload:
 *   { success: false, message, code, details? }
 */

class ApiError extends Error {
  constructor(statusCode, message, code = 'ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message, 'FORBIDDEN');
  }
  static notFound(message = 'Not Found') {
    return new ApiError(404, message, 'NOT_FOUND');
  }
  static badRequest(message = 'Bad Request', details = null) {
    return new ApiError(400, message, 'BAD_REQUEST', details);
  }
  static conflict(message = 'Conflict') {
    return new ApiError(409, message, 'CONFLICT');
  }
  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message, 'INTERNAL_ERROR');
  }
}

module.exports = ApiError;
