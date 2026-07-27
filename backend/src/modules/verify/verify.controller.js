const asyncHandler = require('../../middleware/asyncHandler');
const verifyService = require('./verify.service');

const verify = asyncHandler(async (req, res) => {
  const result = await verifyService.checkEligibility(req.body);
  res.json(result);
});

module.exports = { verify };
