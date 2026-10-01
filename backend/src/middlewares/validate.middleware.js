'use strict';

const { ZodError } = require('zod');
const ApiError = require('../utils/ApiError');

/**
 * Generic zod validator factory. Pass any zod schema; on failure the request
 * is rejected with HTTP 400 and a `details` array.
 */
function validate(schema, source = 'body') {
  return function (req, _res, next) {
    try {
      const data = req[source];
      const parsed = schema.parse(data);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        }));
        return next(ApiError.badRequest('Validation failed', details));
      }
      next(err);
    }
  };
}

module.exports = validate;
