import { getGeneralSettingsFormValues } from "@/app/actions/settings.actions";
import { AdminSettingsSubPage } from "@/components/admin/settings/admin-settings-sub-page";
import { GeneralSettingsForm } from "@/components/admin/settings/general-settings-form";
import { ADMIN_SETTINGS_GENERAL_PAGE } from "@/constants/settings.constants";
import { IconWorld } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración general",
  description: "Ajustes de marca, mantenimiento, waitlist y anuncios.",
};

export default async function AdminGeneralSettingsPage() {
  const initialValues = await getGeneralSettingsFormValues();

  return (
    <AdminSettingsSubPage
      eyebrow={ADMIN_SETTINGS_GENERAL_PAGE.eyebrow}
      title={ADMIN_SETTINGS_GENERAL_PAGE.title}
      description={ADMIN_SETTINGS_GENERAL_PAGE.description}
      icon={<IconWorld className="size-4 text-primary" stroke={2.5} />}
    >
      <GeneralSettingsForm initialValues={initialValues} />
    </AdminSettingsSubPage>
  );
}
