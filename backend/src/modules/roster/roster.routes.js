const express = require('express');
const multer = require('multer');
const staffAuth = require('../../middleware/staffAuth');
const controller = require('./roster.controller');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = express.Router();

router.use(staffAuth);
router.post('/upload', upload.single('file'), controller.upload);
router.get('/rounds', controller.rounds);
router.get('/:round', controller.listByRound);

module.exports = router;
