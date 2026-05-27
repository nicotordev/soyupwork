"use client";

import { DashboardActivityFeed } from "@/components/admin/dashboard/dashboard-activity-feed";
import { DashboardOrdersTable } from "@/components/admin/dashboard/dashboard-orders-table";
import { DashboardPageHeader } from "@/components/admin/dashboard/dashboard-page-header";
import { DashboardQuickActions } from "@/components/admin/dashboard/dashboard-quick-actions";
import { DashboardRevenueChart } from "@/components/admin/dashboard/dashboard-revenue-chart";
import { DashboardStatsGrid } from "@/components/admin/dashboard/dashboard-stats-grid";
import { cn } from "@/lib/utils";
import type { DashboardOverviewData } from "@/types/dashboard.types";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

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

export function DashboardOverview({
  data,
  range = "30d",
}: DashboardOverviewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const activeRangeLabel =
    RANGES.find((item) => item.id === range)?.label ?? "30 días";

  const handleRangeChange = (newRange: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", newRange);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Section with Status & Range Selector */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b-2 border-foreground/20 pb-4">
        <DashboardPageHeader />

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <span className="inline-flex items-center rounded border-2 border-foreground bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold uppercase text-foreground">
            Rango: {activeRangeLabel}
          </span>
          {/* Neobrutalist Range Tab Selector */}
          <div className="flex border-2 border-foreground rounded bg-background shadow-[3px_3px_0px_0px_var(--foreground)] overflow-hidden">
            {RANGES.map((r) => {
              const active = range === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRangeChange(r.id)}
                  aria-pressed={active}
                  disabled={isPending}
                  className={cn(
                    "px-3 py-1 font-mono text-[10px] font-extrabold uppercase border-r-2 border-foreground last:border-r-0 transition-colors",
                    active
                      ? "bg-secondary text-foreground shadow-inner"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    isPending && "opacity-70",
                  )}
                >
                  {active ? `● ${r.label}` : r.label}
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
        className={cn(
          "space-y-6",
          isPending && "opacity-75 transition-opacity",
        )}
      >
        <DashboardStatsGrid stats={data.stats} />

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <DashboardRevenueChart data={data.revenueSeries} />
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
