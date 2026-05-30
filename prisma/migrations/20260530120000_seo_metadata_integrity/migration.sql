-- Backfill createdAt for rows imported before createdAt was copied from parents
UPDATE "SeoMetadata" sm
SET "createdAt" = c."createdAt"
FROM "Course" c
WHERE sm."courseId" = c."id"
  AND sm."createdAt" IS DISTINCT FROM c."createdAt";

UPDATE "SeoMetadata" sm
SET "createdAt" = bp."createdAt"
FROM "BlogPost" bp
WHERE sm."blogPostId" = bp."id"
  AND sm."createdAt" IS DISTINCT FROM bp."createdAt";

-- Remove invalid rows before adding CHECK (exactly one parent required)
DELETE FROM "SeoMetadata"
WHERE ("courseId" IS NULL AND "blogPostId" IS NULL)
   OR ("courseId" IS NOT NULL AND "blogPostId" IS NOT NULL);

ALTER TABLE "SeoMetadata"
ADD CONSTRAINT "SeoMetadata_single_parent_check"
CHECK (
  ("courseId" IS NOT NULL AND "blogPostId" IS NULL)
  OR ("courseId" IS NULL AND "blogPostId" IS NOT NULL)
);
