import type { AdminSettingsSectionStatus } from "@/constants/settings.constants";
import { ADMIN_SETTINGS_SECTIONS } from "@/constants/settings.constants";
import {
  adminPanelClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { IconArrowRight, IconTools } from "@tabler/icons-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

const sectionStatusLabels: Record<AdminSettingsSectionStatus, string> = {
  available: "Disponible",
  coming_soon: "Próximamente",
};

export function SettingsSectionsGrid() {
  return (
    <section aria-labelledby="settings-sections-title" className="space-y-4">
      <div className="space-y-1">
        <h2
          id="settings-sections-title"
          className="font-mono text-xs font-bold uppercase tracking-wider"
        >
          Áreas de configuración
        </h2>
        <p className="text-sm text-muted-foreground">
          Secciones editables del panel de administración.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ADMIN_SETTINGS_SECTIONS.map((section) => {
          const card = (
            <article
              className={cn(
                adminPanelClass,
                "flex h-full flex-col gap-4 p-4 transition-all",
                section.status === "available" &&
                  "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)]",
                section.status === "coming_soon" && "opacity-90",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded border-2 border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)]">
                  <section.icon
                    className="size-4 text-primary"
                    stroke={2.25}
                  />
                </span>
                <Badge
                  variant="secondary"
                  className="gap-1 rounded border-2 border-foreground bg-secondary font-mono text-[10px] font-bold uppercase text-foreground shadow-[2px_2px_0px_0px_var(--foreground)]"
                >
                  {section.status === "coming_soon" && (
                    <IconTools stroke={2.5} />
                  )}
                  {section.status === "available" && (
                    <IconArrowRight stroke={2.5} />
                  )}
                  {sectionStatusLabels[section.status]}
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className={adminPanelTitleClass}>{section.label}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </article>
          );

          if (section.status === "available" && section.href) {
            return (
              <Link key={section.id} href={section.href} className="block h-full">
                {card}
              </Link>
            );
          }

          return (
            <div key={section.id} className="h-full">
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}
