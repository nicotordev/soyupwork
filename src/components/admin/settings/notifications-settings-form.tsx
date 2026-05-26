"use client";

import { updateNotificationsSettings } from "@/app/actions/settings.actions";
import { SettingsFormActions } from "@/components/admin/settings/settings-form-actions";
import { SettingsPanel } from "@/components/admin/settings/settings-panel";
import { SettingsToggleRow } from "@/components/admin/settings/settings-toggle-row";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminInputClass } from "@/lib/admin/dashboard-styles";
import type { NotificationsSettingsFormValues } from "@/types/platform-settings.types";
import { IconBell, IconChartBar, IconShieldLock } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type NotificationsSettingsFormProps = {
  initialValues: NotificationsSettingsFormValues;
};

const logLevels = ["trace", "debug", "info", "warn", "error", "fatal"] as const;

export function NotificationsSettingsForm({
  initialValues,
}: NotificationsSettingsFormProps) {
  const [values, setValues] = useState(initialValues);
  const [isPending, startTransition] = useTransition();

  const updateBoolean = (
    key: keyof NotificationsSettingsFormValues,
    checked: boolean,
  ) => {
    setValues((current) => ({ ...current, [key]: checked }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateNotificationsSettings({
        ...values,
        rateLimitMaxRequests: Number(values.rateLimitMaxRequests),
        rateLimitWindowMs: Number(values.rateLimitWindowMs),
        analyticsRetentionDays: Number(values.analyticsRetentionDays),
      });
      if (result.ok) toast.success("Configuración guardada");
      else toast.error(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SettingsPanel
        icon={<IconBell className="size-4 text-primary" stroke={2.5} />}
        title="Alertas y avisos"
        description="Notificaciones a admins y estudiantes"
      >
        <div className="space-y-4 p-4">
          <SettingsToggleRow
            id="enableInAppNotifications"
            title="Notificaciones in-app"
            description="Campana y feed en el panel admin"
            checked={values.enableInAppNotifications}
            onCheckedChange={(checked) =>
              updateBoolean("enableInAppNotifications", checked)
            }
          />
          <SettingsToggleRow
            id="notifyAdminOnPurchase"
            title="Admin: nueva compra"
            description="Alerta cuando se confirma un pago"
            checked={values.notifyAdminOnPurchase}
            onCheckedChange={(checked) =>
              updateBoolean("notifyAdminOnPurchase", checked)
            }
          />
          <SettingsToggleRow
            id="notifyAdminOnRefund"
            title="Admin: reembolso"
            description="Alerta cuando se procesa un refund"
            checked={values.notifyAdminOnRefund}
            onCheckedChange={(checked) =>
              updateBoolean("notifyAdminOnRefund", checked)
            }
          />
          <SettingsToggleRow
            id="notifyStudentOnEnrollment"
            title="Estudiante: inscripción"
            description="Correo al inscribirse en un curso"
            checked={values.notifyStudentOnEnrollment}
            onCheckedChange={(checked) =>
              updateBoolean("notifyStudentOnEnrollment", checked)
            }
          />
          <SettingsToggleRow
            id="notifyStudentOnCertificate"
            title="Estudiante: certificado"
            description="Aviso al emitir un certificado"
            checked={values.notifyStudentOnCertificate}
            onCheckedChange={(checked) =>
              updateBoolean("notifyStudentOnCertificate", checked)
            }
          />
        </div>
      </SettingsPanel>

      <SettingsPanel
        icon={<IconShieldLock className="size-4 text-primary" stroke={2.5} />}
        title="Rate limiting"
        description="Límites globales de solicitudes por IP"
      >
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rateLimitMaxRequests">Máx. solicitudes</Label>
            <Input
              id="rateLimitMaxRequests"
              type="number"
              min={10}
              value={values.rateLimitMaxRequests}
              onChange={(e) =>
                setValues((current) => ({
                  ...current,
                  rateLimitMaxRequests: Number(e.target.value),
                }))
              }
              className={adminInputClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rateLimitWindowMs">Ventana (ms)</Label>
            <Input
              id="rateLimitWindowMs"
              type="number"
              min={1000}
              value={values.rateLimitWindowMs}
              onChange={(e) =>
                setValues((current) => ({
                  ...current,
                  rateLimitWindowMs: Number(e.target.value),
                }))
              }
              className={adminInputClass}
            />
          </div>
        </div>
      </SettingsPanel>

      <SettingsPanel
        icon={<IconChartBar className="size-4 text-primary" stroke={2.5} />}
        title="Observabilidad"
        description="Logs y retención de analytics"
      >
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="logLevel">Nivel de log</Label>
            <Select
              value={values.logLevel}
              onValueChange={(value) =>
                setValues((current) => ({
                  ...current,
                  logLevel:
                    value as NotificationsSettingsFormValues["logLevel"],
                }))
              }
            >
              <SelectTrigger id="logLevel" className={adminInputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {logLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="analyticsRetentionDays">
              Retención analytics (días)
            </Label>
            <Input
              id="analyticsRetentionDays"
              type="number"
              min={7}
              value={values.analyticsRetentionDays}
              onChange={(e) =>
                setValues((current) => ({
                  ...current,
                  analyticsRetentionDays: Number(e.target.value),
                }))
              }
              className={adminInputClass}
            />
          </div>
        </div>
      </SettingsPanel>

      <SettingsFormActions isPending={isPending} />
    </form>
  );
}
