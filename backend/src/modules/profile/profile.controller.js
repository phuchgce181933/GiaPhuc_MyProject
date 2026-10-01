'use strict';

const service = require('./profile.service');

const controller = {
  async me(req, res, next) {
    try {
      res.json({ success: true, data: await service.getOwnProfile(req.user) });
    } catch (err) {
      next(err);
    }
  },
  async byId(req, res, next) {
    try {
      res.json({ success: true, data: await service.getById(req.params.id) });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = controller;
