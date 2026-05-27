import { getAdminSalesPageData } from "@/app/actions/sales.actions";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { AdminSalesDashboard } from "@/components/admin/orders/admin-sales-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ventas y Cobros | Admin | SoyUpwork",
  description: "Seguimiento de pedidos, suscripciones e integraciones.",
};

export default async function AdminSalesPage() {
  const data = await getAdminSalesPageData();

  return (
    <AdminDashboardContainer>
      <AdminSalesDashboard data={data} />
    </AdminDashboardContainer>
  );
}
