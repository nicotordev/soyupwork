"use client";

import { DASHBOARD_CHART_CONFIG } from "@/constants/dashboard.constants";
import {
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/dashboard-styles";
import { formatDashboardCompactCurrency } from "@/lib/admin/format-dashboard";
import type { DashboardRevenuePoint } from "@/types/dashboard.types";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type DashboardRevenueChartProps = {
  data: DashboardRevenuePoint[];
};

const chartConfig = {
  revenue: {
    label: DASHBOARD_CHART_CONFIG.revenue.label,
    color: DASHBOARD_CHART_CONFIG.revenue.color,
  },
  orders: {
    label: DASHBOARD_CHART_CONFIG.orders.label,
    color: DASHBOARD_CHART_CONFIG.orders.color,
  },
} satisfies ChartConfig;

export function DashboardRevenueChart({ data }: DashboardRevenueChartProps) {
  return (
    <section className={adminPanelClass} aria-labelledby="revenue-chart-title">
      <div className={adminPanelHeaderClass}>
        <div>
          <h2 id="revenue-chart-title" className={adminPanelTitleClass}>
            Ingresos y pedidos
          </h2>
          <p className="text-xs text-muted-foreground">
            Últimos 6 meses · datos de demostración
          </p>
        </div>
      </div>
      <div className="px-2 pb-4 pt-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                formatDashboardCompactCurrency(Number(value))
              }
              width={48}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return formatDashboardCompactCurrency(Number(value));
                    }
                    return String(value);
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="orders"
              fill="var(--color-orders)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </section>
  );
}
