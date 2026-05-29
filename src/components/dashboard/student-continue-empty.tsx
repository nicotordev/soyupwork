import { DashboardContainer } from "@/components/dashboard/dashboard-container";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { IconBooks, IconCompass, IconPlayerPlay } from "@tabler/icons-react";
import Link from "next/link";

export function StudentContinueEmpty() {
  return (
    <DashboardContainer>
      <DashboardPageHeader
        eyebrow="Retomar"
        icon={<IconPlayerPlay className="size-4" stroke={2.5} />}
        title="Continuar Aprendiendo"
        description="Retoma tus lecciones justo donde las dejaste en tu último curso activo."
      />

      <div
        className={cn(
          adminPanelClass,
          "flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-8 md:p-12 text-center bg-card shadow-[6px_6px_0px_0px_var(--foreground)] max-w-2xl mx-auto",
        )}
      >
        <div className="flex size-12 sm:size-16 items-center justify-center rounded-full border-2 border-foreground bg-primary/10 shadow-[3px_3px_0px_0px_var(--foreground)] animate-bounce">
          <IconPlayerPlay
            className="size-6 sm:size-8 text-primary ml-0.5 sm:ml-1"
            fill="currentColor"
            stroke={2.5}
          />
        </div>

        <div className="space-y-2 max-w-md">
          <h2 className="font-heading text-xl font-extrabold text-foreground">
            No encontramos lecciones pendientes
          </h2>
          <p className="text-sm text-muted-foreground">
            Aún no has iniciado ninguna lección o ya has completado exitosamente
            todo tu material. Inscríbete en un nuevo curso o revisa tus cursos
            activos para empezar.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 w-full sm:w-auto pt-2">
          <Button
            asChild
            className={cn(
              adminBrutalButtonClass,
              "w-full sm:w-auto bg-primary",
            )}
          >
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2"
            >
              <IconBooks className="size-4" stroke={2.5} />
              Mis cursos activos
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className={cn(
              adminBrutalButtonClass,
              "w-full sm:w-auto bg-background",
            )}
          >
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2"
            >
              <IconCompass className="size-4" stroke={2.5} />
              Explorar catálogo
            </Link>
          </Button>
        </div>
      </div>
    </DashboardContainer>
  );
}
