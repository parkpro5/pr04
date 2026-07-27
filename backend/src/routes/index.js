const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const rosterRoutes = require('../modules/roster/roster.routes');
const verifyRoutes = require('../modules/verify/verify.routes');
const receiptRoutes = require('../modules/receipt/receipt.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/roster', rosterRoutes);
router.use('/verify', verifyRoutes);
router.use('/receipt', receiptRoutes);

module.exports = router;
