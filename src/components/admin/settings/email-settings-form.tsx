"use client";

import { updateEmailSettings } from "@/app/actions/settings.actions";
import { SettingsFormActions } from "@/components/admin/settings/settings-form-actions";
import { SettingsPanel } from "@/components/admin/settings/settings-panel";
import { SettingsToggleRow } from "@/components/admin/settings/settings-toggle-row";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminInputClass } from "@/lib/admin/dashboard-styles";
import type { EmailSettingsFormValues } from "@/types/platform-settings.types";
import { IconMail, IconSend } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type EmailSettingsFormProps = {
  initialValues: EmailSettingsFormValues;
};

export function EmailSettingsForm({ initialValues }: EmailSettingsFormProps) {
  const [values, setValues] = useState(initialValues);
  const [isPending, startTransition] = useTransition();

  const updateBoolean = (
    key: keyof EmailSettingsFormValues,
    checked: boolean,
  ) => {
    setValues((current) => ({ ...current, [key]: checked }));
  };

  const updateText = (key: keyof EmailSettingsFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateEmailSettings(values);
      if (result.ok) toast.success("Configuración guardada");
      else toast.error(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SettingsPanel
        icon={<IconMail className="size-4 text-primary" stroke={2.5} />}
        title="Remitentes"
        description="Sobrescribe EMAIL_FROM y EMAIL_SUPPORT del entorno"
      >
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="emailFrom">Remitente (From)</Label>
            <Input
              id="emailFrom"
              value={values.emailFrom}
              onChange={(e) => updateText("emailFrom", e.target.value)}
              className={adminInputClass}
              placeholder="SoyUpwork <noreply@soyup.work>"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="emailSupport">Correo de soporte (Reply-To)</Label>
            <Input
              id="emailSupport"
              type="email"
              value={values.emailSupport}
              onChange={(e) => updateText("emailSupport", e.target.value)}
              className={adminInputClass}
              placeholder="hola@soyup.work"
            />
          </div>
        </div>
      </SettingsPanel>

      <SettingsPanel
        icon={<IconSend className="size-4 text-primary" stroke={2.5} />}
        title="Envíos automáticos"
        description="Correos transaccionales vía Resend"
      >
        <div className="space-y-4 p-4">
          <SettingsToggleRow
            id="sendPurchaseConfirmation"
            title="Confirmación de compra"
            description="Envía acceso al curso tras un pago exitoso"
            checked={values.sendPurchaseConfirmation}
            onCheckedChange={(checked) =>
              updateBoolean("sendPurchaseConfirmation", checked)
            }
          />
          <SettingsToggleRow
            id="sendEnrollmentEmail"
            title="Confirmación de inscripción"
            description="Avisa cuando un estudiante se inscribe gratis"
            checked={values.sendEnrollmentEmail}
            onCheckedChange={(checked) =>
              updateBoolean("sendEnrollmentEmail", checked)
            }
          />
        </div>
      </SettingsPanel>

      <SettingsFormActions isPending={isPending} />
    </form>
  );
}
