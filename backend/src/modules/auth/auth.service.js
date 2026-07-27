const prisma = require('../../config/prismaClient');
const { signStaffToken } = require('../../utils/jwt');

async function findMatchingStaff(employeeId, name) {
  return prisma.staff.findFirst({ where: { employeeId, name } });
}

function toPublicStaff(staff) {
  return { id: staff.id, employeeId: staff.employeeId, name: staff.name };
}

module.exports = { findMatchingStaff, toPublicStaff, signStaffToken };
