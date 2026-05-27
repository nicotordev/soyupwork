"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  adminBrutalButtonClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { AdminFiltersConfig } from "@/types/admin-listing.types";
import { ChevronDown, Filter } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type AdminFiltersProps = AdminFiltersConfig;

function FiltersPanel({
  title,
  hasActiveFilters,
  onClear,
  children,
}: AdminFiltersConfig) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
        <h3 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">
          {title ?? "Filtros"}
        </h3>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClear}
            className="cursor-pointer font-mono text-[10px] font-bold text-primary uppercase hover:underline"
          >
            Limpiar
          </button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function AdminFilters({
  activeCount,
  hasActiveFilters,
  onClear,
  title,
  children,
}: AdminFiltersProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const trigger = (
    <Button
      type="button"
      variant="outline"
      className={cn(
        adminBrutalButtonClass,
        "h-9 shrink-0 gap-1.5 font-mono text-xs font-bold uppercase",
      )}
      aria-label="Abrir filtros"
    >
      <Filter className="size-4" aria-hidden />
      <span className="hidden sm:inline">Filtros</span>
      {activeCount > 0 ? (
        <span
          className="ml-0.5 flex size-5 items-center justify-center rounded border border-foreground bg-primary text-[10px] font-bold text-primary-foreground shadow-[1px_1px_0px_0px_var(--foreground)]"
          aria-hidden
        >
          {activeCount}
        </span>
      ) : null}
      <ChevronDown className="ml-0.5 size-3.5 text-muted-foreground" aria-hidden />
    </Button>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent
          side="bottom"
          className={cn(
            adminPanelClass,
            "max-h-[85vh] overflow-y-auto border-2 border-foreground bg-background p-4",
          )}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{title ?? "Filtros"}</SheetTitle>
          </SheetHeader>
          <FiltersPanel
            title={title}
            hasActiveFilters={hasActiveFilters}
            onClear={() => {
              onClear();
              setOpen(false);
            }}
            activeCount={activeCount}
          >
            {children}
          </FiltersPanel>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn(
          adminPanelClass,
          "z-50 flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-4 overflow-hidden border-2 border-foreground bg-background p-4 shadow-[6px_6px_0px_0px_var(--foreground)]",
        )}
      >
        <FiltersPanel
          title={title}
          hasActiveFilters={hasActiveFilters}
          onClear={onClear}
          activeCount={activeCount}
        >
          {children}
        </FiltersPanel>
      </PopoverContent>
    </Popover>
  );
}
