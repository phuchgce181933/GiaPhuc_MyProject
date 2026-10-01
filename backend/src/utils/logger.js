'use strict';

/**
 * Very small structured logger.
 * We intentionally do NOT log sensitive data — callers are responsible for
 * redacting values (passwords, tokens, secrets, etc.).
 */

const levels = { info: 'INFO', warn: 'WARN', error: 'ERROR', debug: 'DEBUG' };

function format(level, msg, meta) {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level}] ${msg}`;
  if (meta && Object.keys(meta).length) {
    return `${base} ${JSON.stringify(meta)}`;
  }
  return base;
}

const logger = {
  info: (msg, meta) => console.log(format(levels.info, msg, meta)),
  warn: (msg, meta) => console.warn(format(levels.warn, msg, meta)),
  error: (msg, meta) => console.error(format(levels.error, msg, meta)),
  debug: (msg, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(format(levels.debug, msg, meta));
    }
  },
};

module.exports = logger;
