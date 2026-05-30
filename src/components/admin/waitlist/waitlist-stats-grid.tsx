import { adminPanelTitleClass, adminStatCardClass } from "@/lib/admin/styles";
import type { AdminWaitlistStats } from "@/types/admin-waitlist.types";
import {
  IconMail,
  IconTicket,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";

type WaitlistStatsGridProps = {
  stats: AdminWaitlistStats;
};

const statItems = [
  {
    key: "total",
    label: "En lista",
    icon: IconUsers,
    getValue: (stats: AdminWaitlistStats) => String(stats.totalEntries),
    helper: "correos verificados",
  },
  {
    key: "pending",
    label: "Invitaciones pendientes",
    icon: IconMail,
    getValue: (stats: AdminWaitlistStats) => String(stats.pendingInvites),
    helper: "enlaces activos",
  },
  {
    key: "accepted",
    label: "Invitaciones usadas",
    icon: IconTicket,
    getValue: (stats: AdminWaitlistStats) => String(stats.acceptedInvites),
    helper: "registro completado",
  },
  {
    key: "accounts",
    label: "Con cuenta",
    icon: IconUserCheck,
    getValue: (stats: AdminWaitlistStats) => String(stats.withUserAccount),
    helper: "en esta página",
  },
] as const;

export function WaitlistStatsGrid({ stats }: WaitlistStatsGridProps) {
  return (
    <section aria-labelledby="waitlist-stats-heading" className="mb-8">
      <h2 id="waitlist-stats-heading" className="sr-only">
        Resumen de lista de espera
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
