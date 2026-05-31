"use client";

import {
  ADMIN_RESOURCES_FILTER_ALL,
  ADMIN_RESOURCES_KIND_TABS,
  ADMIN_RESOURCES_STATUS_FILTER_OPTIONS,
} from "@/constants/resources-admin.constants";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type {
  AdminResourceCategoryOption,
  AdminResourcesPagination,
  ParsedAdminResourcesParams,
} from "@/types/resources-admin.types";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import { Search } from "lucide-react";

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
  const { localQuery, setLocalQuery, setParam, clearParams, replaceParams } =
    useAdminListingParams();

  const hasFilters =
    filters.q.length > 0 ||
    filters.status !== ADMIN_RESOURCES_FILTER_ALL ||
    filters.categorySlug !== ADMIN_RESOURCES_FILTER_ALL;

  return (
    <div
      className={cn(
        adminPanelClass,
        "flex flex-col gap-4 border-x-0 border-t-0 rounded-none p-4 sm:px-6",
      )}
    >
      <div className="flex flex-wrap gap-2">
        {ADMIN_RESOURCES_KIND_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              replaceParams((params) => {
                params.set("tipo", tab.value);
                params.delete("categoria");
                params.delete("page");
              });
            }}
            className={cn(
              adminBrutalButtonClass,
              "h-9 px-4 text-[10px] font-black uppercase",
              filters.kind === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-background",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Buscar por título o slug…"
              className={cn(adminInputClass, "h-9 w-full pl-9")}
              aria-label="Buscar recursos"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) =>
              setParam("status", e.target.value, ADMIN_RESOURCES_FILTER_ALL)
            }
            className={cn(adminInputClass, "h-9 min-w-[140px]")}
            aria-label="Filtrar por estado"
          >
            {ADMIN_RESOURCES_STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={filters.categorySlug}
            onChange={(e) =>
              setParam("categoria", e.target.value, ADMIN_RESOURCES_FILTER_ALL)
            }
            className={cn(adminInputClass, "h-9 min-w-[140px]")}
            aria-label="Filtrar por categoría"
          >
            <option value={ADMIN_RESOURCES_FILTER_ALL}>
              Todas las categorías
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {hasFilters ? (
            <button
              type="button"
              onClick={() => clearParams(["q", "status", "categoria", "page"])}
              className={cn(adminBrutalButtonClass, "h-9 px-3 text-[10px]")}
            >
              Limpiar
            </button>
          ) : null}
        </div>

        <p className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
          {pagination.totalCount} recurso
          {pagination.totalCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
