"use client";

import { updateGeneralSettings } from "@/app/actions/settings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import type { GeneralSettingsFormValues } from "@/types/platform-settings.types";
import {
  IconBell,
  IconDeviceFloppy,
  IconLoader,
  IconTool,
  IconUsersGroup,
  IconWorld,
} from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { toast } from "@/lib/toast";

type GeneralSettingsFormProps = {
  initialValues: GeneralSettingsFormValues;
};

export function GeneralSettingsForm({
  initialValues,
}: GeneralSettingsFormProps) {
  const [values, setValues] = useState(initialValues);
  const [isPending, startTransition] = useTransition();

  const updateBoolean = (
    key: keyof GeneralSettingsFormValues,
    checked: boolean,
  ) => {
    setValues((current) => ({ ...current, [key]: checked }));
  };

  const updateText = (key: keyof GeneralSettingsFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await updateGeneralSettings(values);

      if (result.ok) {
        toast.success("Configuración guardada");
        return;
      }

      toast.error(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className={adminPanelClass}>
        <div className={adminPanelHeaderClass}>
          <div className="flex items-center gap-2">
            <IconWorld className="size-4 text-primary" stroke={2.5} />
            <div>
              <h2 className={adminPanelTitleClass}>Marca y contacto</h2>
              <p className="text-xs text-muted-foreground">
                Identidad pública de la plataforma
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="siteName">Nombre del sitio</Label>
            <Input
              id="siteName"
              value={values.siteName}
              onChange={(e) => updateText("siteName", e.target.value)}
              className={adminInputClass}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="siteTagline">Tagline</Label>
            <Input
              id="siteTagline"
              value={values.siteTagline}
              onChange={(e) => updateText("siteTagline", e.target.value)}
              className={adminInputClass}
              placeholder="Cursos prácticos para freelancers de LATAM"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="supportEmail">Correo de soporte</Label>
            <Input
              id="supportEmail"
              type="email"
              value={values.supportEmail}
              onChange={(e) => updateText("supportEmail", e.target.value)}
              className={adminInputClass}
              placeholder="hola@soyup.work"
            />
          </div>
        </div>
      </section>

      <section className={adminPanelClass}>
        <div className={adminPanelHeaderClass}>
          <div className="flex items-center gap-2">
            <IconTool className="size-4 text-primary" stroke={2.5} />
            <div>
              <h2 className={adminPanelTitleClass}>Modo mantenimiento</h2>
              <p className="text-xs text-muted-foreground">
                Bloquea el sitio público y muestra una página informativa
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="maintenanceMode"
              className="text-xs font-mono uppercase"
            >
              Activo
            </Label>
            <Switch
              id="maintenanceMode"
              checked={values.maintenanceMode}
              onCheckedChange={(checked) => {
                updateBoolean("maintenanceMode", checked);
                if (checked) updateBoolean("waitlistMode", false);
              }}
            />
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="maintenanceMessage">Mensaje público</Label>
            <Textarea
              id="maintenanceMessage"
              value={values.maintenanceMessage}
              onChange={(e) => updateText("maintenanceMessage", e.target.value)}
              className={adminInputClass}
              rows={3}
              placeholder="Estamos mejorando la plataforma. Volvemos pronto."
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded border-2 border-foreground bg-secondary/40 px-3 py-2">
            <div className="space-y-0.5">
              <p className="font-mono text-xs font-bold uppercase">
                Permitir acceso a administradores
              </p>
              <p className="text-xs text-muted-foreground">
                Los admins pueden navegar el sitio con mantenimiento activo
              </p>
            </div>
            <Switch
              checked={values.maintenanceAllowAdmins}
              onCheckedChange={(checked) =>
                updateBoolean("maintenanceAllowAdmins", checked)
              }
            />
          </div>
        </div>
      </section>

      <section className={adminPanelClass}>
        <div className={adminPanelHeaderClass}>
          <div className="flex items-center gap-2">
            <IconUsersGroup className="size-4 text-primary" stroke={2.5} />
            <div>
              <h2 className={adminPanelTitleClass}>Modo waitlist</h2>
              <p className="text-xs text-muted-foreground">
                Muestra una landing de lista de espera y captura correos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="waitlistMode"
              className="text-xs font-mono uppercase"
            >
              Activo
            </Label>
            <Switch
              id="waitlistMode"
              checked={values.waitlistMode}
              onCheckedChange={(checked) => {
                updateBoolean("waitlistMode", checked);
                if (checked) updateBoolean("maintenanceMode", false);
              }}
            />
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="waitlistMessage">Mensaje público</Label>
            <Textarea
              id="waitlistMessage"
              value={values.waitlistMessage}
              onChange={(e) => updateText("waitlistMessage", e.target.value)}
              className={adminInputClass}
              rows={3}
              placeholder="Estamos por lanzar. Déjanos tu correo para avisarte."
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded border-2 border-foreground bg-secondary/40 px-3 py-2">
            <div className="space-y-0.5">
              <p className="font-mono text-xs font-bold uppercase">
                Mantener catálogo visible
              </p>
              <p className="text-xs text-muted-foreground">
                Permite visitar /catalog aunque el waitlist esté activo
              </p>
            </div>
            <Switch
              checked={values.waitlistAllowCatalog}
              onCheckedChange={(checked) =>
                updateBoolean("waitlistAllowCatalog", checked)
              }
            />
          </div>
        </div>
      </section>

      <section className={adminPanelClass}>
        <div className={adminPanelHeaderClass}>
          <div className="flex items-center gap-2">
            <IconBell className="size-4 text-primary" stroke={2.5} />
            <div>
              <h2 className={adminPanelTitleClass}>Anuncios globales</h2>
              <p className="text-xs text-muted-foreground">
                Banner informativo en el sitio de marketing
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between gap-4 rounded border-2 border-foreground bg-secondary/40 px-3 py-2">
            <div className="space-y-0.5">
              <p className="font-mono text-xs font-bold uppercase">
                Banner de anuncio
              </p>
              <p className="text-xs text-muted-foreground">
                Muestra un aviso en el sitio de marketing
              </p>
            </div>
            <Switch
              checked={values.showAnnouncementBanner}
              onCheckedChange={(checked) =>
                updateBoolean("showAnnouncementBanner", checked)
              }
            />
          </div>
          {values.showAnnouncementBanner && (
            <div className="space-y-2">
              <Label htmlFor="announcementMessage">Texto del anuncio</Label>
              <Textarea
                id="announcementMessage"
                value={values.announcementMessage}
                onChange={(e) =>
                  updateText("announcementMessage", e.target.value)
                }
                className={adminInputClass}
                rows={2}
                placeholder="Nuevo cohort de propuestas — inscripciones abiertas."
              />
            </div>
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className={adminBrutalButtonClass}
        >
          {isPending ? (
            <IconLoader className="animate-spin" stroke={2.25} />
          ) : (
            <IconDeviceFloppy stroke={2.25} />
          )}
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
