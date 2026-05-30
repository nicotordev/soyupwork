-- CreateTable
CREATE TABLE "SeoMetadata" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "courseId" UUID,
    "blogPostId" UUID,
    "title" TEXT,
    "titleTemplate" TEXT,
    "titleAbsolute" TEXT,
    "description" TEXT,
    "applicationName" TEXT,
    "generator" TEXT,
    "creator" TEXT,
    "publisher" TEXT,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "referrer" TEXT,
    "abstract" TEXT,
    "category" TEXT,
    "classification" TEXT,
    "manifest" TEXT,
    "robots" JSONB,
    "alternates" JSONB,
    "icons" JSONB,
    "openGraph" JSONB,
    "twitter" JSONB,
    "facebook" JSONB,
    "pinterest" JSONB,
    "verification" JSONB,
    "authors" JSONB,
    "appleWebApp" JSONB,
    "formatDetection" JSONB,
    "itunes" JSONB,
    "appLinks" JSONB,
    "pagination" JSONB,
    "other" JSONB,
    "archives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "assets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bookmarks" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "SeoMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeoMetadata_courseId_key" ON "SeoMetadata"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "SeoMetadata_blogPostId_key" ON "SeoMetadata"("blogPostId");

-- CreateIndex
CREATE INDEX "SeoMetadata_courseId_idx" ON "SeoMetadata"("courseId");

-- CreateIndex
CREATE INDEX "SeoMetadata_blogPostId_idx" ON "SeoMetadata"("blogPostId");

-- AddForeignKey
ALTER TABLE "SeoMetadata" ADD CONSTRAINT "SeoMetadata_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoMetadata" ADD CONSTRAINT "SeoMetadata_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate legacy seoTitle / seoDescription (preserve parent createdAt)
INSERT INTO "SeoMetadata" ("id", "createdAt", "updatedAt", "courseId", "title", "description")
SELECT gen_random_uuid(), "createdAt", "updatedAt", "id", "seoTitle", "seoDescription"
FROM "Course"
WHERE "seoTitle" IS NOT NULL OR "seoDescription" IS NOT NULL;

INSERT INTO "SeoMetadata" ("id", "createdAt", "updatedAt", "blogPostId", "title", "description")
SELECT gen_random_uuid(), "createdAt", "updatedAt", "id", "seoTitle", "seoDescription"
FROM "BlogPost"
WHERE "seoTitle" IS NOT NULL OR "seoDescription" IS NOT NULL;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "seoDescription",
DROP COLUMN "seoTitle";

-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "seoDescription",
DROP COLUMN "seoTitle";
