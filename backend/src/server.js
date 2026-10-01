'use strict';

// Load .env BEFORE any module that reads process.env at module-eval time.
require('dotenv').config();

const app = require('./app');
const env = require('./config/env');
const { connectDb } = require('./config/db');
const { verifyMailConfig } = require('./config/mail');
const logger = require('./utils/logger');

async function bootstrap() {
  await connectDb();
  await verifyMailConfig();

  app.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port} (${env.nodeEnv})`);
  });
}

bootstrap().catch((err) => {
  logger.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled rejection: ${reason && reason.message ? reason.message : reason}`);
});
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err.message}`);
  process.exit(1);
});
