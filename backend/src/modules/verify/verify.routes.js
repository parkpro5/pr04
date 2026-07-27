const express = require('express');
const validate = require('../../middleware/validate');
const { verifySchema } = require('./verify.schemas');
const controller = require('./verify.controller');

const router = express.Router();

router.post('/', validate(verifySchema), controller.verify);

module.exports = router;
