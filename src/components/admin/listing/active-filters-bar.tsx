"use client";

import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { AdminActiveFilter } from "@/types/admin-listing.types";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ActiveFiltersBarProps = {
  filters: AdminActiveFilter[];
  onClearAll?: () => void;
  className?: string;
};

export function ActiveFiltersBar({
  filters,
  onClearAll,
  className,
}: ActiveFiltersBarProps) {
  if (filters.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-t border-foreground/15 px-4 py-2.5",
        className,
      )}
      aria-label="Filtros activos"
    >
      <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
        Activos
      </span>
      {filters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="gap-1 pr-1 font-mono text-[10px] font-bold uppercase"
        >
          <span className="text-muted-foreground">{filter.label}:</span>
          <span>{filter.value}</span>
          <button
            type="button"
            onClick={filter.onRemove}
            className="ml-0.5 rounded-sm p-0.5 hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label={`Quitar filtro ${filter.label}`}
          >
            <X className="size-3" aria-hidden />
          </button>
        </Badge>
      ))}
      {onClearAll ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className={cn(
            adminBrutalButtonClass,
            "h-7 px-2 font-mono text-[10px] font-bold uppercase",
          )}
        >
          Limpiar todo
        </Button>
      ) : null}
    </div>
  );
}
