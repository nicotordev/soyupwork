"use client";

import { ResourceCreateDialog } from "@/components/admin/resources/resource-create-dialog";
import { Button } from "@/components/ui/button";
import {
  ADMIN_RESOURCES_KIND_GUIDE,
  ADMIN_RESOURCES_PAGE,
} from "@/constants/resources-admin.constants";
import type { AdminResourcesKindParam } from "@/constants/resources-admin.constants";
import {
  adminBrutalButtonClass,
  adminGridBackgroundClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { FileText, Search, LayoutGrid } from "lucide-react";
import { useState } from "react";

const HINT_ICONS = [FileText, LayoutGrid, Search] as const;

type ResourcesEmptyStateProps = {
  kind: AdminResourcesKindParam;
  hasFilters: boolean;
  onClearFilters?: () => void;
};

export function ResourcesEmptyState({
  kind,
  hasFilters,
  onClearFilters,
}: ResourcesEmptyStateProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const copy = ADMIN_RESOURCES_PAGE.empty;
  const createCta =
    kind === ADMIN_RESOURCES_KIND_GUIDE
      ? copy.createGuideCta
      : copy.createTemplateCta;

  return (
    <div
      className={cn(
        adminPanelClass,
        "relative mx-4 mb-6 overflow-hidden sm:mx-6 mt-4",
      )}
    >
      <div className={adminGridBackgroundClass} />
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-16 text-center">
        <span className="group flex size-16 items-center justify-center rounded-lg border-2 border-foreground bg-secondary shadow-[4px_4px_0px_0px_var(--foreground)] transition-all duration-300 hover:-translate-y-1 hover:rotate-3 hover:shadow-[6px_6px_0px_0px_var(--foreground)]">
          <FileText
            className="size-8 text-primary transition-transform duration-300 group-hover:scale-110"
            aria-hidden
          />
        </span>

        <div className="max-w-lg space-y-2">
          <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Recursos · Catálogo
          </p>
          <h2 className="font-heading text-xl font-extrabold tracking-tight sm:text-2xl">
            {hasFilters ? copy.filteredTitle : copy.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {hasFilters ? copy.filteredDescription : copy.description}
          </p>
        </div>

        {!hasFilters ? (
          <ul className="grid w-full max-w-md gap-3 text-left sm:grid-cols-3">
            {copy.hints.map((hint, index) => {
              const Icon = HINT_ICONS[index] ?? FileText;
              return (
                <li
                  key={hint}
                  className="flex items-start gap-2.5 rounded-lg border-2 border-foreground/15 bg-card/90 px-3.5 py-3 shadow-[2px_2px_0px_0px_var(--foreground)] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--foreground)]"
                >
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span className="text-[11px] font-bold leading-snug text-foreground/90">
                    {hint}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}

        <div className="flex justify-center gap-2">
          {hasFilters && onClearFilters ? (
            <Button
              type="button"
              variant="outline"
              onClick={onClearFilters}
              className={cn(
                adminBrutalButtonClass,
                "h-10 px-5 font-mono text-xs font-bold uppercase",
              )}
            >
              {copy.clearFilters}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                onClick={() => setCreateOpen(true)}
                className={cn(
                  adminBrutalButtonClass,
                  "h-10 px-5 font-mono text-xs font-bold uppercase",
                )}
              >
                {createCta}
              </Button>
              <ResourceCreateDialog
                kind={kind}
                isOpen={createOpen}
                onOpenChange={setCreateOpen}
                hideTrigger
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
