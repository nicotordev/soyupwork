"use client";

import { ActiveFiltersBar } from "@/components/admin/listing/active-filters-bar";
import { AdminFilters } from "@/components/admin/listing/admin-filters";
import { AdminSearchInput } from "@/components/admin/listing/admin-search-input";
import { AdminViewToggle } from "@/components/admin/listing/admin-view-toggle";
import { adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type {
  AdminActiveFilter,
  AdminFiltersConfig,
  AdminSearchConfig,
  AdminViewConfig,
} from "@/types/admin-listing.types";
import type { ReactNode } from "react";

type AdminToolbarProps = {
  search: AdminSearchConfig;
  filters?: AdminFiltersConfig;
  view?: AdminViewConfig;
  actions?: ReactNode;
  activeFilterBadges?: AdminActiveFilter[];
  resultSummary?: string;
  isPending?: boolean;
  className?: string;
  sticky?: boolean;
};

export function AdminToolbar({
  search,
  filters,
  view,
  actions,
  activeFilterBadges = [],
  resultSummary,
  isPending = false,
  className,
  sticky = true,
}: AdminToolbarProps) {
  return (
    <section
      className={cn(
        adminPanelClass,
        "mb-6 overflow-hidden",
        sticky && "sticky top-0 z-20",
        isPending && "opacity-70",
        className,
      )}
      aria-label="Barra de herramientas"
    >
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <AdminSearchInput {...search} />
          {filters ? <AdminFilters {...filters} /> : null}
          {view ? <AdminViewToggle {...view} /> : null}
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>

        {activeFilterBadges.length > 0 ? (
          <ActiveFiltersBar
            filters={activeFilterBadges}
            onClearAll={
              filters?.hasActiveFilters ? filters.onClear : undefined
            }
            className="border-t-0 px-0 pt-0"
          />
        ) : null}

        {resultSummary ? (
          <p className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
            {resultSummary}
          </p>
        ) : null}
      </div>
    </section>
  );
}
