const ApiError = require('../utils/ApiError');
const { verifyStaffToken } = require('../utils/jwt');

function extractToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme === 'Bearer' && token) return token;
  return null;
}

function staffAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return next(new ApiError(401, 'Staff authentication required'));
  }
  try {
    const payload = verifyStaffToken(token);
    req.staff = { id: payload.sub, employeeId: payload.employeeId, name: payload.name };
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

module.exports = staffAuth;
