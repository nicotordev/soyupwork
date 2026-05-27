import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { AdminMetricsDashboard } from "@/components/admin/metrics/admin-metrics-dashboard";
import { adminEyebrowClass } from "@/lib/admin/styles";
import { IconChartBar } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Métricas y Analíticas | Admin | SoyUpwork",
  description: "Embudos de conversión y retención del estudiante.",
};

export default async function AdminMetricsPage() {
  return (
    <AdminDashboardContainer>
      <div className="space-y-6">
        <header className="mb-6 space-y-4 border-b-4 border-foreground pb-6">
          <div className={adminEyebrowClass}>
            <IconChartBar className="size-4 text-primary" stroke={2.5} />
            Panel de administración
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
              Métricas y Analíticas
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Embudos de conversión y retención del estudiante.
            </p>
          </div>
        </header>
        <AdminMetricsDashboard />
      </div>
    </AdminDashboardContainer>
  );
}
