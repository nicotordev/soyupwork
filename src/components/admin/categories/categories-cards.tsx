"use client";

import { deleteCategory } from "@/app/actions/categories.actions";
import { AdminCardGrid } from "@/components/admin/listing/admin-card-grid";
import { AdminListingPanel } from "@/components/admin/listing/admin-listing-panel";
import { AdminTableActions } from "@/components/admin/listing/admin-table-actions";
import { CategoryIcon } from "@/components/common/category-icon";
import { getCategoryPath } from "@/lib/catalog/category-paths";
import { cn } from "@/lib/utils";
import type { AdminCategoryRow } from "@/types/admin-category.types";
import { ExternalLink, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "@/lib/toast";

import { Badge } from "@/components/ui/badge";
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
import { useState } from "react";

type CategoriesCardsProps = {
  categories: AdminCategoryRow[];
};

export function CategoriesCards({ categories }: CategoriesCardsProps) {
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
        title="Vista de tarjetas"
        description="Ordenadas por posición en catálogo"
        className="border-b-0 rounded-b-none pb-0"
      />

      <AdminCardGrid columns="compact" className="mt-4 mb-6">
        {categories.map((category) => (
          <article
            key={category.id}
            role="listitem"
            className={cn(
              "flex h-full flex-col overflow-hidden rounded-lg border-2 border-foreground bg-card",
              "shadow-[4px_4px_0px_0px_var(--foreground)] transition-all",
              "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)]",
            )}
          >
            <div className="flex items-start gap-3 border-b-2 border-foreground bg-muted/40 p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded border-2 border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)]">
                <CategoryIcon icon={category.icon} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-heading text-sm font-extrabold">
                  {category.name}
                </h3>
                <code className="mt-0.5 block truncate font-mono text-[10px] text-muted-foreground">
                  /{category.slug}
                </code>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase">
                  Cursos
                </span>
                <Badge variant="secondary">{category.courseCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase">
                  Posición
                </span>
                <span className="font-extrabold">{category.position}</span>
              </div>
            </div>

            <div className="mt-auto border-t-2 border-foreground bg-muted p-2">
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
            </div>
          </article>
        ))}
      </AdminCardGrid>

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
