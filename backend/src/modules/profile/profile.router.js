'use strict';

const express = require('express');
const controller = require('./profile.controller');
const authenticate = require('../../middlewares/auth.middleware');
const requirePermission = require('../../middlewares/permission.middleware');
const validate = require('../../middlewares/validate.middleware');
const { staffIdParamSchema } = require('../staff/staff.validator');

const router = express.Router();

router.use(authenticate);

// Any authenticated user can read their own profile
router.get('/me', controller.me);

// Viewing *another* user's profile requires VIEW_PROFILE permission
router.get(
  '/:id',
  requirePermission('VIEW_PROFILE'),
  validate(staffIdParamSchema, 'params'),
  controller.byId
);

module.exports = router;
