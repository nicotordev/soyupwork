"use client";

import {
  adminBrutalButtonClass,
  adminGridBackgroundClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  hasFilters: boolean;
  onClearFilters?: () => void;
  clearFiltersLabel?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  hasFilters,
  onClearFilters,
  clearFiltersLabel = "Limpiar filtros",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(adminPanelClass, "relative overflow-hidden", className)}>
      <div className={adminGridBackgroundClass} />
      <Empty className="relative z-10 border-0 py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon className="size-6 text-primary" aria-hidden />
          </EmptyMedia>
          <EmptyTitle className="font-heading text-xl font-extrabold">
            {hasFilters ? "Sin resultados" : title}
          </EmptyTitle>
          <EmptyDescription>
            {hasFilters
              ? "Probá con otros términos o limpiá los filtros para ver todos los registros."
              : description}
          </EmptyDescription>
        </EmptyHeader>
        {hasFilters && onClearFilters ? (
          <Button
            type="button"
            variant="outline"
            onClick={onClearFilters}
            className={adminBrutalButtonClass}
          >
            {clearFiltersLabel}
          </Button>
        ) : (
          action
        )}
      </Empty>
    </div>
  );
}
