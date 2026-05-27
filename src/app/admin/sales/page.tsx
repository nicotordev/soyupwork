import { getAdminSalesPageData } from "@/app/actions/sales.actions";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { AdminSalesDashboard } from "@/components/admin/orders/admin-sales-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ventas y Cobros | Admin | SoyUpwork",
  description: "Seguimiento de pedidos, suscripciones e integraciones.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminSalesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getAdminSalesPageData(resolvedSearchParams);

  return (
    <AdminDashboardContainer>
      <AdminSalesDashboard data={data} />
    </AdminDashboardContainer>
  );
}
