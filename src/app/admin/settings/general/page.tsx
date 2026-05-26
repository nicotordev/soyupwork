import { getGeneralSettingsFormValues } from "@/app/actions/settings.actions";
import { GeneralSettingsForm } from "@/components/admin/settings/general-settings-form";
import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { ADMIN_SETTINGS_GENERAL_PAGE } from "@/constants/settings.constants";
import { IconWorld } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Configuración general",
  description: "Ajustes de marca, mantenimiento, waitlist y acceso público.",
};

export default async function AdminGeneralSettingsPage() {
  const initialValues = await getGeneralSettingsFormValues();

  return (
    <AdminDashboardContainer>
      <div className="space-y-8">
        <AdminDashboardPageHeader
          eyebrow={ADMIN_SETTINGS_GENERAL_PAGE.eyebrow}
          icon={<IconWorld className="size-4 text-primary" stroke={2.5} />}
          title={ADMIN_SETTINGS_GENERAL_PAGE.title}
          description={ADMIN_SETTINGS_GENERAL_PAGE.description}
          actions={
            <Button asChild variant="outline">
              <Link href="/admin/settings">Volver</Link>
            </Button>
          }
        />
        <GeneralSettingsForm initialValues={initialValues} />
      </div>
    </AdminDashboardContainer>
  );
}
