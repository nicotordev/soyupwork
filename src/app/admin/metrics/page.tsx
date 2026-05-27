import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { AdminMetricsDashboard } from "@/components/admin/metrics/admin-metrics-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Métricas y Analíticas | Admin | SoyUpwork",
  description: "Embudos de conversión y retención del estudiante.",
};

export default function AdminMetricsPage() {
  return (
    <AdminDashboardContainer>
      <AdminMetricsDashboard />
    </AdminDashboardContainer>
  );
}
