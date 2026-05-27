import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { AdminCohortsDashboard } from "@/components/admin/cohorts/admin-cohorts-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cohortes y Grupos | Admin | SoyUpwork",
  description: "Calendarios de estudio y mentorías grupales.",
};

export default function AdminCohortsPage() {
  return (
    <AdminDashboardContainer>
      <AdminCohortsDashboard />
    </AdminDashboardContainer>
  );
}
