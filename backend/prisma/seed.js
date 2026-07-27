const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const STAFF = [
  { employeeId: '06499', name: '박경진' },
  { employeeId: '07279', name: '김봉재' },
  { employeeId: '07367', name: '최은영' },
];

async function main() {
  for (const staff of STAFF) {
    await prisma.staff.upsert({
      where: { employeeId: staff.employeeId },
      update: { name: staff.name },
      create: staff,
    });
  }
  console.log(`Seeded ${STAFF.length} staff members.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
