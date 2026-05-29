import { getStudentDashboardData } from "@/app/actions/student-dashboard.actions";
import { DashboardContainer } from "@/components/dashboard/dashboard-container";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import {
  IconAward,
  IconCertificate,
  IconChevronRight,
  IconCompass,
} from "@tabler/icons-react";
import Link from "next/link";

export async function StudentCertificatesView() {
  const { certificates } = await getStudentDashboardData();

  return (
    <DashboardContainer>
      <DashboardPageHeader
        eyebrow="Tus Logros"
        icon={<IconAward className="size-4" stroke={2.5} />}
        title="Certificados"
        description="Tus logros oficiales al completar cursos especializados."
      />

      <div className={cn(adminPanelClass, "p-3.5 sm:p-6 md:p-8 bg-card shadow-[6px_6px_0px_0px_var(--foreground)]")}>
        {certificates.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-12 text-center max-w-lg mx-auto">
            <div className="flex size-16 items-center justify-center rounded-full border-2 border-foreground bg-amber-500/10 shadow-[3px_3px_0px_0px_var(--foreground)]">
              <IconCertificate
                className="size-8 text-amber-600 animate-pulse"
                stroke={2.25}
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-lg font-extrabold text-foreground">
                Aún no tienes certificados disponibles
              </h3>
              <p className="text-sm text-muted-foreground">
                Los certificados oficiales se emiten automáticamente cuando completas el 100% de las lecciones de un curso certificado.
              </p>
            </div>

            {/* Motivational steps */}
            <div className="w-full text-left border-2 border-foreground bg-muted/20 p-3 sm:p-4 rounded-lg space-y-2.5 sm:space-y-3 font-mono text-[11px] font-bold uppercase tracking-wide">
              <div className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-foreground bg-secondary mt-0.5">1</span>
                <span>Inscríbete en un curso con certificado</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-foreground bg-secondary mt-0.5">2</span>
                <span>Completa todas las lecciones del temario</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-foreground bg-emerald-500/20 text-emerald-700 border-emerald-500/30 mt-0.5">3</span>
                <span>Descarga tu certificado y compártelo en LinkedIn</span>
              </div>
            </div>

            <Button asChild className={cn(adminBrutalButtonClass, "mt-2 bg-primary")}>
              <Link href="/catalog" className="inline-flex gap-2">
                <IconCompass className="size-4" stroke={2.5} />
                Explorar catálogo de cursos
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-mono text-[10px] font-bold uppercase text-muted-foreground tracking-wide border-b-2 border-foreground/10 pb-2">
              Certificados emitidos ({certificates.length})
            </p>
            <ul className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {certificates.map((cert) => (
                <li
                  key={cert.id}
                  className="flex flex-col justify-between gap-3 sm:gap-4 border-2 border-foreground bg-card p-3.5 sm:p-4 md:p-5 rounded-lg shadow-[4px_4px_0px_0px_var(--foreground)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)]"
                >
                  <div className="flex items-start gap-3 sm:gap-4 text-left">
                    <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-amber-500/10 shadow-[2px_2px_0px_0px_var(--foreground)]">
                      <IconAward
                        className="size-5 sm:size-6 text-amber-600"
                        stroke={2.5}
                      />
                    </div>
                    <div className="min-w-0 space-y-0.5 sm:space-y-1">
                      <p className="font-bold text-sm sm:text-base leading-tight text-foreground line-clamp-2">
                        {cert.courseTitle}
                      </p>
                      <p className="font-mono text-[9px] font-bold uppercase text-muted-foreground">
                        Código: {cert.code}
                      </p>
                      <p className="font-mono text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-sm w-fit leading-none mt-1.5 sm:mt-2">
                        Completado
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2.5 border-t border-foreground/15 pt-2.5 mt-0.5 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between min-[400px]:gap-3.5 min-[400px]:pt-3 min-[400px]:mt-1">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Emitido el: {new Date(cert.issuedAt).toLocaleDateString("es", {
                        dateStyle: "medium",
                      })}
                    </span>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className={cn(adminBrutalButtonClass, "bg-background py-1 px-3 h-8 w-full min-[400px]:w-auto shrink-0")}
                    >
                      <Link
                        href={`/dashboard/courses/${cert.courseSlug}`}
                        className="inline-flex items-center justify-center gap-1 font-mono text-[10px] font-extrabold uppercase"
                      >
                        Ver curso
                        <IconChevronRight className="size-3.5" stroke={2.5} />
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardContainer>
  );
}

