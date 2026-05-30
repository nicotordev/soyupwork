import { ADMIN_SETTINGS_INTEGRATIONS } from "@/constants/settings.constants";
import type { AdminSettingsIntegrationStatus } from "@/types/admin-settings.types";

function isConfigured(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

export function getAdminSettingsIntegrations(): AdminSettingsIntegrationStatus[] {
  const configuredById = {
    auth:
      isConfigured(process.env.AUTH_SECRET) &&
      (isConfigured(process.env.AUTH_GOOGLE_ID) ||
        isConfigured(process.env.AUTH_GITHUB_ID) ||
        isConfigured(process.env.AUTH_RESEND_KEY) ||
        isConfigured(process.env.RESEND_API_KEY)),
    stripe: isConfigured(process.env.STRIPE_SECRET_KEY),
    resend: isConfigured(process.env.RESEND_API_KEY),
    r2:
      isConfigured(process.env.R2_BUCKET) &&
      isConfigured(process.env.R2_ACCESS_KEY_ID) &&
      isConfigured(process.env.R2_SECRET_ACCESS_KEY),
    mux:
      isConfigured(process.env.MUX_TOKEN_ID) &&
      isConfigured(process.env.MUX_TOKEN_SECRET),
    inngest:
      isConfigured(process.env.INNGEST_EVENT_KEY) &&
      isConfigured(process.env.INNGEST_SIGNING_KEY),
  } as const;

  return ADMIN_SETTINGS_INTEGRATIONS.map((integration) => ({
    ...integration,
    configured: configuredById[integration.id],
  }));
}
