-- AlterTable
ALTER TABLE "CourseDiscussion" ADD COLUMN     "parentId" UUID;

-- CreateIndex
CREATE INDEX "CourseDiscussion_parentId_idx" ON "CourseDiscussion"("parentId");

-- AddForeignKey
ALTER TABLE "CourseDiscussion" ADD CONSTRAINT "CourseDiscussion_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CourseDiscussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
