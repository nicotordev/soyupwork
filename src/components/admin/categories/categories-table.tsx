"use client";

import { deleteCategory } from "@/app/actions/categories.actions";
import {
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import type { AdminCategoryRow } from "@/types/admin-category.types";
import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  const handleDelete = (category: AdminCategoryRow) => {
    if (
      !window.confirm(
        `¿Eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCategory(category.id);
      if (result.ok) {
        toast.success("Categoría eliminada");
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  };

  return (
    <section
      className={adminPanelClass}
      aria-labelledby="categories-table-title"
    >
      <div className={adminPanelHeaderClass}>
        <div>
          <h2 id="categories-table-title" className={adminPanelTitleClass}>
            Categorías existentes
          </h2>
          <p className="text-xs text-muted-foreground">
            Ordenadas por posición en catálogo
          </p>
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">
          Aún no hay categorías. Crea la primera arriba.
        </p>
      ) : (
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
              <TableHead className="w-[120px] font-mono text-[10px] uppercase">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="border-foreground/15">
                <TableCell className="font-medium">{category.name}</TableCell>
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
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/catalog?category=${category.slug}`}>
                        Ver
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      disabled={isPending || category.courseCount > 0}
                      onClick={() => handleDelete(category)}
                      aria-label={`Eliminar ${category.name}`}
                    >
                      <IconTrash stroke={2.25} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
