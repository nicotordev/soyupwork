-- CreateTable
CREATE TABLE "WaitlistVerification" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitlistVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistVerification_email_key" ON "WaitlistVerification"("email");

-- CreateIndex
CREATE INDEX "WaitlistVerification_expiresAt_idx" ON "WaitlistVerification"("expiresAt");
