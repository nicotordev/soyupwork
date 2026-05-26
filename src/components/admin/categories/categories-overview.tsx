import { CategoriesEmptyState } from "@/components/admin/categories/categories-empty-state";
import { CategoriesPageHeader } from "@/components/admin/categories/categories-page-header";
import { CategoriesPagination } from "@/components/admin/categories/categories-pagination";
import { CategoriesStatsGrid } from "@/components/admin/categories/categories-stats-grid";
import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { CategoriesToolbar } from "@/components/admin/categories/categories-toolbar";
import type { AdminCategoriesPageData } from "@/types/admin-category.types";

type CategoriesOverviewProps = {
  data: AdminCategoriesPageData;
};

export function CategoriesOverview({ data }: CategoriesOverviewProps) {
  const hasActiveFilters = data.filters.q.length > 0;

  return (
    <div className="space-y-0">
      <CategoriesPageHeader />
      <CategoriesStatsGrid stats={data.stats} />
      <CategoriesToolbar filters={data.filters} pagination={data.pagination} />
      {data.pagination.totalCount === 0 ? (
        <CategoriesEmptyState hasFilters={hasActiveFilters} />
      ) : (
        <>
          <CategoriesTable categories={data.categories} />
          <CategoriesPagination pagination={data.pagination} />
        </>
      )}
    </div>
  );
}
