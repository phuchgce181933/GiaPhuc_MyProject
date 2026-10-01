'use strict';

const nodemailer = require('nodemailer');
const env = require('./env');
const logger = require('../utils/logger');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.mail.user,
      pass: env.mail.pass,
    },
  });
  return transporter;
}

async function verifyMailConfig() {
  try {
    await getTransporter().verify();
    logger.info('Mail server is ready');
    return true;
  } catch (err) {
    logger.error(`Mail server verification failed: ${err.message}`);
    return false;
  }
}

module.exports = { getTransporter, verifyMailConfig };
