const { readSheet } = require('read-excel-file/node');
const prisma = require('../../config/prismaClient');
const ApiError = require('../../utils/ApiError');

const COLUMNS = { round: '회차', respondentId: '학번/사번', name: '성명' };

function cellText(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

async function parseExcelBuffer(buffer) {
  const sheetRows = await readSheet(buffer);
  if (!sheetRows || sheetRows.length === 0) {
    throw new ApiError(400, '엑셀 파일에서 데이터를 찾을 수 없습니다');
  }

  const header = sheetRows[0].map(cellText);
  const colIndex = {
    round: header.indexOf(COLUMNS.round),
    respondentId: header.indexOf(COLUMNS.respondentId),
    name: header.indexOf(COLUMNS.name),
  };

  if (colIndex.round === -1 || colIndex.respondentId === -1 || colIndex.name === -1) {
    throw new ApiError(
      400,
      `열 제목이 "${COLUMNS.round}", "${COLUMNS.respondentId}", "${COLUMNS.name}"인지 확인해 주세요`
    );
  }

  const rows = [];
  for (let i = 1; i < sheetRows.length; i += 1) {
    const raw = sheetRows[i];
    const round = cellText(raw[colIndex.round]);
    const respondentId = cellText(raw[colIndex.respondentId]);
    const name = cellText(raw[colIndex.name]);
    if (!round || !respondentId || !name) continue;
    rows.push({ round, respondentId, name });
  }

  if (rows.length === 0) {
    throw new ApiError(400, '유효한 행이 없습니다. 헤더 아래에 데이터가 있는지 확인해 주세요');
  }
  return rows;
}

function dedupeRows(rows) {
  const map = new Map();
  for (const row of rows) {
    map.set(`${row.round}::${row.respondentId}`, row);
  }
  return [...map.values()];
}

// 같은 회차를 재업로드하면 기존 명단 전체를 새 내용으로 교체한다(확정 사항).
// GiftReceipt는 별도 테이블이라 이 트랜잭션의 영향을 받지 않는다.
async function replaceRoster(rawRows) {
  const rows = dedupeRows(rawRows);
  const rounds = [...new Set(rows.map((r) => r.round))];

  await prisma.$transaction(async (tx) => {
    for (const round of rounds) {
      await tx.roster.deleteMany({ where: { round } });
      await tx.roster.createMany({
        data: rows.filter((r) => r.round === round),
      });
    }
  });

  return { rounds, count: rows.length };
}

async function listRounds() {
  const rows = await prisma.roster.findMany({
    distinct: ['round'],
    select: { round: true },
    orderBy: { round: 'desc' },
  });
  return rows.map((r) => r.round);
}

async function getRosterWithReceipts(round) {
  const rosterRows = await prisma.roster.findMany({
    where: { round },
    orderBy: { createdAt: 'asc' },
  });
  if (rosterRows.length === 0) return [];

  const receipts = await prisma.giftReceipt.findMany({ where: { round } });
  const receiptMap = new Map(receipts.map((r) => [r.respondentId, r]));

  return rosterRows.map((row, idx) => {
    const receipt = receiptMap.get(row.respondentId);
    return {
      no: idx + 1,
      respondentId: row.respondentId,
      name: row.name,
      signedAt: receipt?.signedAt ?? null,
      confirmedAt: receipt?.confirmedAt ?? null,
      signatureImage: receipt?.signatureImage ?? null,
    };
  });
}

module.exports = { parseExcelBuffer, replaceRoster, listRounds, getRosterWithReceipts };
