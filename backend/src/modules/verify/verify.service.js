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

  if (existingReceipt) {
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
