"use client";

import { CategoriesCards } from "@/components/admin/categories/categories-cards";
import { CategoriesPageHeader } from "@/components/admin/categories/categories-page-header";
import { CategoriesPagination } from "@/components/admin/categories/categories-pagination";
import { CategoriesStatsGrid } from "@/components/admin/categories/categories-stats-grid";
import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { CategoriesToolbar } from "@/components/admin/categories/categories-toolbar";
import { EmptyState } from "@/components/admin/listing/empty-state";
import { ADMIN_LISTING_VIEW } from "@/constants/admin-listing.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import type { AdminCategoriesPageData } from "@/types/admin-category.types";
import { FolderTree } from "lucide-react";

type CategoriesOverviewProps = {
  data: AdminCategoriesPageData;
};

export function CategoriesOverview({ data }: CategoriesOverviewProps) {
  const { viewMode, clearParams } = useAdminListingParams();

  const hasActiveFilters = data.filters.q.length > 0;

  return (
    <div className="space-y-0">
      <CategoriesPageHeader />
      <CategoriesStatsGrid stats={data.stats} />
      <CategoriesToolbar
        filters={data.filters}
        pagination={data.pagination}
      />
      {data.pagination.totalCount === 0 ? (
        <EmptyState
          icon={FolderTree}
          title="Aún no hay categorías"
          description="Creá tu primera categoría para organizar el catálogo de cursos."
          hasFilters={hasActiveFilters}
          onClearFilters={
            hasActiveFilters ? () => clearParams(["q"]) : undefined
          }
        />
      ) : (
        <>
          {viewMode === ADMIN_LISTING_VIEW.TABLE ? (
            <CategoriesTable categories={data.categories} />
          ) : (
            <CategoriesCards categories={data.categories} />
          )}
          <CategoriesPagination pagination={data.pagination} />
        </>
      )}
    </div>
  );
}
