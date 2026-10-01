'use strict';

const express = require('express');
const service = require('./permission.service');
const authenticate = require('../../middlewares/auth.middleware');
const requirePermission = require('../../middlewares/permission.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  requirePermission('VIEW_STAFF'),
  async (_req, res, next) => {
    try {
      const items = await service.list();
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
