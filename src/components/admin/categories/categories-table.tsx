"use client";

import { deleteCategory } from "@/app/actions/categories.actions";
import { AdminListingPanel } from "@/components/admin/listing/admin-listing-panel";
import { AdminTableActions } from "@/components/admin/listing/admin-table-actions";
import { CategoryIcon } from "@/components/common/category-icon";
import { getCategoryPath } from "@/lib/catalog/category-paths";
import type { AdminCategoryRow } from "@/types/admin-category.types";
import { ExternalLink, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "@/lib/toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CategoriesTableProps = {
  categories: AdminCategoryRow[];
};

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<AdminCategoryRow | null>(
    null,
  );

  const handleDelete = () => {
    if (!pendingDelete) return;

    startTransition(async () => {
      const result = await deleteCategory(pendingDelete.id);
      if (result.ok) {
        toast.success("Categoría eliminada");
        setPendingDelete(null);
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  };

  return (
    <>
      <AdminListingPanel
        title="Listado de categorías"
        description="Ordenadas por posición en catálogo"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-foreground/20 hover:bg-transparent">
              <TableHead className="font-mono text-[10px] uppercase">
                Nombre
              </TableHead>
              <TableHead className="font-mono text-[10px] uppercase">
                Slug
              </TableHead>
              <TableHead className="hidden font-mono text-[10px] uppercase sm:table-cell">
                Cursos
              </TableHead>
              <TableHead className="hidden font-mono text-[10px] uppercase md:table-cell">
                Posición
              </TableHead>
              <TableHead className="text-right font-mono text-[10px] uppercase">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="border-foreground/15">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded border-2 border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)]">
                      <CategoryIcon icon={category.icon} />
                    </span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {category.slug}
                  </code>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="secondary">{category.courseCount}</Badge>
                </TableCell>
                <TableCell className="hidden font-mono text-xs md:table-cell">
                  {category.position}
                </TableCell>
                <TableCell className="text-right">
                  <AdminTableActions
                    actions={[
                      {
                        id: "catalog",
                        label: `Ver ${category.name} en catálogo`,
                        icon: <ExternalLink className="size-4" aria-hidden />,
                        href: getCategoryPath(category.slug),
                        external: true,
                      },
                      {
                        id: "delete",
                        label: `Eliminar ${category.name}`,
                        icon: <Trash2 className="size-4" aria-hidden />,
                        onClick: () => setPendingDelete(category),
                        disabled: isPending || category.courseCount > 0,
                        destructive: true,
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminListingPanel>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent className="border-2 border-foreground shadow-[6px_6px_0px_0px_var(--foreground)] sm:max-w-md">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-base font-extrabold">
              Eliminar categoría
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `¿Eliminar "${pendingDelete.name}"? Esta acción no se puede deshacer.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending || !pendingDelete}
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
