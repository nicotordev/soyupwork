import { getNotificationsSettingsFormValues } from "@/app/actions/settings.actions";
import { AdminSettingsSubPage } from "@/components/admin/settings/admin-settings-sub-page";
import { NotificationsSettingsForm } from "@/components/admin/settings/notifications-settings-form";
import { ADMIN_SETTINGS_NOTIFICATIONS_PAGE } from "@/constants/settings.constants";
import { IconBell } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notificaciones",
  description: "Alertas, rate limiting y observabilidad.",
};

export default async function AdminNotificationsSettingsPage() {
  const initialValues = await getNotificationsSettingsFormValues();

  return (
    <AdminSettingsSubPage
      eyebrow={ADMIN_SETTINGS_NOTIFICATIONS_PAGE.eyebrow}
      title={ADMIN_SETTINGS_NOTIFICATIONS_PAGE.title}
      description={ADMIN_SETTINGS_NOTIFICATIONS_PAGE.description}
      icon={<IconBell className="size-4 text-primary" stroke={2.5} />}
    >
      <NotificationsSettingsForm initialValues={initialValues} />
    </AdminSettingsSubPage>
  );
}
