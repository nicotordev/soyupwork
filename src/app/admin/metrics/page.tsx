import { getAdminMetricsPageData } from "@/app/actions/metrics.actions";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { AdminMetricsDashboard } from "@/components/admin/metrics/admin-metrics-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Métricas y Analíticas | Admin | SoyUpwork",
  description: "Embudos de conversión y retención del estudiante.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminMetricsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getAdminMetricsPageData(resolvedSearchParams);

  return (
    <AdminDashboardContainer>
      <AdminMetricsDashboard data={data} />
    </AdminDashboardContainer>
  );
}
