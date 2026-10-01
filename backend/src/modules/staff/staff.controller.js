'use strict';

const service = require('./staff.service');

class StaffController {
  async create(req, res, next) {
    try {
      const { user, emailNotificationSent, emailError } = await service.createStaff(
        req.body,
        req.user
      );
      const dto = user.toSafeJSON();
      res.status(201).json({
        success: true,
        message: emailNotificationSent
          ? 'Staff account created successfully'
          : 'Staff account created but email notification failed',
        data: {
          user: dto,
          userId: dto._id,
          emailNotificationSent,
          ...(emailNotificationSent ? {} : { emailError }),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
      const data = await service.listStaff({ page, limit });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req, res, next) {
    try {
      const data = await service.getStaff(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const data = await service.updateStaff(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async assignRole(req, res, next) {
    try {
      const data = await service.assignRole(req.params.id, req.body.roleId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const data = await service.setActive(req.params.id, req.body.isActive);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StaffController();
