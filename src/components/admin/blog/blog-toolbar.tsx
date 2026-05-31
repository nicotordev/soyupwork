"use client";

import {
  ADMIN_BLOG_FILTER_ALL,
  ADMIN_BLOG_STATUS_FILTER_OPTIONS,
} from "@/constants/blog.constants";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type {
  AdminBlogCategoryOption,
  ParsedAdminBlogParams,
} from "@/types/blog.types";
import type { BlogPagination } from "@/types/blog.types";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import { Search } from "lucide-react";

type BlogToolbarProps = {
  filters: ParsedAdminBlogParams;
  pagination: BlogPagination;
  categories: AdminBlogCategoryOption[];
};

export function BlogToolbar({
  filters,
  pagination,
  categories,
}: BlogToolbarProps) {
  const { localQuery, setLocalQuery, setParam, clearParams } =
    useAdminListingParams();

  const hasFilters =
    filters.q.length > 0 ||
    filters.status !== ADMIN_BLOG_FILTER_ALL ||
    filters.categorySlug !== ADMIN_BLOG_FILTER_ALL;

  return (
    <div
      className={cn(
        adminPanelClass,
        "flex flex-col gap-4 border-x-0 border-t-0 rounded-none p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6",
      )}
    >
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Buscar por título o slug…"
            className={cn(adminInputClass, "h-9 w-full pl-9")}
            aria-label="Buscar artículos"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) =>
            setParam("status", e.target.value, ADMIN_BLOG_FILTER_ALL)
          }
          className={cn(adminInputClass, "h-9 min-w-[140px]")}
          aria-label="Filtrar por estado"
        >
          {ADMIN_BLOG_STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={filters.categorySlug}
          onChange={(e) =>
            setParam("categoria", e.target.value, ADMIN_BLOG_FILTER_ALL)
          }
          className={cn(adminInputClass, "h-9 min-w-[140px]")}
          aria-label="Filtrar por categoría"
        >
          <option value={ADMIN_BLOG_FILTER_ALL}>Todas las categorías</option>
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

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <p className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
          {pagination.totalCount} artículo
          {pagination.totalCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
