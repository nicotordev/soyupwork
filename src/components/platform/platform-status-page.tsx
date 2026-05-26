import { adminPanelClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PlatformStatusPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  children?: ReactNode;
};

export function PlatformStatusPage({
  eyebrow,
  title,
  description,
  icon,
  children,
}: PlatformStatusPageProps) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10",
          "bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]",
          "bg-size-[4rem_4rem] opacity-35 dark:opacity-20",
        )}
      />
      <div className={cn(adminPanelClass, "w-full max-w-lg space-y-6 p-8 text-center")}>
        <div className="mx-auto flex size-12 items-center justify-center rounded border-2 border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)]">
          {icon}
        </div>
        <div className="space-y-2">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
            {eyebrow}
          </p>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight md:text-3xl">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
