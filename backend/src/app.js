'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const env = require('./config/env');
const logger = require('./utils/logger');

const authRouter = require('./modules/auth/auth.router');
const staffRouter = require('./modules/staff/staff.router');
const roleRouter = require('./modules/role/role.router');
const permissionRouter = require('./modules/permission/permission.router');
const profileRouter = require('./modules/profile/profile.router');

const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.isProduction ? 'combined' : 'dev', { stream: { write: (m) => logger.info(m.trim()) } }));

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', uptime: process.uptime() } });
});

app.use('/api/auth', authRouter);
app.use('/api/staff', staffRouter);
app.use('/api/roles', roleRouter);
app.use('/api/permissions', permissionRouter);
app.use('/api/profile', profileRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
