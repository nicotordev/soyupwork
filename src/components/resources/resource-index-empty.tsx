import Link from "next/link";
import type { ResourcePageConfig } from "@/types/resource-catalog.types";
import { cn } from "@/lib/utils";
import { FilterX, FolderOpen } from "lucide-react";

type ResourceIndexEmptyProps = {
  page: ResourcePageConfig;
  hasFilters: boolean;
};

export function ResourceIndexEmpty({ page, hasFilters }: ResourceIndexEmptyProps) {
  const Icon = hasFilters ? FilterX : FolderOpen;
  const copy = page.empty;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border-2 border-foreground bg-card text-center",
        "shadow-[4px_4px_0px_0px_var(--foreground)]",
      )}
    >
      <div className="border-b-2 border-foreground bg-secondary/30 px-4 py-3">
        <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          {hasFilters ? "Sin coincidencias" : "Catálogo"}
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 px-6 py-10">
        <div className="flex size-14 items-center justify-center rounded-xl border-2 border-foreground bg-primary/10 shadow-[3px_3px_0px_0px_var(--foreground)]">
          <Icon className="size-7 text-primary" strokeWidth={2.25} />
        </div>
        <div className="max-w-sm space-y-2">
          <h2 className="font-heading text-lg font-black tracking-tight">
            {hasFilters ? copy.filteredTitle : copy.emptyTitle}
          </h2>
          <p className="text-sm font-medium leading-relaxed text-muted-foreground">
            {hasFilters ? copy.filteredDescription : copy.emptyDescription}
          </p>
        </div>
        {hasFilters ? (
          <Link
            href={page.path}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border-2 border-foreground bg-primary px-5 font-mono text-xs font-black uppercase tracking-wider text-primary-foreground shadow-[3px_3px_0px_0px_var(--foreground)]"
          >
            {copy.filteredCta}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
