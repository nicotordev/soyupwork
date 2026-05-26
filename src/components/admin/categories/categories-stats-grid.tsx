import { adminPanelTitleClass, adminStatCardClass } from "@/lib/admin/styles";
import type { AdminCategoriesStats } from "@/types/admin-category.types";
import {
  IconCategory,
  IconFolderOff,
  IconFolders,
  IconSchool,
} from "@tabler/icons-react";

type CategoriesStatsGridProps = {
  stats: AdminCategoriesStats;
};

const statItems = [
  {
    key: "total",
    label: "Total de categorías",
    icon: IconCategory,
    getValue: (stats: AdminCategoriesStats) => String(stats.total),
    helper: "en el catálogo",
  },
  {
    key: "withCourses",
    label: "Con cursos",
    icon: IconFolders,
    getValue: (stats: AdminCategoriesStats) => String(stats.withCourses),
    helper: "con al menos un curso",
  },
  {
    key: "empty",
    label: "Vacías",
    icon: IconFolderOff,
    getValue: (stats: AdminCategoriesStats) => String(stats.empty),
    helper: "sin cursos asignados",
  },
  {
    key: "assignedCourses",
    label: "Cursos asignados",
    icon: IconSchool,
    getValue: (stats: AdminCategoriesStats) => String(stats.assignedCourses),
    helper: "vinculados a categoría",
  },
] as const;

export function CategoriesStatsGrid({ stats }: CategoriesStatsGridProps) {
  return (
    <section aria-labelledby="categories-stats-heading" className="mb-8">
      <h2 id="categories-stats-heading" className="sr-only">
        Resumen de categorías
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
