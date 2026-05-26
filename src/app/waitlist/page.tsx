import { PlatformStatusPage } from "@/components/platform/platform-status-page";
import { WaitlistSignupForm } from "@/components/platform/waitlist-signup-form";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import { IconUsersGroup } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lista de espera | SoyUpwork",
  robots: { index: false, follow: false },
};

export default async function WaitlistPage() {
  const settings = await getPlatformSettings();

  return (
    <PlatformStatusPage
      eyebrow={settings.siteName}
      title="Próximo lanzamiento"
      description={
        settings.waitlistMessage ??
        "Déjanos tu correo y te avisamos cuando abramos."
      }
      icon={<IconUsersGroup className="size-6 text-primary" stroke={2.5} />}
    >
      <WaitlistSignupForm />
    </PlatformStatusPage>
  );
}
