-- CreateEnum
CREATE TYPE "WaitlistInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateTable
CREATE TABLE "WaitlistInvite" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "WaitlistInviteStatus" NOT NULL DEFAULT 'PENDING',
    "waitlistEntryId" UUID,
    "invitedById" UUID NOT NULL,
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "acceptedAt" TIMESTAMP(6),
    "acceptedUserId" UUID,
    "revokedAt" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "WaitlistInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistInvite_tokenHash_key" ON "WaitlistInvite"("tokenHash");

-- CreateIndex
CREATE INDEX "WaitlistInvite_email_idx" ON "WaitlistInvite"("email");

-- CreateIndex
CREATE INDEX "WaitlistInvite_status_idx" ON "WaitlistInvite"("status");

-- CreateIndex
CREATE INDEX "WaitlistInvite_expiresAt_idx" ON "WaitlistInvite"("expiresAt");

-- AddForeignKey
ALTER TABLE "WaitlistInvite" ADD CONSTRAINT "WaitlistInvite_waitlistEntryId_fkey" FOREIGN KEY ("waitlistEntryId") REFERENCES "WaitlistEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistInvite" ADD CONSTRAINT "WaitlistInvite_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitlistInvite" ADD CONSTRAINT "WaitlistInvite_acceptedUserId_fkey" FOREIGN KEY ("acceptedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
