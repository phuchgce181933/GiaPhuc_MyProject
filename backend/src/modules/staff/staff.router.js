'use strict';

const express = require('express');
const controller = require('./staff.controller');
const validate = require('../../middlewares/validate.middleware');
const authenticate = require('../../middlewares/auth.middleware');
const requirePermission = require('../../middlewares/permission.middleware');
const {
  createStaffSchema,
  updateStaffSchema,
  assignRoleSchema,
  updateStatusSchema,
  staffIdParamSchema,
} = require('./staff.validator');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  requirePermission('CREATE_STAFF'),
  validate(createStaffSchema),
  controller.create
);

router.get(
  '/',
  requirePermission('VIEW_STAFF'),
  controller.list
);

router.get(
  '/:id',
  requirePermission('VIEW_STAFF'),
  validate(staffIdParamSchema, 'params'),
  controller.getOne
);

router.put(
  '/:id',
  requirePermission('UPDATE_STAFF'),
  validate(staffIdParamSchema, 'params'),
  validate(updateStaffSchema),
  controller.update
);

router.patch(
  '/:id/role',
  requirePermission('ASSIGN_ROLE'),
  validate(staffIdParamSchema, 'params'),
  validate(assignRoleSchema),
  controller.assignRole
);

router.patch(
  '/:id/status',
  requirePermission('UPDATE_STAFF'),
  validate(staffIdParamSchema, 'params'),
  validate(updateStatusSchema),
  controller.updateStatus
);

module.exports = router;
