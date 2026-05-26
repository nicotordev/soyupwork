import { ACTIVITY_TYPE_LABELS } from "@/constants/dashboard.constants";
import {
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/dashboard-styles";
import { formatDashboardRelativeTime } from "@/lib/admin/format-dashboard";
import type { DashboardActivity } from "@/types/dashboard.types";
import {
  IconBook,
  IconReceipt,
  IconRefresh,
  IconSchool,
  IconUserPlus,
} from "@tabler/icons-react";

type DashboardActivityFeedProps = {
  activity: DashboardActivity[];
};

const activityIcons = {
  sale: IconReceipt,
  enrollment: IconSchool,
  course: IconBook,
  refund: IconRefresh,
  user: IconUserPlus,
} as const;

export function DashboardActivityFeed({
  activity,
}: DashboardActivityFeedProps) {
  return (
    <section className={adminPanelClass} aria-labelledby="activity-feed-title">
      <div className={adminPanelHeaderClass}>
        <div>
          <h2 id="activity-feed-title" className={adminPanelTitleClass}>
            Actividad reciente
          </h2>
          <p className="text-xs text-muted-foreground">
            Eventos de ventas, cursos y usuarios
          </p>
        </div>
      </div>
      <ul className="divide-y divide-foreground/15 px-2 pb-2">
        {activity.map((item) => {
          const Icon = activityIcons[item.type];

          return (
            <li
              key={item.id}
              className="flex gap-3 px-2 py-3 transition-colors hover:bg-muted/40"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded border-2 border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)]">
                <Icon className="size-4 text-primary" stroke={2.25} />
              </span>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <span className="font-mono text-[9px] font-bold uppercase text-muted-foreground">
                    {ACTIVITY_TYPE_LABELS[item.type]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {formatDashboardRelativeTime(item.timestamp)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
