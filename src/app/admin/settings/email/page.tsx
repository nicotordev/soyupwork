import { getEmailSettingsFormValues } from "@/app/actions/settings.actions";
import { AdminSettingsSubPage } from "@/components/admin/settings/admin-settings-sub-page";
import { EmailSettingsForm } from "@/components/admin/settings/email-settings-form";
import { ADMIN_SETTINGS_EMAIL_PAGE } from "@/constants/settings.constants";
import { IconMail } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Correo transaccional",
  description: "Remitentes y envíos automáticos con Resend.",
};

export default async function AdminEmailSettingsPage() {
  const initialValues = await getEmailSettingsFormValues();

  return (
    <AdminSettingsSubPage
      eyebrow={ADMIN_SETTINGS_EMAIL_PAGE.eyebrow}
      title={ADMIN_SETTINGS_EMAIL_PAGE.title}
      description={ADMIN_SETTINGS_EMAIL_PAGE.description}
      icon={<IconMail className="size-4 text-primary" stroke={2.5} />}
    >
      <EmailSettingsForm initialValues={initialValues} />
    </AdminSettingsSubPage>
  );
}
