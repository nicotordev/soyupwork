-- Add configurable estimated program duration
ALTER TABLE "Course"
ADD COLUMN "estimatedDurationHours" INTEGER;

-- Extend course reviews for public social-proof rendering
ALTER TABLE "CourseReview"
ADD COLUMN "headline" TEXT,
ADD COLUMN "displayName" TEXT,
ADD COLUMN "niche" TEXT,
ADD COLUMN "countryCode" TEXT,
ADD COLUMN "metricBefore" TEXT,
ADD COLUMN "metricAfter" TEXT,
ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT false;
