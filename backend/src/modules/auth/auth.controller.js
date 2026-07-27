const asyncHandler = require('../../middleware/asyncHandler');
const ApiError = require('../../utils/ApiError');
const authService = require('./auth.service');

const staffLogin = asyncHandler(async (req, res) => {
  const { employeeId, name } = req.body;
  const staff = await authService.findMatchingStaff(employeeId, name);
  if (!staff) {
    throw new ApiError(401, '사번과 성명이 일치하는 담당자를 찾을 수 없습니다');
  }
  const token = authService.signStaffToken(staff);
  res.json({ token, staff: authService.toPublicStaff(staff) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ staff: req.staff });
});

module.exports = { staffLogin, me };
