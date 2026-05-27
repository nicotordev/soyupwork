import { getAdminCohortsPageData } from "@/app/actions/cohorts.actions";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { AdminCohortsDashboard } from "@/components/admin/cohorts/admin-cohorts-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cohortes y Grupos | Admin | SoyUpwork",
  description: "Calendarios de estudio y mentorías grupales.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCohortsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getAdminCohortsPageData(resolvedSearchParams);

  return (
    <AdminDashboardContainer>
      <AdminCohortsDashboard data={data} />
    </AdminDashboardContainer>
  );
}
