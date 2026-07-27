const asyncHandler = require('../../middleware/asyncHandler');
const receiptService = require('./receipt.service');

const create = asyncHandler(async (req, res) => {
  const result = await receiptService.createReceipt(req.body);
  res.json(result);
});

// 로그인 불필요 — 응답자 본인 화면에 뜬 "담당자 확인" 버튼을 담당자가
// 직접 눌러 호출하는 순수 UI 동작(물리적 감독 전제, 계획서 확정 사항).
const confirm = asyncHandler(async (req, res) => {
  const receipt = await receiptService.confirmReceipt(req.params.id);
  res.json({ receipt });
});

module.exports = { create, confirm };
