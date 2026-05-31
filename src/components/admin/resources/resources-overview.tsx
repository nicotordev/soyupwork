"use client";

import { ResourcesEmptyState } from "@/components/admin/resources/resources-empty-state";
import { ResourcesPageHeader } from "@/components/admin/resources/resources-page-header";
import { ResourcesPaginationBar } from "@/components/admin/resources/resources-pagination";
import { ResourcesStatsGrid } from "@/components/admin/resources/resources-stats-grid";
import { ResourcesTable } from "@/components/admin/resources/resources-table";
import { ResourcesToolbar } from "@/components/admin/resources/resources-toolbar";
import { ADMIN_RESOURCES_FILTER_ALL } from "@/constants/resources-admin.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import type { AdminResourcesPageData } from "@/types/resources-admin.types";

type ResourcesOverviewProps = {
  data: AdminResourcesPageData;
};

export function ResourcesOverview({ data }: ResourcesOverviewProps) {
  const { clearParams } = useAdminListingParams();

  const hasFilters =
    data.filters.q.length > 0 ||
    data.filters.status !== ADMIN_RESOURCES_FILTER_ALL ||
    data.filters.categorySlug !== ADMIN_RESOURCES_FILTER_ALL;

  return (
    <div className="space-y-0">
      <ResourcesPageHeader kind={data.filters.kind} />
      <ResourcesStatsGrid stats={data.stats} />
      <ResourcesToolbar
        filters={data.filters}
        pagination={data.pagination}
        categories={data.categories}
      />
      {data.pagination.totalCount === 0 ? (
        <ResourcesEmptyState
          kind={data.filters.kind}
          hasFilters={hasFilters}
          onClearFilters={
            hasFilters
              ? () => clearParams(["q", "status", "categoria", "page"])
              : undefined
          }
        />
      ) : (
        <>
          <ResourcesTable resources={data.resources} />
          <div className="px-4 sm:px-6">
            <ResourcesPaginationBar pagination={data.pagination} />
          </div>
        </>
      )}
    </div>
  );
}
