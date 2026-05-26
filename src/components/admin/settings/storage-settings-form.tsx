"use client";

import { updateStorageSettings } from "@/app/actions/settings.actions";
import { SettingsFormActions } from "@/components/admin/settings/settings-form-actions";
import { SettingsPanel } from "@/components/admin/settings/settings-panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminInputClass } from "@/lib/admin/dashboard-styles";
import type { StorageSettingsFormValues } from "@/types/platform-settings.types";
import { IconCloud, IconUpload } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type StorageSettingsFormProps = {
  initialValues: StorageSettingsFormValues;
};

export function StorageSettingsForm({
  initialValues,
}: StorageSettingsFormProps) {
  const [values, setValues] = useState(initialValues);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateStorageSettings({
        ...values,
        maxFileSizeMb: Number(values.maxFileSizeMb),
        maxVideoSizeMb: Number(values.maxVideoSizeMb),
      });
      if (result.ok) toast.success("Configuración guardada");
      else toast.error(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SettingsPanel
        icon={<IconUpload className="size-4 text-primary" stroke={2.5} />}
        title="Límites de subida"
        description="Tamaños máximos para archivos y videos"
      >
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxFileSizeMb">Archivos (MB)</Label>
            <Input
              id="maxFileSizeMb"
              type="number"
              min={1}
              value={values.maxFileSizeMb}
              onChange={(e) =>
                setValues((current) => ({
                  ...current,
                  maxFileSizeMb: Number(e.target.value),
                }))
              }
              className={adminInputClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxVideoSizeMb">Videos (MB)</Label>
            <Input
              id="maxVideoSizeMb"
              type="number"
              min={1}
              value={values.maxVideoSizeMb}
              onChange={(e) =>
                setValues((current) => ({
                  ...current,
                  maxVideoSizeMb: Number(e.target.value),
                }))
              }
              className={adminInputClass}
            />
          </div>
        </div>
      </SettingsPanel>

      <SettingsPanel
        icon={<IconCloud className="size-4 text-primary" stroke={2.5} />}
        title="Cloudflare R2"
        description="URL pública de assets (credenciales en env)"
      >
        <div className="space-y-2 p-4">
          <Label htmlFor="storagePublicUrl">URL pública del bucket</Label>
          <Input
            id="storagePublicUrl"
            value={values.storagePublicUrl}
            onChange={(e) =>
              setValues((current) => ({
                ...current,
                storagePublicUrl: e.target.value,
              }))
            }
            className={adminInputClass}
            placeholder="https://assets.soyup.work"
          />
        </div>
      </SettingsPanel>

      <SettingsFormActions isPending={isPending} />
    </form>
  );
}
