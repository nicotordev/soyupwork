import {
  adminBrutalButtonClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { DashboardQuickAction } from "@/types/dashboard.types";
import { IconArrowRight, IconBolt } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type DashboardQuickActionsProps = {
  actions: DashboardQuickAction[];
};

export function DashboardQuickActions({ actions }: DashboardQuickActionsProps) {
  return (
    <section className={adminPanelClass} aria-labelledby="quick-actions-title">
      <div className={adminPanelHeaderClass}>
        <div className="flex min-w-0 items-center gap-2">
          <IconBolt
            className="size-4 shrink-0 text-primary"
            stroke={2.5}
            aria-hidden
          />
          <div className="min-w-0">
            <h2 id="quick-actions-title" className={adminPanelTitleClass}>
              Acciones rápidas
            </h2>
            <p className="text-xs text-muted-foreground">
              Tareas frecuentes del panel
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: horizontal scroll. Stacked full-width: 2 cols. XL sidebar: 1 col */}
      <div
        className={cn(
          "flex gap-2 overflow-x-auto p-3 pb-4",
          "snap-x snap-mandatory scroll-px-3",
          "[scrollbar-width:thin]",
          "sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:p-4 sm:pb-4 sm:snap-none",
          "xl:grid-cols-1",
        )}
      >
        {actions.map((action) => (
          <Button
            key={action.id}
            asChild
            variant="outline"
            className={cn(
              "h-auto w-[min(100%,17.5rem)] shrink-0 snap-start flex-col items-start gap-1.5 p-3 text-left",
              "min-h-11 min-w-[11.5rem]",
              "sm:w-auto sm:min-w-0 sm:shrink sm:min-h-[4.5rem]",
              "xl:min-h-[4rem]",
              "transition-transform duration-100 hover:scale-[1.01] active:scale-[0.99]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              adminBrutalButtonClass,
            )}
          >
            <Link href={action.href}>
              <span className="flex w-full min-w-0 items-start justify-between gap-2 font-mono text-[11px] font-bold uppercase leading-snug sm:text-xs">
                <span className="min-w-0 text-pretty">{action.label}</span>
                <IconArrowRight
                  className="mt-0.5 size-3.5 shrink-0 sm:size-4"
                  stroke={2.5}
                  aria-hidden
                />
              </span>
              <span className="line-clamp-2 text-[11px] font-normal normal-case leading-snug text-muted-foreground sm:line-clamp-3 sm:text-xs">
                {action.description}
              </span>
            </Link>
          </Button>
        ))}
      </div>
    </section>
  );
}
