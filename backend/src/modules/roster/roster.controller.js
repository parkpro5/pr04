const asyncHandler = require('../../middleware/asyncHandler');
const ApiError = require('../../utils/ApiError');
const rosterService = require('./roster.service');

const upload = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, '엑셀 파일을 첨부해 주세요');
  const rows = await rosterService.parseExcelBuffer(req.file.buffer);
  const result = await rosterService.replaceRoster(rows);
  res.json(result);
});

const rounds = asyncHandler(async (req, res) => {
  res.json({ rounds: await rosterService.listRounds() });
});

const listByRound = asyncHandler(async (req, res) => {
  const rows = await rosterService.getRosterWithReceipts(req.params.round);
  res.json({ rows });
});

module.exports = { upload, rounds, listByRound };
