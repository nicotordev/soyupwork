import {
  adminPanelTitleClass,
  adminStatCardClass,
} from "@/lib/admin/styles";
import type { AdminCoursesStats } from "@/types/admin-course.types";
import {
  IconArchive,
  IconFileText,
  IconSchool,
  IconWorld,
} from "@tabler/icons-react";

type CoursesStatsGridProps = {
  stats: AdminCoursesStats;
};

const statItems = [
  {
    key: "total",
    label: "Total de cursos",
    icon: IconSchool,
    getValue: (stats: AdminCoursesStats) => String(stats.total),
    helper: "en la plataforma",
  },
  {
    key: "published",
    label: "Publicados",
    icon: IconWorld,
    getValue: (stats: AdminCoursesStats) => String(stats.published),
    helper: "visibles en catálogo",
  },
  {
    key: "draft",
    label: "Borradores",
    icon: IconFileText,
    getValue: (stats: AdminCoursesStats) => String(stats.draft),
    helper: "pendientes de publicar",
  },
  {
    key: "archived",
    label: "Archivados",
    icon: IconArchive,
    getValue: (stats: AdminCoursesStats) => String(stats.archived),
    helper: "fuera del catálogo",
  },
] as const;

export function CoursesStatsGrid({ stats }: CoursesStatsGridProps) {
  return (
    <section aria-labelledby="courses-stats-heading" className="mb-8">
      <h2 id="courses-stats-heading" className="sr-only">
        Resumen de cursos
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => (
          <article key={item.key} className={adminStatCardClass}>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded border-2 border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)]">
                <item.icon className="size-4 text-primary" stroke={2.25} />
              </span>
              <p className={adminPanelTitleClass}>{item.label}</p>
            </div>
            <p className="mt-3 font-heading text-2xl font-extrabold tracking-tight md:text-3xl">
              {item.getValue(stats)}
            </p>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase text-muted-foreground">
              {item.helper}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
