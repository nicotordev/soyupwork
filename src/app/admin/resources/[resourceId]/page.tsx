import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { ResourceEditForm } from "@/components/admin/resources/resource-edit-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar recurso",
};

type PageProps = {
  params: Promise<{ resourceId: string }>;
};

export default async function AdminResourceEditPage({ params }: PageProps) {
  const { resourceId } = await params;

  return (
    <AdminDashboardContainer>
      <ResourceEditForm resourceId={resourceId} />
    </AdminDashboardContainer>
  );
}
