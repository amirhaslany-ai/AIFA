-- CreateTable
CREATE TABLE "usage_events" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userMessageId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL,
    "completionTokens" INTEGER NOT NULL,
    "costMinorUnits" BIGINT NOT NULL,
    "priceMinorUnits" BIGINT NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usage_events_userMessageId_key" ON "usage_events"("userMessageId");

-- CreateIndex
CREATE INDEX "usage_events_accountId_createdAt_idx" ON "usage_events"("accountId", "createdAt");

