import { cn } from "@/lib/utils";

/** Neobrutalist tokens shared across the admin dashboard */
export const adminPanelClass = cn(
  "border-2 border-foreground bg-card rounded-lg",
  "shadow-[4px_4px_0px_0px_var(--foreground)]",
);

export const adminPanelHeaderClass = cn(
  "flex flex-col gap-1 border-b-2 border-foreground px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
);

export const adminPanelTitleClass = cn(
  "font-mono text-xs font-bold uppercase tracking-wider text-foreground",
);

export const adminEyebrowClass = cn(
  "inline-flex items-center gap-2 px-3 py-1 bg-secondary border-2 border-foreground rounded font-mono text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--foreground)]",
);

export const adminStatCardClass = cn(
  adminPanelClass,
  "p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)]",
);

/** @deprecated Prefer `<Button />` variants; kept for font-mono overrides in admin. */
export const adminBrutalButtonClass = "font-mono";

export const adminInputClass = cn(
  "border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)]",
  "focus-visible:shadow-[3px_3px_0px_0px_var(--foreground)] focus-visible:ring-0",
);

export const adminSidebarBrandClass = cn(
  "font-heading text-sm font-extrabold tracking-tight border-2 border-foreground bg-secondary px-3 py-1",
  "shadow-[2px_2px_0px_0px_var(--foreground)] rounded transition-all",
  "hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_var(--foreground)]",
);

export const adminGridBackgroundClass = cn(
  "pointer-events-none absolute inset-0 -z-10",
  "bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]",
  "bg-size-[4rem_4rem] opacity-35 dark:opacity-20",
);
