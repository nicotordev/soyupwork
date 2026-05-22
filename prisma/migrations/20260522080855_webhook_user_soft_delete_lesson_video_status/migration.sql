-- CreateEnum
CREATE TYPE "LessonVideoStatus" AS ENUM ('PENDING', 'READY', 'ERRORED', 'DELETED');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "videoStatus" "LessonVideoStatus";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(6);

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
