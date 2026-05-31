import { AlertTriangle, Info, Sparkles, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LegalCalloutVariant } from "@/types/legal-page.types";

type LegalCalloutProps = {
  variant: LegalCalloutVariant;
  title: string;
  body: string;
};

const variantStyles: Record<
  LegalCalloutVariant,
  { panel: string; icon: typeof Info; iconClass: string }
> = {
  info: {
    panel: "bg-muted/60",
    icon: Info,
    iconClass: "text-primary",
  },
  highlight: {
    panel: "bg-primary/10",
    icon: Sparkles,
    iconClass: "text-primary",
  },
  warning: {
    panel: "bg-secondary",
    icon: AlertTriangle,
    iconClass: "text-foreground",
  },
  caution: {
    panel: "bg-destructive/10",
    icon: TriangleAlert,
    iconClass: "text-destructive",
  },
};

export function LegalCallout({ variant, title, body }: LegalCalloutProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <aside
      className={cn(
        "rounded-2xl border-2 border-foreground p-4 sm:p-5",
        "shadow-[3px_3px_0px_0px_var(--foreground)]",
        styles.panel,
      )}
      role="note"
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)]",
          )}
          aria-hidden
        >
          <Icon className={cn("size-4 stroke-[2.5]", styles.iconClass)} />
        </div>
        <div className="min-w-0 space-y-1.5">
          <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-foreground">
            {title}
          </p>
          <p className="text-sm font-medium leading-relaxed text-foreground/90">
            {body}
          </p>
        </div>
      </div>
    </aside>
  );
}
