const jwt = require('jsonwebtoken');
const env = require('../config/env');

const ALGORITHM = 'HS256';

function signStaffToken(staff) {
  return jwt.sign(
    { sub: staff.id, employeeId: staff.employeeId, name: staff.name },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN, algorithm: ALGORITHM }
  );
}

function verifyStaffToken(token) {
  // Pin the algorithm explicitly so a forged token can't switch algorithms
  // (e.g. "none") to bypass signature verification.
  return jwt.verify(token, env.JWT_SECRET, { algorithms: [ALGORITHM] });
}

module.exports = { signStaffToken, verifyStaffToken };
