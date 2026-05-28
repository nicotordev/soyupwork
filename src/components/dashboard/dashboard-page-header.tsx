import { adminEyebrowClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type DashboardPageHeaderProps = {
  eyebrow: string;
  icon: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function DashboardPageHeader({
  eyebrow,
  icon,
  title,
  description,
  actions,
  children,
  className,
}: DashboardPageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-8 border-b-4 border-foreground pb-6",
        actions
          ? "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          : "space-y-4",
        className,
      )}
    >
      <div className="space-y-4">
        <div className={adminEyebrowClass}>
          {icon}
          {eyebrow}
        </div>
        <div className="space-y-2 text-left">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl text-foreground">
            {title}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
      {children}
    </header>
  );
}
