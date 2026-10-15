const prisma = require('../../config/prismaClient');
const ApiError = require('../../utils/ApiError');

// verify.service의 검사를 서버에서 다시 수행한다(클라이언트가 verify 이후
// 다른 값으로 조작해 제출하는 것을 막기 위한 재검증).
//
// "수령 완료"의 기준은 담당자 확인(confirmedAt)이다. 서명만 하고 확인 전에
// 화면이 닫힌 기록(confirmedAt이 NULL)은 수령으로 보지 않고, 재서명하면
// 그 기록을 지우고 새로 만든다(새 id가 발급되므로 이전 화면의 확인 버튼은 무효).
// 동시 제출 경쟁 상태는 (round, respondentId) 유니크 제약(P2002)으로 방어하고,
// 한 번 재시도한다.
async function createReceipt({ round, respondentId, name, signatureImage }) {
  const rosterMatch = await prisma.roster.findFirst({ where: { round, respondentId, name } });
  if (!rosterMatch) {
    return { status: 'not_found', respondentId, name };
  }

  const key = { round_respondentId: { round, respondentId } };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const existing = await prisma.giftReceipt.findUnique({ where: key });
    if (existing?.confirmedAt) {
      return { status: 'already_received', respondentId, name, signedAt: existing.signedAt };
    }

    try {
      if (existing) {
        // confirmedAt IS NULL 조건: 그 사이 담당자 확인이 눌렸다면 지우지 않는다.
        const { count } = await prisma.giftReceipt.deleteMany({
          where: { id: existing.id, confirmedAt: null },
        });
        if (count === 0) continue;
      }
      const receipt = await prisma.giftReceipt.create({
        data: { round, respondentId, name, signatureImage },
      });
      return { status: 'created', receipt };
    } catch (err) {
      if (err.code !== 'P2002') throw err;
    }
  }

  const latest = await prisma.giftReceipt.findUnique({ where: key });
  if (latest?.confirmedAt) {
    return { status: 'already_received', respondentId, name, signedAt: latest.signedAt };
  }
  throw new ApiError(409, '처리 중 충돌이 발생했습니다. 잠시 후 다시 시도해 주세요');
}

async function confirmReceipt(id) {
  const receipt = await prisma.giftReceipt.findUnique({ where: { id } });
  if (!receipt) throw new ApiError(404, '수령 기록을 찾을 수 없습니다');
  if (receipt.confirmedAt) return receipt; // 이미 확인된 건은 재호출해도 그대로 반환(멱등)
  return prisma.giftReceipt.update({ where: { id }, data: { confirmedAt: new Date() } });
}

module.exports = { createReceipt, confirmReceipt };
