"use client";

import { CoursesCards } from "@/components/admin/courses/courses-cards";
import { CoursesEmptyState } from "@/components/admin/courses/courses-empty-state";
import { CoursesPageHeader } from "@/components/admin/courses/courses-page-header";
import { CoursesPagination } from "@/components/admin/courses/courses-pagination";
import { CoursesStatsGrid } from "@/components/admin/courses/courses-stats-grid";
import { CoursesTable } from "@/components/admin/courses/courses-table";
import { CoursesToolbar } from "@/components/admin/courses/courses-toolbar";
import { ADMIN_LISTING_VIEW } from "@/constants/admin-listing.constants";
import { ADMIN_COURSES_FILTER_ALL } from "@/constants/courses.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import type { AdminCoursesPageData } from "@/types/admin-course.types";

type CoursesOverviewProps = {
  data: AdminCoursesPageData;
};

export function CoursesOverview({ data }: CoursesOverviewProps) {
  const { viewMode, clearParams } = useAdminListingParams();

  const hasActiveFilters =
    data.filters.q.length > 0 ||
    data.filters.status !== ADMIN_COURSES_FILTER_ALL ||
    data.filters.level !== ADMIN_COURSES_FILTER_ALL ||
    data.filters.categorySlug !== ADMIN_COURSES_FILTER_ALL;

  return (
    <div className="space-y-0">
      <CoursesPageHeader />
      <CoursesStatsGrid stats={data.stats} />
      <CoursesToolbar
        filters={data.filters}
        categories={data.categories}
        pagination={data.pagination}
      />
      {data.pagination.totalCount === 0 ? (
        <CoursesEmptyState
          hasFilters={hasActiveFilters}
          onClearFilters={
            hasActiveFilters
              ? () => clearParams(["status", "level", "category", "q"])
              : undefined
          }
        />
      ) : (
        <>
          {viewMode === ADMIN_LISTING_VIEW.TABLE ? (
            <CoursesTable
              courses={data.courses}
              storageConfigured={data.storageConfigured}
              maxThumbnailSizeMb={data.maxThumbnailSizeMb}
            />
          ) : (
            <CoursesCards
              courses={data.courses}
              storageConfigured={data.storageConfigured}
              maxThumbnailSizeMb={data.maxThumbnailSizeMb}
            />
          )}
          <CoursesPagination pagination={data.pagination} />
        </>
      )}
    </div>
  );
}
