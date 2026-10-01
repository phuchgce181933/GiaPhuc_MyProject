'use strict';

const express = require('express');
const service = require('./role.service');
const authenticate = require('../../middlewares/auth.middleware');
const requirePermission = require('../../middlewares/permission.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  requirePermission('VIEW_STAFF'),
  async (_req, res, next) => {
    try {
      res.json({ success: true, data: await service.list() });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/:id',
  authenticate,
  requirePermission('VIEW_STAFF'),
  async (req, res, next) => {
    try {
      res.json({ success: true, data: await service.getById(req.params.id) });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
