export type AdminMetricsStageId =
  | "registered_users"
  | "enrolled_users"
  | "checkout_started"
  | "sales_completed";

export type AdminMetricsStage = {
  id: AdminMetricsStageId;
  name: string;
  count: number;
  percentage: number;
  description: string;
  color: string;
};

export type AdminMetricsStats = {
  conversionRate: number;
  checkoutRetention: number;
  avgHoursToFirstOrder: number;
  studentLtv: number;
};

export type AdminMetricsPageData = {
  stats: AdminMetricsStats;
  stages: AdminMetricsStage[];
};
