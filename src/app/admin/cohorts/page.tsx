import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { AdminCohortsDashboard } from "@/components/admin/cohorts/admin-cohorts-dashboard";
import { adminEyebrowClass } from "@/lib/admin/styles";
import { IconUsersGroup } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cohortes y Grupos | Admin | SoyUpwork",
  description: "Calendarios de estudio y mentorías grupales.",
};

export default async function AdminCohortsPage() {
  return (
    <AdminDashboardContainer>
      <div className="space-y-6">
        <header className="mb-6 space-y-4 border-b-4 border-foreground pb-6">
          <div className={adminEyebrowClass}>
            <IconUsersGroup className="size-4 text-primary" stroke={2.5} />
            Panel de administración
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
              Cohortes y Grupos
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Calendarios de estudio y mentorías grupales.
            </p>
          </div>
        </header>
        <AdminCohortsDashboard />
      </div>
    </AdminDashboardContainer>
  );
}
