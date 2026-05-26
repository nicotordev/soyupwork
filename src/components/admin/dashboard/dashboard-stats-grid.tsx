import {
  adminPanelTitleClass,
  adminStatCardClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/types/dashboard.types";
import {
  IconMinus,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";

type DashboardStatsGridProps = {
  stats: DashboardStat[];
};

const trendIcon = {
  up: IconTrendingUp,
  down: IconTrendingDown,
  neutral: IconMinus,
} as const;

const trendBadgeVariant = {
  up: "default",
  down: "destructive",
  neutral: "secondary",
} as const;

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <section aria-labelledby="dashboard-stats-heading">
      <h2 id="dashboard-stats-heading" className="sr-only">
        Métricas principales
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const TrendIcon = trendIcon[stat.trend];

          return (
            <article key={stat.id} className={adminStatCardClass}>
              <div className="flex items-start justify-between gap-2">
                <p className={adminPanelTitleClass}>{stat.label}</p>
                <Badge
                  variant={trendBadgeVariant[stat.trend]}
                  className="font-mono text-[10px] uppercase"
                >
                  <TrendIcon className="size-3" stroke={2.5} />
                  {stat.changeLabel}
                </Badge>
              </div>
              <p className="mt-3 font-heading text-2xl font-extrabold tracking-tight md:text-3xl">
                {stat.value}
              </p>
              <p
                className={cn(
                  "mt-1 font-mono text-[10px] font-bold uppercase text-muted-foreground",
                )}
              >
                {stat.helper}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
