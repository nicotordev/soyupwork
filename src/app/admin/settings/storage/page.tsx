import { getStorageSettingsFormValues } from "@/app/actions/settings.actions";
import { AdminSettingsSubPage } from "@/components/admin/settings/admin-settings-sub-page";
import { StorageSettingsForm } from "@/components/admin/settings/storage-settings-form";
import { ADMIN_SETTINGS_STORAGE_PAGE } from "@/constants/settings.constants";
import { IconCloud } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Almacenamiento",
  description: "Límites de subida y URL pública de R2.",
};

export default async function AdminStorageSettingsPage() {
  const initialValues = await getStorageSettingsFormValues();

  return (
    <AdminSettingsSubPage
      eyebrow={ADMIN_SETTINGS_STORAGE_PAGE.eyebrow}
      title={ADMIN_SETTINGS_STORAGE_PAGE.title}
      description={ADMIN_SETTINGS_STORAGE_PAGE.description}
      icon={<IconCloud className="size-4 text-primary" stroke={2.5} />}
    >
      <StorageSettingsForm initialValues={initialValues} />
    </AdminSettingsSubPage>
  );
}
