"use client";

import { ADMIN_LISTING_VIEW } from "@/constants/admin-listing.constants";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { AdminViewConfig } from "@/types/admin-listing.types";
import { LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AdminViewToggleProps = AdminViewConfig & {
  className?: string;
};

export function AdminViewToggle({
  mode,
  onChange,
  className,
}: AdminViewToggleProps) {
  return (
    <div
      className={cn(
        "flex h-9 shrink-0 overflow-hidden rounded border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)]",
        className,
      )}
      role="group"
      aria-label="Modo de visualización"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(ADMIN_LISTING_VIEW.TABLE)}
            className={cn(
              "h-9 w-9 rounded-none border-r-2 border-foreground p-0",
              mode === ADMIN_LISTING_VIEW.TABLE
                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-label="Ver como tabla"
            aria-pressed={mode === ADMIN_LISTING_VIEW.TABLE}
          >
            <List className="size-4" aria-hidden />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Tabla</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(ADMIN_LISTING_VIEW.CARDS)}
            className={cn(
              "h-9 w-9 rounded-none p-0",
              mode === ADMIN_LISTING_VIEW.CARDS
                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-label="Ver como tarjetas"
            aria-pressed={mode === ADMIN_LISTING_VIEW.CARDS}
          >
            <LayoutGrid className="size-4" aria-hidden />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Tarjetas</TooltipContent>
      </Tooltip>
    </div>
  );
}
