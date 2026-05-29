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
        "mb-5 border-b-4 border-foreground pb-4 sm:mb-8 sm:pb-6",
        actions
          ? "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          : "space-y-3 sm:space-y-4",
        className,
      )}
    >
      <div className="space-y-3 sm:space-y-4">
        <div className={cn(adminEyebrowClass, "scale-90 origin-left sm:scale-100")}>
          {icon}
          {eyebrow}
        </div>
        <div className="space-y-1.5 sm:space-y-2 text-left">
          <h1 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2 sm:gap-3">{actions}</div>}
      {children}
    </header>
  );
}
