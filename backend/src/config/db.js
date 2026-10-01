'use strict';

const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

async function connectDb() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongodbUri, {
      // Drive the database name from env (default: `giaphuc`); tests set
      // `MONGODB_DB=test_giaPhuc` via tests/setup.js.
      dbName: env.mongodbDb,
      autoIndex: env.nodeEnv !== 'production',
    });
    logger.info(`MongoDB connected (db=${env.mongodbDb})`);
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    throw err;
  }
}

async function disconnectDb() {
  await mongoose.disconnect();
}

module.exports = { connectDb, disconnectDb };
