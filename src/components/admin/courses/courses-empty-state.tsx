"use client";

import { useState } from "react";
import {
  adminBrutalButtonClass,
  adminGridBackgroundClass,
  adminPanelClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
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
    <div className={cn(adminPanelClass, "relative overflow-hidden")}>
      <div className={adminGridBackgroundClass} />
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 py-16 text-center">
        <span className="group flex size-16 items-center justify-center rounded-lg border-2 border-foreground bg-secondary shadow-[4px_4px_0px_0px_var(--foreground)] transition-all duration-300 hover:rotate-6 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--foreground)]">
          <IconSchool className="size-8 text-primary transition-transform duration-300 group-hover:scale-110" stroke={2} />
        </span>
        <div className="max-w-md space-y-2">
          <h2 className="font-heading text-xl font-extrabold tracking-tight">
            {hasFilters ? "Sin resultados" : "Aún no hay cursos"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
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
            className={cn(
              adminBrutalButtonClass,
              "mt-2 px-5 py-5 font-mono text-xs font-bold uppercase transition-all duration-300 hover:scale-[1.02] active:scale-95"
            )}
          >
            Limpiar filtros
          </Button>
        ) : (
          <Button
            onClick={() => setIsOpen(true)}
            className={cn(
              adminBrutalButtonClass,
              "mt-2 px-5 py-5 font-mono text-xs font-bold uppercase transition-all duration-300 hover:scale-[1.02] active:scale-95"
            )}
          >
            Crear primer curso
          </Button>
        )}
      </div>
      <CourseCreationDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
