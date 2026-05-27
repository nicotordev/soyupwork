import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { AdminSalesDashboard } from "@/components/admin/orders/admin-sales-dashboard";
import { adminEyebrowClass } from "@/lib/admin/styles";
import { IconReceipt } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ventas y Cobros | Admin | SoyUpwork",
  description: "Seguimiento de pedidos, suscripciones e integraciones.",
};

export default async function AdminSalesPage() {
  return (
    <AdminDashboardContainer>
      <div className="space-y-6">
        <header className="mb-6 space-y-4 border-b-4 border-foreground pb-6">
          <div className={adminEyebrowClass}>
            <IconReceipt className="size-4 text-primary" stroke={2.5} />
            Panel de administración
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
              Ventas y Cobros
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Seguimiento de pedidos, suscripciones e integraciones.
            </p>
          </div>
        </header>
        <AdminSalesDashboard />
      </div>
    </AdminDashboardContainer>
  );
}
