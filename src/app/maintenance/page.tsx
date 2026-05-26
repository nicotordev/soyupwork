import { PlatformStatusPage } from "@/components/platform/platform-status-page";
import { getPlatformSettings } from "@/lib/platform-settings/get-platform-settings";
import { IconTool } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mantenimiento | SoyUpwork",
  robots: { index: false, follow: false },
};

export default async function MaintenancePage() {
  const settings = await getPlatformSettings();

  return (
    <PlatformStatusPage
      eyebrow={settings.siteName}
      title="Estamos en mantenimiento"
      description={
        settings.maintenanceMessage ??
        "Volvemos en breve. Gracias por tu paciencia."
      }
      icon={<IconTool className="size-6 text-primary" stroke={2.5} />}
    >
      <Button asChild variant="outline" className="border-2 border-foreground">
        <Link href="/admin">Panel de administración</Link>
      </Button>
    </PlatformStatusPage>
  );
}
