"use client";

import { AdminCardGrid } from "@/components/admin/listing/admin-card-grid";
import { AdminListingPanel } from "@/components/admin/listing/admin-listing-panel";
import { AdminTableActions } from "@/components/admin/listing/admin-table-actions";
import { Badge } from "@/components/ui/badge";
import {
  RESOURCE_AVAILABILITY,
  RESOURCE_AVAILABILITY_LABELS,
  RESOURCE_KIND,
  RESOURCE_STATUS,
  RESOURCE_STATUS_LABELS,
} from "@/constants/resources-admin.constants";
import type {
  ResourceAvailabilityValue,
  ResourceStatusValue,
} from "@/constants/resources-admin.constants";
import { guidePath, templatePath } from "@/lib/resources/paths";
import type { AdminResourceRow } from "@/types/resources-admin.types";
import { cn } from "@/lib/utils";
import { BookOpen, ExternalLink, FileCode, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const statusVariant: Record<
  ResourceStatusValue,
  "default" | "secondary" | "outline"
> = {
  PUBLISHED: "default",
  DRAFT: "secondary",
  ARCHIVED: "outline",
};

const availabilityVariant: Record<
  ResourceAvailabilityValue,
  "default" | "secondary" | "outline"
> = {
  AVAILABLE: "default",
  COMING_SOON: "secondary",
  COURSE: "outline",
};

function publicPath(resource: AdminResourceRow): string | null {
  if (resource.status !== RESOURCE_STATUS.PUBLISHED) return null;
  if (resource.availability === RESOURCE_AVAILABILITY.COMING_SOON) return null;
  return resource.kind === RESOURCE_KIND.GUIDE
    ? guidePath(resource.slug)
    : templatePath(resource.slug);
}

type ResourcesCardsProps = {
  resources: AdminResourceRow[];
  onDeleteClick: (resource: AdminResourceRow) => void;
};

export function ResourcesCards({ resources, onDeleteClick }: ResourcesCardsProps) {
  return (
    <>
      <AdminListingPanel
        title="Vista de Tarjetas"
        description="Explora y edita las guías y plantillas del catálogo"
        className="border-b-0 rounded-b-none pb-0"
      />

      <AdminCardGrid className="mt-4 mb-6">
        {resources.map((resource) => {
          const viewHref = publicPath(resource);
          const isGuide = resource.kind === RESOURCE_KIND.GUIDE;
          const Icon = isGuide ? BookOpen : FileCode;

          return (
            <article
              key={resource.id}
              className={cn(
                "flex h-full flex-col overflow-hidden rounded-lg border-2 border-foreground bg-card",
                "shadow-[4px_4px_0px_0px_var(--foreground)] transition-all",
                "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)]",
                resource.status === RESOURCE_STATUS.ARCHIVED && "opacity-75"
              )}
            >
              {/* Header with Title and Icon */}
              <div className="flex items-start gap-3 border-b-2 border-foreground bg-muted/40 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border-2 border-foreground bg-background shadow-[2px_2px_0px_0px_var(--foreground)]">
                  <Icon className="size-5 text-primary" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/resources/${resource.id}`}
                    className="font-heading text-sm font-extrabold line-clamp-2 hover:text-primary hover:underline"
                  >
                    {resource.title}
                  </Link>
                  <p className="truncate font-mono text-[10px] text-muted-foreground mt-0.5">
                    /{resource.slug}
                  </p>
                </div>
              </div>

              {/* Subtitle/Excerpt */}
              <div className="flex-1 p-4">
                {resource.subtitle && (
                  <p className="font-heading text-xs font-bold text-foreground mb-1.5 line-clamp-1">
                    {resource.subtitle}
                  </p>
                )}
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {resource.excerpt || "Sin descripción corta."}
                </p>
              </div>

              {/* Metadata details */}
              <div className="border-t-2 border-foreground/10 bg-muted/10 p-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase">Tipo</span>
                  <Badge variant="outline" className="text-[9px] uppercase font-bold">
                    {isGuide ? "Guía" : "Plantilla"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase">Categoría</span>
                  <span className="font-extrabold text-[11px] text-foreground">
                    {resource.category?.name ?? "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase">Estado</span>
                  <Badge variant={statusVariant[resource.status]} className="text-[9px] uppercase font-bold">
                    {RESOURCE_STATUS_LABELS[resource.status]}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase">Disponibilidad</span>
                  <Badge variant={availabilityVariant[resource.availability]} className="text-[9px] uppercase font-bold">
                    {RESOURCE_AVAILABILITY_LABELS[resource.availability]}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-foreground/5">
                  <span className="uppercase">Actualizado</span>
                  <span>{new Date(resource.updatedAt).toLocaleDateString("es")}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-auto border-t-2 border-foreground bg-muted p-2">
                <AdminTableActions
                  actions={[
                    {
                      id: "edit",
                      label: "Editar",
                      icon: <Pencil className="size-4" />,
                      href: `/admin/resources/${resource.id}`,
                    },
                    ...(viewHref
                      ? [
                          {
                            id: "view",
                            label: "Ver público",
                            icon: <ExternalLink className="size-4" />,
                            href: viewHref,
                            external: true,
                          },
                        ]
                      : []),
                    {
                      id: "delete",
                      label: "Eliminar",
                      icon: <Trash2 className="size-4" />,
                      onClick: () => onDeleteClick(resource),
                      destructive: true,
                    },
                  ]}
                />
              </div>
            </article>
          );
        })}
      </AdminCardGrid>
    </>
  );
}
