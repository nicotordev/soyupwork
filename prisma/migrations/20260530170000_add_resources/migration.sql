-- CreateEnum
CREATE TYPE "ResourceKind" AS ENUM ('GUIDE', 'TEMPLATE');

-- CreateEnum
CREATE TYPE "ResourceAvailability" AS ENUM ('AVAILABLE', 'COMING_SOON', 'COURSE');

-- CreateEnum
CREATE TYPE "ResourceStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "ResourceCategory" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "kind" "ResourceKind" NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ResourceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceTag" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ResourceTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceTagJoin" (
    "resourceId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "ResourceTagJoin_pkey" PRIMARY KEY ("resourceId","tagId")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "excerpt" TEXT NOT NULL,
    "kind" "ResourceKind" NOT NULL,
    "availability" "ResourceAvailability" NOT NULL DEFAULT 'AVAILABLE',
    "status" "ResourceStatus" NOT NULL DEFAULT 'DRAFT',
    "readingTimeMinutes" INTEGER,
    "fileLabel" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "relatedHref" TEXT,
    "relatedLabel" TEXT,
    "publishedAt" TIMESTAMP(6),
    "content" TEXT,
    "contentFormat" "BlogContentFormat" NOT NULL DEFAULT 'MARKDOWN',
    "templateSections" JSONB,
    "templateIncludes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "categoryId" UUID,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResourceCategory_kind_slug_key" ON "ResourceCategory"("kind", "slug");

-- CreateIndex
CREATE INDEX "ResourceCategory_kind_position_idx" ON "ResourceCategory"("kind", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceTag_slug_key" ON "ResourceTag"("slug");

-- CreateIndex
CREATE INDEX "ResourceTagJoin_tagId_idx" ON "ResourceTagJoin"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_slug_key" ON "Resource"("slug");

-- CreateIndex
CREATE INDEX "Resource_kind_status_publishedAt_idx" ON "Resource"("kind", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "Resource_kind_availability_idx" ON "Resource"("kind", "availability");

-- CreateIndex
CREATE INDEX "Resource_status_idx" ON "Resource"("status");

-- CreateIndex
CREATE INDEX "Resource_categoryId_idx" ON "Resource"("categoryId");

-- CreateIndex
CREATE INDEX "Resource_featured_idx" ON "Resource"("featured");

-- AddForeignKey
ALTER TABLE "ResourceTagJoin" ADD CONSTRAINT "ResourceTagJoin_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceTagJoin" ADD CONSTRAINT "ResourceTagJoin_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "ResourceTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ResourceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
