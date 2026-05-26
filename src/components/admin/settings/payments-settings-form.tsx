"use client";

import { updatePaymentsSettings } from "@/app/actions/settings.actions";
import { SettingsFormActions } from "@/components/admin/settings/settings-form-actions";
import { SettingsPanel } from "@/components/admin/settings/settings-panel";
import { SettingsToggleRow } from "@/components/admin/settings/settings-toggle-row";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminInputClass } from "@/lib/admin/dashboard-styles";
import type { PaymentsSettingsFormValues } from "@/types/platform-settings.types";
import { IconBrandStripe, IconReceipt } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type PaymentsSettingsFormProps = {
  initialValues: PaymentsSettingsFormValues;
};

export function PaymentsSettingsForm({
  initialValues,
}: PaymentsSettingsFormProps) {
  const [values, setValues] = useState(initialValues);
  const [isPending, startTransition] = useTransition();

  const updateBoolean = (
    key: keyof PaymentsSettingsFormValues,
    checked: boolean,
  ) => {
    setValues((current) => ({ ...current, [key]: checked }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await updatePaymentsSettings({
        ...values,
        refundPolicyDays: Number(values.refundPolicyDays),
      });
      if (result.ok) toast.success("Configuración guardada");
      else toast.error(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SettingsPanel
        icon={<IconBrandStripe className="size-4 text-primary" stroke={2.5} />}
        title="Checkout Stripe"
        description="Preferencias de cobro (las claves API siguen en env)"
      >
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="stripeCurrency">Moneda (ISO 4217)</Label>
            <Input
              id="stripeCurrency"
              value={values.stripeCurrency}
              onChange={(e) =>
                setValues((current) => ({
                  ...current,
                  stripeCurrency: e.target.value.toLowerCase(),
                }))
              }
              className={adminInputClass}
              placeholder="usd"
              maxLength={3}
            />
          </div>
          <SettingsToggleRow
            id="enableStripeCheckout"
            title="Checkout habilitado"
            description="Permite compras con Stripe Checkout"
            checked={values.enableStripeCheckout}
            onCheckedChange={(checked) =>
              updateBoolean("enableStripeCheckout", checked)
            }
          />
          <SettingsToggleRow
            id="showTaxBreakdown"
            title="Mostrar desglose de impuestos"
            description="Incluye impuestos en el resumen del checkout"
            checked={values.showTaxBreakdown}
            onCheckedChange={(checked) =>
              updateBoolean("showTaxBreakdown", checked)
            }
          />
        </div>
      </SettingsPanel>

      <SettingsPanel
        icon={<IconReceipt className="size-4 text-primary" stroke={2.5} />}
        title="Política de reembolsos"
        description="Ventana para solicitar devoluciones"
      >
        <div className="space-y-2 p-4">
          <Label htmlFor="refundPolicyDays">Días de reembolso</Label>
          <Input
            id="refundPolicyDays"
            type="number"
            min={0}
            max={90}
            value={values.refundPolicyDays}
            onChange={(e) =>
              setValues((current) => ({
                ...current,
                refundPolicyDays: Number(e.target.value),
              }))
            }
            className={adminInputClass}
          />
        </div>
      </SettingsPanel>

      <SettingsFormActions isPending={isPending} />
    </form>
  );
}
