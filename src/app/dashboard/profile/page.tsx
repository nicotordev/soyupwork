import { DashboardContainer } from "@/components/dashboard/dashboard-container";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { UserProfileSettingsForm } from "@/components/dashboard/user-profile-settings-form";
import { IconSettings } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi perfil",
  description: "Edita tu perfil de estudiante en SoyUpwork.",
};

export default function StudentProfilePage() {
  return (
    <DashboardContainer>
      <DashboardPageHeader
        eyebrow="Configuración"
        icon={<IconSettings className="size-4" stroke={2.5} />}
        title="Mi perfil"
        description="Actualiza tu nombre, biografía y foto de perfil para la comunidad."
      />
      <UserProfileSettingsForm variant="page" />
    </DashboardContainer>
  );
}
