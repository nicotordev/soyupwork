"use client";

import { updateVideoSettings } from "@/app/actions/settings.actions";
import { SettingsFormActions } from "@/components/admin/settings/settings-form-actions";
import { SettingsPanel } from "@/components/admin/settings/settings-panel";
import { SettingsToggleRow } from "@/components/admin/settings/settings-toggle-row";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminInputClass } from "@/lib/admin/styles";
import type { VideoSettingsFormValues } from "@/types/platform-settings.types";
import { IconMovie, IconPlayerPlay } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type VideoSettingsFormProps = {
  initialValues: VideoSettingsFormValues;
};

const qualityOptions = [
  { value: "auto", label: "Automática" },
  { value: "1080p", label: "1080p" },
  { value: "720p", label: "720p" },
  { value: "480p", label: "480p" },
] as const;

export function VideoSettingsForm({ initialValues }: VideoSettingsFormProps) {
  const [values, setValues] = useState(initialValues);
  const [isPending, startTransition] = useTransition();

  const updateBoolean = (
    key: keyof VideoSettingsFormValues,
    checked: boolean,
  ) => {
    setValues((current) => ({ ...current, [key]: checked }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateVideoSettings(values);
      if (result.ok) toast.success("Configuración guardada");
      else toast.error(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SettingsPanel
        icon={<IconMovie className="size-4 text-primary" stroke={2.5} />}
        title="Mux streaming"
        description="Reproducción de lecciones en video"
      >
        <div className="space-y-4 p-4">
          <SettingsToggleRow
            id="enableMuxStreaming"
            title="Streaming habilitado"
            description="Permite reproducir lecciones vía Mux"
            checked={values.enableMuxStreaming}
            onCheckedChange={(checked) =>
              updateBoolean("enableMuxStreaming", checked)
            }
          />
          <SettingsToggleRow
            id="videoSignedPlayback"
            title="Playback firmado"
            description="URLs de reproducción con expiración"
            checked={values.videoSignedPlayback}
            onCheckedChange={(checked) =>
              updateBoolean("videoSignedPlayback", checked)
            }
          />
        </div>
      </SettingsPanel>

      <SettingsPanel
        icon={<IconPlayerPlay className="size-4 text-primary" stroke={2.5} />}
        title="Calidad por defecto"
        description="Resolución inicial del reproductor"
      >
        <div className="space-y-2 p-4">
          <Label htmlFor="defaultVideoQuality">Calidad</Label>
          <Select
            value={values.defaultVideoQuality}
            onValueChange={(value) =>
              setValues((current) => ({
                ...current,
                defaultVideoQuality:
                  value as VideoSettingsFormValues["defaultVideoQuality"],
              }))
            }
          >
            <SelectTrigger id="defaultVideoQuality" className={adminInputClass}>
              <SelectValue placeholder="Selecciona calidad" />
            </SelectTrigger>
            <SelectContent>
              {qualityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SettingsPanel>

      <SettingsFormActions isPending={isPending} />
    </form>
  );
}
