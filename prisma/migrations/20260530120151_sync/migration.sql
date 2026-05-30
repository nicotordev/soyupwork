-- AlterTable
ALTER TABLE "QuizAttempt" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WaitlistEntry" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WaitlistVerification" ALTER COLUMN "updatedAt" DROP DEFAULT;
