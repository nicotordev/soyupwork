import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { DashboardOverview } from "@/components/admin/dashboard/dashboard-overview";
import { getDashboardOverviewData } from "@/lib/admin/get-dashboard-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resumen",
  description:
    "Métricas, ventas y actividad reciente del panel de administración de SoyUpwork.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const range = typeof resolvedSearchParams.range === "string" ? resolvedSearchParams.range : "30d";
  const data = getDashboardOverviewData();

  return (
    <AdminDashboardContainer>
      <DashboardOverview data={data} range={range} />
    </AdminDashboardContainer>
  );
}

