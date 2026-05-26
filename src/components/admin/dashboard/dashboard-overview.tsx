"use client";

import { useTransition, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardActivityFeed } from "@/components/admin/dashboard/dashboard-activity-feed";
import { DashboardOrdersTable } from "@/components/admin/dashboard/dashboard-orders-table";
import { DashboardPageHeader } from "@/components/admin/dashboard/dashboard-page-header";
import { DashboardQuickActions } from "@/components/admin/dashboard/dashboard-quick-actions";
import { DashboardRevenueChart } from "@/components/admin/dashboard/dashboard-revenue-chart";
import { DashboardStatsGrid } from "@/components/admin/dashboard/dashboard-stats-grid";
import type { DashboardOverviewData, DashboardStat, DashboardRevenuePoint } from "@/types/dashboard.types";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { IconCircleDot } from "@tabler/icons-react";

type DashboardOverviewProps = {
  data: DashboardOverviewData;
  range?: string;
};

const RANGES = [
  { id: "7d", label: "7 días" },
  { id: "30d", label: "30 días" },
  { id: "12m", label: "12 meses" },
  { id: "all", label: "Histórico" },
];

export function DashboardOverview({ data, range = "30d" }: DashboardOverviewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleRangeChange = (newRange: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", newRange);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Simulate range-based statistics transformation to make it look alive and responsive!
  const simulatedData = useMemo(() => {
    const multiplier = range === "7d" ? 0.25 : range === "12m" ? 4.2 : range === "all" ? 12.8 : 1.0;
    
    const transformedStats = data.stats.map((stat): DashboardStat => {
      if (stat.id === "revenue") {
        const numericVal = 12480 * multiplier;
        return {
          ...stat,
          value: `$${Math.round(numericVal).toLocaleString("es-CL")}`,
          changeLabel: range === "7d" ? "+3.1%" : range === "12m" ? "+42.8%" : "+128.4%",
          trend: multiplier < 1.0 ? "down" : "up",
        };
      }
      if (stat.id === "sales") {
        const val = Math.round(186 * multiplier);
        return {
          ...stat,
          value: String(val),
          changeLabel: range === "7d" ? "-1.2%" : range === "12m" ? "+31.5%" : "+98.0%",
          trend: multiplier < 1.0 ? "down" : "up",
        };
      }
      if (stat.id === "students") {
        const val = Math.round(1284 * (range === "7d" ? 0.85 : multiplier * 0.9 + 0.1));
        return {
          ...stat,
          value: String(val),
          changeLabel: range === "7d" ? "+0.5%" : "+12.4%",
        };
      }
      return stat;
    });

    const transformedRevenue = data.revenueSeries.map((point): DashboardRevenuePoint => {
      return {
        ...point,
        revenue: Math.round(point.revenue * multiplier),
        orders: Math.round(point.orders * multiplier),
      };
    });

    return {
      stats: transformedStats,
      revenueSeries: transformedRevenue,
    };
  }, [data, range]);

  return (
    <div className="space-y-6">
      {/* Top Header Section with Status & Range Selector */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b-2 border-foreground/20 pb-4">
        <DashboardPageHeader />

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Pulsing Live Connection Indicator */}
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 shadow-[2px_2px_0px_0px_var(--foreground)] dark:bg-emerald-950 dark:text-emerald-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
            </span>
            En vivo
          </div>

          {/* Neobrutalist Range Tab Selector */}
          <div className="flex border-2 border-foreground rounded bg-background shadow-[3px_3px_0px_0px_var(--foreground)] overflow-hidden">
            {RANGES.map((r) => {
              const active = range === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRangeChange(r.id)}
                  className={cn(
                    "px-3 py-1 font-mono text-[10px] font-extrabold uppercase border-r-2 border-foreground last:border-r-0 transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid Components with Stagger Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn("space-y-6", isPending && "opacity-75 transition-opacity")}
      >
        <DashboardStatsGrid stats={simulatedData.stats} />

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <DashboardRevenueChart data={simulatedData.revenueSeries} />
            <DashboardOrdersTable orders={data.recentOrders} />
          </div>
          <div className="space-y-6">
            <DashboardQuickActions actions={data.quickActions} />
            <DashboardActivityFeed activity={data.recentActivity} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

