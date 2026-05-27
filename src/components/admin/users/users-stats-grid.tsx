import { adminPanelTitleClass, adminStatCardClass } from "@/lib/admin/styles";
import type { AdminUsersStats } from "@/types/admin-user.types";
import {
  IconSchool,
  IconShield,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

type UsersStatsGridProps = {
  stats: AdminUsersStats;
};

const statItems = [
  {
    key: "total",
    label: "Total miembros",
    icon: IconUsers,
    getValue: (stats: AdminUsersStats) => String(stats.total),
    helper: "cuentas activas",
  },
  {
    key: "students",
    label: "Estudiantes",
    icon: IconSchool,
    getValue: (stats: AdminUsersStats) => String(stats.students),
    helper: "rol estudiante",
  },
  {
    key: "instructors",
    label: "Instructores",
    icon: IconUser,
    getValue: (stats: AdminUsersStats) => String(stats.instructors),
    helper: "rol instructor",
  },
  {
    key: "admins",
    label: "Administradores",
    icon: IconShield,
    getValue: (stats: AdminUsersStats) => String(stats.admins),
    helper: "acceso al panel",
  },
] as const;

export function UsersStatsGrid({ stats }: UsersStatsGridProps) {
  return (
    <section aria-labelledby="users-stats-heading" className="mb-8">
      <h2 id="users-stats-heading" className="sr-only">
        Resumen de miembros
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
