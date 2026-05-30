-- CreateTable
CREATE TABLE "LessonBookmark" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "lessonId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LessonBookmark_userId_idx" ON "LessonBookmark"("userId");

-- CreateIndex
CREATE INDEX "LessonBookmark_lessonId_idx" ON "LessonBookmark"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonBookmark_userId_lessonId_key" ON "LessonBookmark"("userId", "lessonId");

-- AddForeignKey
ALTER TABLE "LessonBookmark" ADD CONSTRAINT "LessonBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonBookmark" ADD CONSTRAINT "LessonBookmark_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
