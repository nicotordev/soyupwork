-- AddForeignKey
ALTER TABLE "CourseDiscussion" ADD CONSTRAINT "CourseDiscussion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
