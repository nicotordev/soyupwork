"use client";

import { updateAuthSettings } from "@/app/actions/settings.actions";
import { SettingsFormActions } from "@/components/admin/settings/settings-form-actions";
import { SettingsPanel } from "@/components/admin/settings/settings-panel";
import { SettingsToggleRow } from "@/components/admin/settings/settings-toggle-row";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminInputClass } from "@/lib/admin/styles";
import type { AuthSettingsFormValues } from "@/types/platform-settings.types";
import { IconRoute, IconShield } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type AuthSettingsFormProps = {
  initialValues: AuthSettingsFormValues;
};

export function AuthSettingsForm({ initialValues }: AuthSettingsFormProps) {
  const [values, setValues] = useState(initialValues);
  const [isPending, startTransition] = useTransition();

  const updateBoolean = (
    key: keyof AuthSettingsFormValues,
    checked: boolean,
  ) => {
    setValues((current) => ({ ...current, [key]: checked }));
  };

  const updateText = (key: keyof AuthSettingsFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateAuthSettings(values);
      if (result.ok) toast.success("Configuración guardada");
      else toast.error(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SettingsPanel
        icon={<IconShield className="size-4 text-primary" stroke={2.5} />}
        title="Acceso y registro"
        description="Control de sign-up y verificación con Clerk"
      >
        <div className="space-y-4 p-4">
          <SettingsToggleRow
            id="registrationsOpen"
            title="Registros abiertos"
            description="Permite nuevos registros en /sign-up"
            checked={values.registrationsOpen}
            onCheckedChange={(checked) =>
              updateBoolean("registrationsOpen", checked)
            }
          />
          <SettingsToggleRow
            id="requireVerifiedEmail"
            title="Requerir email verificado"
            description="Bloquea el acceso hasta confirmar el correo"
            checked={values.requireVerifiedEmail}
            onCheckedChange={(checked) =>
              updateBoolean("requireVerifiedEmail", checked)
            }
          />
          <SettingsToggleRow
            id="allowOAuthSignIn"
            title="Permitir OAuth"
            description="Google, GitHub y otros proveedores sociales"
            checked={values.allowOAuthSignIn}
            onCheckedChange={(checked) =>
              updateBoolean("allowOAuthSignIn", checked)
            }
          />
        </div>
      </SettingsPanel>

      <SettingsPanel
        icon={<IconRoute className="size-4 text-primary" stroke={2.5} />}
        title="Redirecciones post-auth"
        description="Rutas internas después de iniciar sesión o registrarse"
      >
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="afterSignInUrl">Después de sign-in</Label>
            <Input
              id="afterSignInUrl"
              value={values.afterSignInUrl}
              onChange={(e) => updateText("afterSignInUrl", e.target.value)}
              className={adminInputClass}
              placeholder="/dashboard"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="afterSignUpUrl">Después de sign-up</Label>
            <Input
              id="afterSignUpUrl"
              value={values.afterSignUpUrl}
              onChange={(e) => updateText("afterSignUpUrl", e.target.value)}
              className={adminInputClass}
              placeholder="/onboarding"
            />
          </div>
        </div>
      </SettingsPanel>

      <SettingsFormActions isPending={isPending} />
    </form>
  );
}
