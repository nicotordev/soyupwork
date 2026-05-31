import { BLOG_POST_STATUS_LABELS } from "@/constants/blog.constants";
import { adminStatCardClass } from "@/lib/admin/styles";
import type { AdminBlogStats } from "@/types/blog.types";
import { cn } from "@/lib/utils";

type BlogStatsGridProps = {
  stats: AdminBlogStats;
};

const items = [
  { key: "total", label: "Total" },
  { key: "published", label: BLOG_POST_STATUS_LABELS.PUBLISHED },
  { key: "draft", label: BLOG_POST_STATUS_LABELS.DRAFT },
  { key: "archived", label: BLOG_POST_STATUS_LABELS.ARCHIVED },
] as const;

export function BlogStatsGrid({ stats }: BlogStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 border-b-2 border-foreground bg-muted/20 p-4 sm:grid-cols-4 sm:px-6">
      {items.map((item) => (
        <div key={item.key} className={cn(adminStatCardClass, "p-3")}>
          <p className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-1 font-heading text-2xl font-black tabular-nums">
            {stats[item.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
