"use client";

import {
  AdminFilterField,
  adminFilterSelectTriggerClass,
} from "@/components/admin/listing/admin-filter-field";
import { AdminToolbar } from "@/components/admin/listing/admin-toolbar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ADMIN_RESOURCES_FILTER_ALL,
  ADMIN_RESOURCES_KIND_TABS,
  ADMIN_RESOURCES_STATUS_FILTER_OPTIONS,
} from "@/constants/resources-admin.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import type { AdminActiveFilter } from "@/types/admin-listing.types";
import type {
  AdminResourceCategoryOption,
  AdminResourcesPagination,
  ParsedAdminResourcesParams,
} from "@/types/resources-admin.types";
import { useMemo } from "react";

type ResourcesToolbarProps = {
  filters: ParsedAdminResourcesParams;
  pagination: AdminResourcesPagination;
  categories: AdminResourceCategoryOption[];
};

export function ResourcesToolbar({
  filters,
  pagination,
  categories,
}: ResourcesToolbarProps) {
  const {
    localQuery,
    setLocalQuery,
    viewMode,
    setViewMode,
    setParam,
    clearParams,
    replaceParams,
    isPending,
  } = useAdminListingParams();

  const hasActiveFilters =
    filters.q.length > 0 ||
    filters.status !== ADMIN_RESOURCES_FILTER_ALL ||
    filters.categorySlug !== ADMIN_RESOURCES_FILTER_ALL;

  const activeFiltersCount = [
    filters.status !== ADMIN_RESOURCES_FILTER_ALL,
    filters.categorySlug !== ADMIN_RESOURCES_FILTER_ALL,
  ].filter(Boolean).length;

  const statusLabel =
    ADMIN_RESOURCES_STATUS_FILTER_OPTIONS.find(
      (o) => o.value === filters.status,
    )?.label ?? filters.status;

  const categoryLabel =
    categories.find((o) => o.slug === filters.categorySlug)?.name ??
    filters.categorySlug;

  const activeFilterBadges = useMemo((): AdminActiveFilter[] => {
    const badges: AdminActiveFilter[] = [];

    if (filters.status !== ADMIN_RESOURCES_FILTER_ALL) {
      badges.push({
        key: "status",
        label: "Estado",
        value: statusLabel,
        onRemove: () => setParam("status", null, ADMIN_RESOURCES_FILTER_ALL),
      });
    }

    if (filters.categorySlug !== ADMIN_RESOURCES_FILTER_ALL) {
      badges.push({
        key: "categoria",
        label: "Categoría",
        value: categoryLabel,
        onRemove: () => setParam("categoria", null, ADMIN_RESOURCES_FILTER_ALL),
      });
    }

    return badges;
  }, [
    filters.status,
    filters.categorySlug,
    statusLabel,
    categoryLabel,
    setParam,
  ]);

  const resultSummary =
    pagination.totalCount === 1
      ? "1 recurso encontrado"
      : `${pagination.totalCount} recursos encontrados` +
        (pagination.totalPages > 1
          ? ` · página ${pagination.page} de ${pagination.totalPages}`
          : "");

  return (
    <div className="space-y-4">
      {/* High-level Kind Selection Tabs */}
      <div className="flex flex-wrap gap-2 px-4 sm:px-0">
        {ADMIN_RESOURCES_KIND_TABS.map((tab) => (
          <Button
            key={tab.value}
            type="button"
            variant={filters.kind === tab.value ? "default" : "outline"}
            onClick={() => {
              replaceParams((params) => {
                params.set("tipo", tab.value);
                params.delete("categoria");
                params.delete("page");
              });
            }}
            className="h-9 px-4 font-mono text-[10px] font-black uppercase"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Main Admin Toolbar with Search, Popover Filters, Badges and View toggle */}
      <AdminToolbar
        isPending={isPending}
        search={{
          value: localQuery,
          onChange: setLocalQuery,
          placeholder: "Buscar por título o slug…",
          ariaLabel: "Buscar recursos",
        }}
        filters={{
          activeCount: activeFiltersCount,
          hasActiveFilters,
          onClear: () => clearParams(["q", "status", "categoria", "page"]),
          title: "Filtros",
          children: (
            <>
              <AdminFilterField label="Estado">
                <Select
                  value={filters.status}
                  onValueChange={(value) =>
                    setParam("status", value, ADMIN_RESOURCES_FILTER_ALL)
                  }
                >
                  <SelectTrigger className={adminFilterSelectTriggerClass}>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_RESOURCES_STATUS_FILTER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AdminFilterField>

              <AdminFilterField label="Categoría">
                <Select
                  value={filters.categorySlug}
                  onValueChange={(value) =>
                    setParam("categoria", value, ADMIN_RESOURCES_FILTER_ALL)
                  }
                >
                  <SelectTrigger className={adminFilterSelectTriggerClass}>
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ADMIN_RESOURCES_FILTER_ALL}>
                      Todas las categorías
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AdminFilterField>
            </>
          ),
        }}
        view={{ mode: viewMode, onChange: setViewMode }}
        activeFilterBadges={activeFilterBadges}
        resultSummary={resultSummary}
      />
    </div>
  );
}
