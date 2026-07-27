const express = require('express');
const validate = require('../../middleware/validate');
const { createReceiptSchema } = require('./receipt.schemas');
const controller = require('./receipt.controller');

const router = express.Router();

router.post('/', validate(createReceiptSchema), controller.create);
router.post('/:id/confirm', controller.confirm);

module.exports = router;
