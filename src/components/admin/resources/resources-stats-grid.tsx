import { RESOURCE_STATUS_LABELS } from "@/constants/resources-admin.constants";
import { adminStatCardClass } from "@/lib/admin/styles";
import type { AdminResourceStats } from "@/types/resources-admin.types";
import { cn } from "@/lib/utils";
import { FileStack, CheckCircle, FileEdit, Archive } from "lucide-react";

type ResourcesStatsGridProps = {
  stats: AdminResourceStats;
};

const items = [
  {
    key: "total",
    label: "Total",
    icon: FileStack,
    colorClass: "hover:bg-primary/5 hover:border-primary",
    iconColor: "text-primary",
  },
  {
    key: "published",
    label: RESOURCE_STATUS_LABELS.PUBLISHED,
    icon: CheckCircle,
    colorClass: "hover:bg-emerald-500/5 hover:border-emerald-500",
    iconColor: "text-emerald-500",
  },
  {
    key: "draft",
    label: RESOURCE_STATUS_LABELS.DRAFT,
    icon: FileEdit,
    colorClass: "hover:bg-amber-500/5 hover:border-amber-500",
    iconColor: "text-amber-500",
  },
  {
    key: "archived",
    label: RESOURCE_STATUS_LABELS.ARCHIVED,
    icon: Archive,
    colorClass: "hover:bg-rose-500/5 hover:border-rose-500",
    iconColor: "text-rose-500",
  },
] as const;

export function ResourcesStatsGrid({ stats }: ResourcesStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 border-b-2 border-foreground bg-muted/20 py-4 sm:grid-cols-4 mb-6">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className={cn(
              adminStatCardClass,
              "p-4 relative overflow-hidden flex flex-col justify-between min-h-[96px]",
              item.colorClass,
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </p>
              <Icon
                className={cn("size-4 shrink-0 opacity-70", item.iconColor)}
                aria-hidden
              />
            </div>
            <p className="mt-2 font-heading text-3xl font-black tabular-nums leading-none">
              {stats[item.key]}
            </p>
          </div>
        );
      })}
    </div>
  );
}
