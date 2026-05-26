import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { SettingsOverview } from "@/components/admin/settings/settings-overview";
import { getAdminSettingsIntegrations } from "@/lib/admin/settings-integrations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración",
  description:
    "Integraciones, preferencias y ajustes operativos de la plataforma SoyUpwork.",
};

export default function AdminSettingsPage() {
  const integrations = getAdminSettingsIntegrations();

  return (
    <AdminDashboardContainer>
      <SettingsOverview integrations={integrations} />
    </AdminDashboardContainer>
  );
}
