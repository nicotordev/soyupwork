import { getAuthSettingsFormValues } from "@/app/actions/settings.actions";
import { AdminSettingsSubPage } from "@/components/admin/settings/admin-settings-sub-page";
import { AuthSettingsForm } from "@/components/admin/settings/auth-settings-form";
import { ADMIN_SETTINGS_AUTH_PAGE } from "@/constants/settings.constants";
import { IconShield } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autenticación",
  description: "Ajustes de registro, OAuth y redirecciones con Auth.js.",
};

export default async function AdminAuthSettingsPage() {
  const initialValues = await getAuthSettingsFormValues();

  return (
    <AdminSettingsSubPage
      eyebrow={ADMIN_SETTINGS_AUTH_PAGE.eyebrow}
      title={ADMIN_SETTINGS_AUTH_PAGE.title}
      description={ADMIN_SETTINGS_AUTH_PAGE.description}
      icon={<IconShield className="size-4 text-primary" stroke={2.5} />}
    >
      <AuthSettingsForm initialValues={initialValues} />
    </AdminSettingsSubPage>
  );
}
