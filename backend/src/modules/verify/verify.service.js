const prisma = require('../../config/prismaClient');

async function checkEligibility({ round, respondentId, name }) {
  const rosterMatch = await prisma.roster.findFirst({
    where: { round, respondentId, name },
  });

  if (!rosterMatch) {
    return { status: 'not_found', respondentId, name };
  }

  const existingReceipt = await prisma.giftReceipt.findUnique({
    where: { round_respondentId: { round, respondentId } },
  });

  // 담당자 확인까지 끝난 건만 "수령 완료"로 본다. 서명만 하고 확인 전에
  // 화면이 닫힌 건(confirmedAt NULL)은 다시 서명부터 진행하게 한다.
  if (existingReceipt?.confirmedAt) {
    return {
      status: 'already_received',
      respondentId,
      name,
      signedAt: existingReceipt.signedAt,
    };
  }

  return { status: 'eligible', respondentId, name };
}

module.exports = { checkEligibility };
