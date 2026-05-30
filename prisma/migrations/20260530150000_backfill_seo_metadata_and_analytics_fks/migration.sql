-- Bug 1 fix: parents migrated before all rows were seeded get an empty SeoMetadata row
INSERT INTO "SeoMetadata" ("id", "createdAt", "updatedAt", "courseId")
SELECT gen_random_uuid(), c."createdAt", c."updatedAt", c."id"
FROM "Course" c
WHERE NOT EXISTS (
  SELECT 1 FROM "SeoMetadata" sm WHERE sm."courseId" = c."id"
);

INSERT INTO "SeoMetadata" ("id", "createdAt", "updatedAt", "blogPostId")
SELECT gen_random_uuid(), bp."createdAt", bp."updatedAt", bp."id"
FROM "BlogPost" bp
WHERE NOT EXISTS (
  SELECT 1 FROM "SeoMetadata" sm WHERE sm."blogPostId" = bp."id"
);

-- Bug 3 fix: Prisma relations require DB foreign keys (columns existed without constraints)
ALTER TABLE "AnalyticsEvent"
ADD CONSTRAINT "AnalyticsEvent_courseId_fkey"
FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AnalyticsEvent"
ADD CONSTRAINT "AnalyticsEvent_lessonId_fkey"
FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "AnalyticsEvent_lessonId_createdAt_idx" ON "AnalyticsEvent"("lessonId", "createdAt");
