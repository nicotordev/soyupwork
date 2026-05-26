import type { ADMIN_SETTINGS_INTEGRATIONS } from "@/constants/settings.constants";

export type AdminSettingsIntegrationId =
  (typeof ADMIN_SETTINGS_INTEGRATIONS)[number]["id"];

export type AdminSettingsIntegrationStatus = {
  id: AdminSettingsIntegrationId;
  label: string;
  description: string;
  configured: boolean;
};
