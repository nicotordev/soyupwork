import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { ADMIN_PLACEHOLDER_ROUTES } from "@/constants/dashboard.constants";
import { adminEyebrowClass } from "@/lib/admin/styles";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  IconUsers,
  IconReceipt,
  IconUsersGroup,
  IconChartBar,
} from "@tabler/icons-react";

// Interactive dashboards
import { AdminUsersDashboard } from "@/components/admin/users/admin-users-dashboard";
import { AdminSalesDashboard } from "@/components/admin/orders/admin-sales-dashboard";
import { AdminCohortsDashboard } from "@/components/admin/cohorts/admin-cohorts-dashboard";
import { AdminMetricsDashboard } from "@/components/admin/metrics/admin-metrics-dashboard";

type PageProps = {
  params: Promise<{ section: string }>;
};

const validSections = new Set(
  ADMIN_PLACEHOLDER_ROUTES.map((route) => route.replace("/admin/", "")),
);

const segmentMetadata: Record<string, { title: string; description: string }> = {
  users: {
    title: "Estudiantes y Permisos",
    description: "Gestión de alumnos, roles y permisos de acceso.",
  },
  sales: {
    title: "Ventas y Cobros",
    description: "Seguimiento de pedidos, suscripciones e integraciones.",
  },
  cohorts: {
    title: "Cohortes y Grupos",
    description: "Calendarios de estudio y mentorías grupales.",
  },
  metrics: {
    title: "Métricas y Analíticas",
    description: "Embudos de conversión y retención del estudiante.",
  },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { section } = await params;
  const meta = segmentMetadata[section];
  return {
    title: `${meta?.title ?? section} | Admin | SoyUpwork`,
    description: meta?.description,
  };
}

export default async function AdminSectionPage({ params }: PageProps) {
  const { section } = await params;

  if (!validSections.has(section)) {
    notFound();
  }

  return (
    <AdminDashboardContainer>
      <div className="space-y-6">
        {section === "users" && (
          <>
            <header className="mb-6 space-y-4 border-b-4 border-foreground pb-6">
              <div className={adminEyebrowClass}>
                <IconUsers className="size-4 text-primary" stroke={2.5} />
                Panel de administración
              </div>
              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
                  {segmentMetadata.users.title}
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                  {segmentMetadata.users.description}
                </p>
              </div>
            </header>
            <AdminUsersDashboard />
          </>
        )}

        {section === "sales" && (
          <>
            <header className="mb-6 space-y-4 border-b-4 border-foreground pb-6">
              <div className={adminEyebrowClass}>
                <IconReceipt className="size-4 text-primary" stroke={2.5} />
                Panel de administración
              </div>
              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
                  {segmentMetadata.sales.title}
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                  {segmentMetadata.sales.description}
                </p>
              </div>
            </header>
            <AdminSalesDashboard />
          </>
        )}

        {section === "cohorts" && (
          <>
            <header className="mb-6 space-y-4 border-b-4 border-foreground pb-6">
              <div className={adminEyebrowClass}>
                <IconUsersGroup className="size-4 text-primary" stroke={2.5} />
                Panel de administración
              </div>
              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
                  {segmentMetadata.cohorts.title}
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                  {segmentMetadata.cohorts.description}
                </p>
              </div>
            </header>
            <AdminCohortsDashboard />
          </>
        )}

        {section === "metrics" && (
          <>
            <header className="mb-6 space-y-4 border-b-4 border-foreground pb-6">
              <div className={adminEyebrowClass}>
                <IconChartBar className="size-4 text-primary" stroke={2.5} />
                Panel de administración
              </div>
              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
                  {segmentMetadata.metrics.title}
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                  {segmentMetadata.metrics.description}
                </p>
              </div>
            </header>
            <AdminMetricsDashboard />
          </>
        )}
      </div>
    </AdminDashboardContainer>
  );
}

