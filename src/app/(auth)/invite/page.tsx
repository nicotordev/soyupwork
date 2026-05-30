import { PlatformStatusPage } from "@/components/platform/platform-status-page";
import { WaitlistInviteAccept } from "@/components/platform/waitlist-invite-accept";
import { redirectIfAuthenticatedFromGuestAuthPage } from "@/lib/auth/guest-auth-pages";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import { IconTicket } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aceptar invitación | SoyUpwork",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function InvitePage({ searchParams }: PageProps) {
  await redirectIfAuthenticatedFromGuestAuthPage();

  const resolved = await searchParams;
  const rawToken = resolved.token;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  const settings = await getPlatformSettings();

  return (
    <PlatformStatusPage
      eyebrow={settings.siteName}
      title="Invitación de acceso"
      description="Estamos validando tu enlace personal para que puedas crear tu cuenta."
      icon={<IconTicket className="size-6 text-primary" stroke={2.5} />}
    >
      <WaitlistInviteAccept token={token ?? null} />
    </PlatformStatusPage>
  );
}
