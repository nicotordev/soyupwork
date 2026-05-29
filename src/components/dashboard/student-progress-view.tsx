import { getStudentDashboardData } from "@/app/actions/student-dashboard.actions";
import { DashboardContainer } from "@/components/dashboard/dashboard-container";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCourseLevelDisplay } from "@/lib/catalog/course-level";
import {
  adminBrutalButtonClass,
  adminPanelClass,
  adminPanelHeaderClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import {
  IconAward,
  IconBook,
  IconBooks,
  IconCertificate,
  IconChevronRight,
  IconCompass,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export async function StudentProgressView() {
  const { stats, enrolledCourses } = await getStudentDashboardData();

  const statsItems = [
    {
      label: "Cursos inscritos",
      value: String(stats.enrolledCoursesCount),
      icon: IconBooks,
      color: "bg-primary/10",
      helper: "Tus capacitaciones",
    },
    {
      label: "Lecciones completadas",
      value: String(stats.completedLessonsCount),
      icon: IconBook,
      color: "bg-emerald-500/10",
      helper: "Total de avance",
    },
    {
      label: "Certificados",
      value: String(stats.certificatesCount),
      icon: IconAward,
      color: "bg-amber-500/10",
      helper: "Logros oficiales",
    },
  ];

  return (
    <DashboardContainer>
      <DashboardPageHeader
        eyebrow="Tu Avance"
        icon={<IconBooks className="size-4" stroke={2.5} />}
        title="Progreso Académico"
        description="Resumen consolidado de tu avance y rendimiento en todos los cursos."
      />

      {/* Stats Grid */}
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {statsItems.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={cn(
                adminPanelClass,
                "p-3 bg-card shadow-[4px_4px_0px_0px_var(--foreground)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--foreground)]",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-mono text-[9px] font-bold uppercase text-muted-foreground tracking-wider">
                  {stat.label}
                </p>
                <div
                  className={cn(
                    "rounded-md border-2 border-foreground p-1 shadow-[1px_1px_0px_0px_var(--foreground)]",
                    stat.color,
                  )}
                >
                  <Icon className="size-3.5" stroke={2.5} />
                </div>
              </div>
              <p className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                {stat.value}
              </p>
              <p className="mt-0.5 font-mono text-[8px] sm:text-[9px] text-muted-foreground">
                {stat.helper}
              </p>
            </div>
          );
        })}
      </div>

      <div
        className={cn(
          adminPanelClass,
          "bg-card shadow-[6px_6px_0px_0px_var(--foreground)] overflow-hidden",
        )}
      >
        <div className={adminPanelHeaderClass}>
          <h3 className="font-heading font-extrabold text-foreground flex items-center gap-2">
            <IconBooks className="size-5" />
            Progreso por Curso
          </h3>
          <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
            {enrolledCourses.length}{" "}
            {enrolledCourses.length === 1 ? "curso" : "cursos"}
          </span>
        </div>

        <div className="p-3.5 sm:p-6">
          {enrolledCourses.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center max-w-md mx-auto">
              <IconBooks
                className="size-16 text-muted-foreground/30 animate-pulse"
                stroke={1.5}
              />
              <div className="space-y-2">
                <h4 className="font-heading text-lg font-extrabold">
                  Aún no tienes cursos inscritos
                </h4>
                <p className="text-sm text-muted-foreground">
                  Inscríbete en uno de nuestros cursos especializados de Upwork
                  para comenzar a registrar tu progreso aquí.
                </p>
              </div>
              <Button
                asChild
                className={cn(adminBrutalButtonClass, "mt-2 bg-primary")}
              >
                <Link href="/catalog" className="inline-flex gap-2">
                  <IconCompass className="size-4" stroke={2.5} />
                  Ver catálogo
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-3 sm:space-y-4">
              {enrolledCourses.map((course) => (
                <li
                  key={course.id}
                  className="flex flex-col gap-3 border-2 border-foreground p-3 rounded-lg bg-card shadow-[3px_3px_0px_0px_var(--foreground)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--foreground)] sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Left part: Thumbnail and course details */}
                  <div className="flex gap-3 flex-1 min-w-0">
                    <div className="relative size-11 sm:size-14 shrink-0 overflow-hidden rounded border-2 border-foreground bg-muted shadow-[2px_2px_0px_0px_var(--foreground)]">
                      {course.thumbnailUrl ? (
                        <Image
                          src={course.thumbnailUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                          unoptimized
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center font-mono text-[8px] sm:text-[9px] uppercase text-muted-foreground">
                          —
                        </span>
                      )}
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 text-left min-w-0 flex-1">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="font-bold text-xs sm:text-base hover:text-primary hover:underline transition-colors block truncate"
                      >
                        {course.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="font-mono text-[8px] uppercase border-foreground/30 py-0 leading-none"
                        >
                          {formatCourseLevelDisplay(course.level)}
                        </Badge>
                        <span className="font-mono text-[8px] sm:text-[9px] text-muted-foreground font-bold">
                          {course.completedLessons}/{course.totalLessons} lecc.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right part: Progress bar and action button */}
                  <div className="flex items-center justify-between gap-3 sm:justify-end shrink-0 w-full sm:w-auto">
                    <div className="w-full sm:w-36 space-y-0.5 sm:space-y-1">
                      <div className="flex justify-between font-mono text-[9px] font-bold">
                        <span>Progreso</span>
                        <span>{course.progressPercent}%</span>
                      </div>
                      <div className="h-2 sm:h-3.5 w-full border-2 border-foreground rounded bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary border-r-2 border-foreground transition-all duration-300"
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className={cn(
                        adminBrutalButtonClass,
                        "bg-background shrink-0 w-full sm:w-auto h-9",
                      )}
                    >
                      <Link
                        href={`/courses/${course.slug}`}
                        className="inline-flex items-center justify-center gap-1 font-mono text-[10px] font-extrabold uppercase"
                      >
                        Continuar
                        <IconChevronRight className="size-3.5" stroke={2.5} />
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardContainer>
  );
}
