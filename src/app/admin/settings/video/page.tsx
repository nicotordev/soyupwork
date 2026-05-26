import { getVideoSettingsFormValues } from "@/app/actions/settings.actions";
import { AdminSettingsSubPage } from "@/components/admin/settings/admin-settings-sub-page";
import { VideoSettingsForm } from "@/components/admin/settings/video-settings-form";
import { ADMIN_SETTINGS_VIDEO_PAGE } from "@/constants/settings.constants";
import { IconMovie } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video",
  description: "Streaming y calidad de lecciones con Mux.",
};

export default async function AdminVideoSettingsPage() {
  const initialValues = await getVideoSettingsFormValues();

  return (
    <AdminSettingsSubPage
      eyebrow={ADMIN_SETTINGS_VIDEO_PAGE.eyebrow}
      title={ADMIN_SETTINGS_VIDEO_PAGE.title}
      description={ADMIN_SETTINGS_VIDEO_PAGE.description}
      icon={<IconMovie className="size-4 text-primary" stroke={2.5} />}
    >
      <VideoSettingsForm initialValues={initialValues} />
    </AdminSettingsSubPage>
  );
}
