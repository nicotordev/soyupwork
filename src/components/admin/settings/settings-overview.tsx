import { SettingsIntegrationsPanel } from "@/components/admin/settings/settings-integrations-panel";
import { SettingsSectionsGrid } from "@/components/admin/settings/settings-sections-grid";
import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { ADMIN_SETTINGS_PAGE } from "@/constants/settings.constants";
import type { AdminSettingsIntegrationStatus } from "@/types/admin-settings.types";
import { IconSettings } from "@tabler/icons-react";

type SettingsOverviewProps = {
  integrations: AdminSettingsIntegrationStatus[];
};

export function SettingsOverview({ integrations }: SettingsOverviewProps) {
  return (
    <div className="space-y-8">
      <AdminDashboardPageHeader
        eyebrow={ADMIN_SETTINGS_PAGE.eyebrow}
        icon={<IconSettings className="size-4 text-primary" stroke={2.5} />}
        title={ADMIN_SETTINGS_PAGE.title}
        description={ADMIN_SETTINGS_PAGE.description}
      />
      <SettingsIntegrationsPanel integrations={integrations} />
      <SettingsSectionsGrid />
    </div>
  );
}
