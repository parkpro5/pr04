-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roster" (
    "id" TEXT NOT NULL,
    "round" TEXT NOT NULL,
    "respondentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Roster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftReceipt" (
    "id" TEXT NOT NULL,
    "round" TEXT NOT NULL,
    "respondentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "signatureImage" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "GiftReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_employeeId_key" ON "Staff"("employeeId");

-- CreateIndex
CREATE INDEX "Roster_round_idx" ON "Roster"("round");

-- CreateIndex
CREATE UNIQUE INDEX "Roster_round_respondentId_key" ON "Roster"("round", "respondentId");

-- CreateIndex
CREATE INDEX "GiftReceipt_round_idx" ON "GiftReceipt"("round");

-- CreateIndex
CREATE UNIQUE INDEX "GiftReceipt_round_respondentId_key" ON "GiftReceipt"("round", "respondentId");
