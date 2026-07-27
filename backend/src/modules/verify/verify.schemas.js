const { z } = require('zod');

const verifySchema = z.object({
  round: z.string().trim().min(1, '회차 정보가 없습니다'),
  respondentId: z.string().trim().min(1, '학번/사번을 입력해 주세요'),
  name: z.string().trim().min(1, '성명을 입력해 주세요'),
});

module.exports = { verifySchema };
