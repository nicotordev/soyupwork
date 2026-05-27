"use client";

import { useEffect, useState } from "react";
import { CoursesEmptyState } from "@/components/admin/courses/courses-empty-state";
import { CoursesPageHeader } from "@/components/admin/courses/courses-page-header";
import { CoursesPagination } from "@/components/admin/courses/courses-pagination";
import { CoursesStatsGrid } from "@/components/admin/courses/courses-stats-grid";
import { CoursesTable } from "@/components/admin/courses/courses-table";
import { CoursesCards } from "@/components/admin/courses/courses-cards";
import { CoursesToolbar } from "@/components/admin/courses/courses-toolbar";
import { ADMIN_COURSES_FILTER_ALL } from "@/constants/courses.constants";
import type { AdminCoursesPageData } from "@/types/admin-course.types";

type CoursesOverviewProps = {
  data: AdminCoursesPageData;
};

const VIEW_PREFERENCE_KEY = "soyupwork:admin:courses-view";

export function CoursesOverview({ data }: CoursesOverviewProps) {
  const [view, setView] = useState<"table" | "cards">("table");

  // Load view preference on client-side to prevent SSR mismatch
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_PREFERENCE_KEY);
    if (saved === "table" || saved === "cards") {
      setView(saved);
    }
  }, []);

  const handleViewChange = (nextView: "table" | "cards") => {
    setView(nextView);
    localStorage.setItem(VIEW_PREFERENCE_KEY, nextView);
  };

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
        view={view}
        onViewChange={handleViewChange}
      />
      {data.pagination.totalCount === 0 ? (
        <CoursesEmptyState hasFilters={hasActiveFilters} />
      ) : (
        <>
          {view === "table" ? (
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
