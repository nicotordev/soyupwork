"use client";


import { useState } from "react";
import {
  adminBrutalButtonClass,
  adminPanelClass,
} from "@/lib/admin/dashboard-styles";
import { IconSchool } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CourseCreationDialog } from "@/components/admin/courses/course-creation-dialog";

type CoursesEmptyStateProps = {
  hasFilters: boolean;
  onClearFilters?: () => void;
};

export function CoursesEmptyState({
  hasFilters,
  onClearFilters,
}: CoursesEmptyStateProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={adminPanelClass}>
      <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded border-2 border-foreground bg-secondary shadow-[4px_4px_0px_0px_var(--foreground)]">
          <IconSchool className="size-7 text-primary" stroke={2.25} />
        </span>
        <div className="max-w-md space-y-2">
          <h2 className="font-heading text-xl font-extrabold tracking-tight">
            {hasFilters ? "Sin resultados" : "Aún no hay cursos"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {hasFilters
              ? "Probá con otros filtros o limpiá la búsqueda para ver todos los cursos."
              : "Cuando crees tu primer curso, aparecerá aquí para que puedas gestionarlo."}
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
            Crear primer curso
          </Button>
        )}
      </div>
      <CourseCreationDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />

    </div>
  );
}
