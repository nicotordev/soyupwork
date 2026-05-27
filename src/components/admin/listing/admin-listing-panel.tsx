import {
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AdminListingPanelProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  id?: string;
  className?: string;
  headerActions?: ReactNode;
};

export function AdminListingPanel({
  title,
  description,
  children,
  id,
  className,
  headerActions,
}: AdminListingPanelProps) {
  const titleId = id ?? "admin-listing-panel-title";

  return (
    <section
      className={cn(adminPanelClass, className)}
      aria-labelledby={titleId}
    >
      <div className={adminPanelHeaderClass}>
        <div>
          <h2 id={titleId} className={adminPanelTitleClass}>
            {title}
          </h2>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {headerActions}
      </div>
      {children ?? null}
    </section>
  );
}
