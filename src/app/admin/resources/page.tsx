import { getAdminResourcesPageData } from "@/app/actions/resources.actions";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { ResourcesOverview } from "@/components/admin/resources/resources-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recursos",
  description: "Gestiona guías y plantillas del catálogo público de SoyUpwork.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminResourcesPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const data = await getAdminResourcesPageData(resolved);

  return (
    <AdminDashboardContainer>
      <ResourcesOverview data={data} />
    </AdminDashboardContainer>
  );
}
