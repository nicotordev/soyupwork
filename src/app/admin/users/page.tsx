import { getAdminUsersPageData } from "@/app/actions/users.actions";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { UsersOverview } from "@/components/admin/users/users-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estudiantes y Permisos | Admin | SoyUpwork",
  description: "Gestión de alumnos, roles y permisos de acceso.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getAdminUsersPageData(resolvedSearchParams);

  return (
    <AdminDashboardContainer>
      <UsersOverview data={data} />
    </AdminDashboardContainer>
  );
}
