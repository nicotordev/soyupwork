import { getAdminWaitlistPageData } from "@/app/actions/waitlist-invite.actions";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { WaitlistOverview } from "@/components/admin/waitlist/waitlist-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lista de espera | Admin | SoyUpwork",
  description: "Gestión de la lista de espera e invitaciones de acceso.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminWaitlistPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getAdminWaitlistPageData(resolvedSearchParams);

  return (
    <AdminDashboardContainer>
      <WaitlistOverview data={data} />
    </AdminDashboardContainer>
  );
}
