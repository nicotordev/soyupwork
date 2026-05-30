import { DashboardContainer } from "@/components/dashboard/dashboard-container";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { UserProfileSettingsForm } from "@/components/dashboard/user-profile-settings-form";
import { ConnectedAccountsPanel } from "@/components/dashboard/connected-accounts-panel";
import { getConnectedOAuthAccounts } from "@/lib/auth/link-account";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import { auth } from "@/auth";
import { IconSettings } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi perfil",
  description: "Edita tu perfil de estudiante en SoyUpwork.",
};

export default async function StudentProfilePage() {
  const session = await auth();
  const connected =
    session?.user?.id != null
      ? await getConnectedOAuthAccounts(session.user.id)
      : { google: false, github: false };
  const settings = await getPlatformSettings();

  return (
    <DashboardContainer>
      <DashboardPageHeader
        eyebrow="Configuración"
        icon={<IconSettings className="size-4" stroke={2.5} />}
        title="Mi perfil"
        description="Actualiza tu nombre, biografía y foto de perfil para la comunidad."
      />
      <div className="space-y-8">
        <UserProfileSettingsForm variant="page" />
        <ConnectedAccountsPanel
          connected={connected}
          allowOAuthSignIn={settings.allowOAuthSignIn}
          callbackUrl="/dashboard/profile"
        />
      </div>
    </DashboardContainer>
  );
}
