"use client";

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
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

type ResourcesTableProps = {
  resources: AdminResourceRow[];
  onDeleteClick: (resource: AdminResourceRow) => void;
};

function publicPath(resource: AdminResourceRow): string | null {
  if (resource.status !== RESOURCE_STATUS.PUBLISHED) return null;
  if (resource.availability === RESOURCE_AVAILABILITY.COMING_SOON) return null;
  return resource.kind === RESOURCE_KIND.GUIDE
    ? guidePath(resource.slug)
    : templatePath(resource.slug);
}

export function ResourcesTable({ resources, onDeleteClick }: ResourcesTableProps) {
  return (
    <AdminListingPanel
      title="Vista de Tabla"
      description="Listado detallado de todas las guías y plantillas del catálogo"
    >
      <Table>
        <TableHeader>
          <TableRow className="border-foreground/20 hover:bg-transparent">
            <TableHead className="font-mono text-[10px] uppercase">
              Título
            </TableHead>
            <TableHead className="font-mono text-[10px] uppercase">
              Estado
            </TableHead>
            <TableHead className="hidden font-mono text-[10px] uppercase md:table-cell">
              Disponibilidad
            </TableHead>
            <TableHead className="hidden font-mono text-[10px] uppercase lg:table-cell">
              Categoría
            </TableHead>
            <TableHead className="hidden font-mono text-[10px] uppercase xl:table-cell">
              Actualizado
            </TableHead>
            <TableHead className="w-[120px] font-mono text-[10px] uppercase">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => {
            const viewHref = publicPath(resource);
            return (
              <TableRow key={resource.id} className="border-foreground/15">
                <TableCell>
                  <div className="min-w-0">
                    <Link
                      href={`/admin/resources/${resource.id}`}
                      className="font-semibold hover:text-primary hover:underline"
                    >
                      {resource.title}
                    </Link>
                    <p className="truncate font-mono text-[10px] text-muted-foreground">
                      /{resource.slug}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[resource.status]}>
                    {RESOURCE_STATUS_LABELS[resource.status]}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={availabilityVariant[resource.availability]}>
                    {RESOURCE_AVAILABILITY_LABELS[resource.availability]}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                  {resource.category?.name ?? "—"}
                </TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground xl:table-cell">
                  {new Date(resource.updatedAt).toLocaleDateString("es")}
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </AdminListingPanel>
  );
}
