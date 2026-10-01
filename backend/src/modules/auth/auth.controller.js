'use strict';

const service = require('./auth.service');
const { z } = require('zod');

const refreshSchema = z.object({ refreshToken: z.string().min(10) });

module.exports = {
  async login(req, res, next) {
    try {
      const data = await service.login(req.body);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
  async refresh(req, res, next) {
    try {
      const parsed = refreshSchema.parse(req.body || {});
      const data = await service.refresh(parsed.refreshToken);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};
