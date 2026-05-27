"use client";

import { AdminToolbar } from "@/components/admin/listing/admin-toolbar";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import type {
  AdminCategoriesPagination,
  ParsedAdminCategoriesParams,
} from "@/types/admin-category.types";

type CategoriesToolbarProps = {
  filters: ParsedAdminCategoriesParams;
  pagination: AdminCategoriesPagination;
};

export function CategoriesToolbar({
  pagination,
}: CategoriesToolbarProps) {
  const {
    localQuery,
    setLocalQuery,
    viewMode,
    setViewMode,
    isPending,
  } = useAdminListingParams();

  const resultSummary =
    pagination.totalCount === 1
      ? "1 categoría encontrada"
      : `${pagination.totalCount} categorías encontradas` +
        (pagination.totalPages > 1
          ? ` · página ${pagination.page} de ${pagination.totalPages}`
          : "");

  return (
    <AdminToolbar
      isPending={isPending}
      search={{
        value: localQuery,
        onChange: setLocalQuery,
        placeholder: "Buscar por nombre o slug...",
        ariaLabel: "Buscar categorías",
      }}
      view={{ mode: viewMode, onChange: setViewMode }}
      resultSummary={resultSummary}
    />
  );
}
