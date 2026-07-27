const { z } = require('zod');

const createReceiptSchema = z.object({
  round: z.string().trim().min(1, '회차 정보가 없습니다'),
  respondentId: z.string().trim().min(1, '학번/사번을 입력해 주세요'),
  name: z.string().trim().min(1, '성명을 입력해 주세요'),
  signatureImage: z
    .string()
    .min(1, '서명이 필요합니다')
    .refine((v) => v.startsWith('data:image/'), '서명 이미지 형식이 올바르지 않습니다'),
});

module.exports = { createReceiptSchema };
