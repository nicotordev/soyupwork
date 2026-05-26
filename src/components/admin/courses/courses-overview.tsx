import { CoursesEmptyState } from "@/components/admin/courses/courses-empty-state";
import { CoursesPageHeader } from "@/components/admin/courses/courses-page-header";
import { CoursesStatsGrid } from "@/components/admin/courses/courses-stats-grid";
import { CoursesTable } from "@/components/admin/courses/courses-table";
import { CoursesToolbar } from "@/components/admin/courses/courses-toolbar";
import { ADMIN_COURSES_FILTER_ALL } from "@/constants/courses.constants";
import type { AdminCoursesPageData } from "@/types/admin-course.types";

type CoursesOverviewProps = {
  data: AdminCoursesPageData;
};

export function CoursesOverview({ data }: CoursesOverviewProps) {
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
        resultCount={data.courses.length}
      />
      {data.courses.length === 0 ? (
        <CoursesEmptyState hasFilters={hasActiveFilters} />
      ) : (
        <CoursesTable courses={data.courses} />
      )}
    </div>
  );
}
