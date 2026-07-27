const { z } = require('zod');

const staffLoginSchema = z.object({
  employeeId: z.string().trim().min(1, '사번을 입력해 주세요'),
  name: z.string().trim().min(1, '성명을 입력해 주세요'),
});

module.exports = { staffLoginSchema };
