const prisma = require('../../config/prismaClient');
const ApiError = require('../../utils/ApiError');

// verify.service의 검사를 서버에서 다시 수행한다(클라이언트가 verify 이후
// 다른 값으로 조작해 제출하는 것을 막기 위한 재검증). 동시 제출 경쟁 상태는
// GiftReceipt의 (round, respondentId) 유니크 제약(P2002)으로 최종 방어한다.
async function createReceipt({ round, respondentId, name, signatureImage }) {
  const rosterMatch = await prisma.roster.findFirst({ where: { round, respondentId, name } });
  if (!rosterMatch) {
    return { status: 'not_found', respondentId, name };
  }

  try {
    const receipt = await prisma.giftReceipt.create({
      data: { round, respondentId, name, signatureImage },
    });
    return { status: 'created', receipt };
  } catch (err) {
    if (err.code === 'P2002') {
      const existing = await prisma.giftReceipt.findUnique({
        where: { round_respondentId: { round, respondentId } },
      });
      return { status: 'already_received', respondentId, name, signedAt: existing?.signedAt };
    }
    throw err;
  }
}

async function confirmReceipt(id) {
  const receipt = await prisma.giftReceipt.findUnique({ where: { id } });
  if (!receipt) throw new ApiError(404, '수령 기록을 찾을 수 없습니다');
  if (receipt.confirmedAt) return receipt; // 이미 확인된 건은 재호출해도 그대로 반환(멱등)
  return prisma.giftReceipt.update({ where: { id }, data: { confirmedAt: new Date() } });
}

module.exports = { createReceipt, confirmReceipt };
