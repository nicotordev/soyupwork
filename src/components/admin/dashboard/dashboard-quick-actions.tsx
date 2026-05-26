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
        <div className="flex items-center gap-2">
          <IconBolt className="size-4 text-primary" stroke={2.5} />
          <div>
            <h2 id="quick-actions-title" className={adminPanelTitleClass}>
              Acciones rápidas
            </h2>
            <p className="text-xs text-muted-foreground">
              Tareas frecuentes del panel
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-2 p-4 sm:grid-cols-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            asChild
            variant="outline"
            className={cn(
              "h-auto flex-col items-start gap-1 p-3 text-left",
              adminBrutalButtonClass,
            )}
          >
            <Link href={action.href}>
              <span className="flex w-full items-center justify-between gap-2 font-mono text-xs font-bold uppercase">
                {action.label}
                <IconArrowRight className="size-3.5 shrink-0" stroke={2.5} />
              </span>
              <span className="text-[11px] font-normal normal-case text-muted-foreground text-wrap">
                {action.description}
              </span>
            </Link>
          </Button>
        ))}
      </div>
    </section>
  );
}
