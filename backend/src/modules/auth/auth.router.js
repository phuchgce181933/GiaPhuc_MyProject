'use strict';

const express = require('express');
const controller = require('./auth.controller');
const validate = require('../../middlewares/validate.middleware');
const { loginSchema } = require('./auth.validator');

const router = express.Router();

router.post('/login', validate(loginSchema), controller.login);
router.post('/refresh', controller.refresh);

module.exports = router;
