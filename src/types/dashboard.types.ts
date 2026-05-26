import type { TablerIcon } from "@tabler/icons-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: TablerIcon;
  description?: string;
};

export type DashboardStatTrend = "up" | "down" | "neutral";

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend: DashboardStatTrend;
  changeLabel: string;
};

export type DashboardRevenuePoint = {
  month: string;
  revenue: number;
  orders: number;
};

export type DashboardOrderStatus = "completed" | "pending" | "refunded";

export type DashboardOrder = {
  id: string;
  customer: string;
  course: string;
  amount: number;
  status: DashboardOrderStatus;
  createdAt: string;
};

export type DashboardActivityType =
  | "sale"
  | "enrollment"
  | "course"
  | "refund"
  | "user";

export type DashboardActivity = {
  id: string;
  type: DashboardActivityType;
  title: string;
  description: string;
  timestamp: string;
};

export type DashboardQuickAction = {
  id: string;
  label: string;
  description: string;
  href: string;
};

export type DashboardOverviewData = {
  stats: DashboardStat[];
  revenueSeries: DashboardRevenuePoint[];
  recentOrders: DashboardOrder[];
  recentActivity: DashboardActivity[];
  quickActions: DashboardQuickAction[];
};
