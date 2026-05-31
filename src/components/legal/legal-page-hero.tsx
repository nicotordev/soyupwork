import { CalendarDays, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LegalPageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
};

export function LegalPageHero({
  eyebrow,
  title,
  subtitle,
  lastUpdated,
}: LegalPageHeroProps) {
  return (
    <header className="relative mx-auto w-full max-w-4xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14 md:pt-16 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.153_0.006_107.1/8%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.153_0.006_107.1/8%)_1px,transparent_1px)] bg-size-[3rem_3rem] opacity-20 md:opacity-30 dark:opacity-15" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,var(--primary),transparent)] opacity-10" />

      <div className="flex flex-col items-start gap-5 sm:gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-primary/30 font-mono text-[10px] font-bold uppercase tracking-wider text-primary"
          >
            {eyebrow}
          </Badge>
          <span
            className="hidden size-2 rotate-45 border-2 border-foreground bg-secondary sm:inline-block"
            aria-hidden
          />
          <span className="hidden font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:inline">
            Documento vinculante
          </span>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <h1 className="font-heading text-3xl font-black leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              {title}
            </h1>
            <p className="max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground sm:text-base md:text-lg">
              {subtitle}
            </p>
          </div>

          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-2xl border-2 border-foreground bg-card p-4",
              "shadow-[4px_4px_0px_0px_var(--foreground)]",
              "sm:size-20",
            )}
            aria-hidden
          >
            <Scale
              className="size-8 text-primary sm:size-9"
              strokeWidth={2.25}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <CalendarDays className="size-2.5" aria-hidden />
            Última actualización
          </Badge>
          <span className="font-mono text-xs font-bold text-foreground">
            {lastUpdated}
          </span>
        </div>
      </div>
    </header>
  );
}
