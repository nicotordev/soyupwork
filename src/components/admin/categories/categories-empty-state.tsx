"use client";

import { CategoryCreationDialog } from "@/components/admin/categories/category-creation-dialog";
import { Button } from "@/components/ui/button";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import { IconCategory } from "@tabler/icons-react";
import { useState } from "react";

type CategoriesEmptyStateProps = {
  hasFilters: boolean;
  onClearFilters?: () => void;
};

export function CategoriesEmptyState({
  hasFilters,
  onClearFilters,
}: CategoriesEmptyStateProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={adminPanelClass}>
      <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded border-2 border-foreground bg-secondary shadow-[4px_4px_0px_0px_var(--foreground)]">
          <IconCategory className="size-7 text-primary" stroke={2.25} />
        </span>
        <div className="max-w-md space-y-2">
          <h2 className="font-heading text-xl font-extrabold tracking-tight">
            {hasFilters ? "Sin resultados" : "Aún no hay categorías"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {hasFilters
              ? "Probá con otros términos o limpiá la búsqueda para ver todas las categorías."
              : "Cuando crees tu primera categoría, aparecerá aquí para que puedas gestionarla."}
          </p>
        </div>
        {hasFilters && onClearFilters ? (
          <Button
            type="button"
            variant="outline"
            onClick={onClearFilters}
            className={adminBrutalButtonClass}
          >
            Limpiar filtros
          </Button>
        ) : (
          <Button
            onClick={() => setIsOpen(true)}
            className={adminBrutalButtonClass}
          >
            Crear primera categoría
          </Button>
        )}
      </div>
      <CategoryCreationDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}
