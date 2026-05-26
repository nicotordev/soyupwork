import {
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/dashboard-styles";
import { cn } from "@/lib/utils";
import type { AdminSettingsIntegrationStatus } from "@/types/admin-settings.types";
import {
  IconAlertCircle,
  IconCheck,
  IconPlugConnected,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";

type SettingsIntegrationsPanelProps = {
  integrations: AdminSettingsIntegrationStatus[];
};

export function SettingsIntegrationsPanel({
  integrations,
}: SettingsIntegrationsPanelProps) {
  const configuredCount = integrations.filter(
    (integration) => integration.configured,
  ).length;

  return (
    <section
      className={adminPanelClass}
      aria-labelledby="settings-integrations-title"
    >
      <div className={adminPanelHeaderClass}>
        <div className="flex items-center gap-2">
          <IconPlugConnected className="size-4 text-primary" stroke={2.5} />
          <div>
            <h2
              id="settings-integrations-title"
              className={adminPanelTitleClass}
            >
              Integraciones
            </h2>
            <p className="text-xs text-muted-foreground">
              {configuredCount} de {integrations.length} servicios con variables
              de entorno configuradas
            </p>
          </div>
        </div>
      </div>
      <ul className="divide-y-2 divide-foreground">
        {integrations.map((integration) => (
          <li
            key={integration.id}
            className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <p className="font-mono text-xs font-bold uppercase tracking-wider">
                {integration.label}
              </p>
              <p className="text-sm text-muted-foreground">
                {integration.description}
              </p>
            </div>
            <Badge
              variant={integration.configured ? "default" : "secondary"}
              className={cn(
                "shrink-0 gap-1.5 rounded border-2 border-foreground px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0px_0px_var(--foreground)]",
                !integration.configured && "bg-secondary text-foreground",
              )}
            >
              {integration.configured ? (
                <IconCheck stroke={2.5} />
              ) : (
                <IconAlertCircle stroke={2.5} />
              )}
              {integration.configured ? "Configurado" : "Pendiente"}
            </Badge>
          </li>
        ))}
      </ul>
      <p className="border-t-2 border-foreground px-4 py-3 font-mono text-[10px] font-bold uppercase text-muted-foreground">
        Las claves sensibles se gestionan en variables de entorno del servidor,
        no desde este panel.
      </p>
    </section>
  );
}
