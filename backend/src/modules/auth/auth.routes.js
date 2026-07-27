const express = require('express');
const validate = require('../../middleware/validate');
const staffAuth = require('../../middleware/staffAuth');
const { staffLoginSchema } = require('./auth.schemas');
const controller = require('./auth.controller');

const router = express.Router();

router.post('/staff-login', validate(staffLoginSchema), controller.staffLogin);
router.get('/me', staffAuth, controller.me);

module.exports = router;
