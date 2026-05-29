import type { ReactNode } from "react";
import { NeobrutalistPageDecoration } from "@/components/common/neobrutalist-page-decoration";

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
    <div className="relative isolate flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-4 py-12 sm:py-20">
      <NeobrutalistPageDecoration shapeCount={7} seed={7} />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="absolute inset-0 z-0 translate-x-2 translate-y-2 rounded-2xl border-4 border-foreground bg-primary sm:translate-x-3 sm:translate-y-3" />

        <div className="relative z-10 flex w-full flex-col overflow-hidden rounded-2xl border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--foreground)] transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)]">
          <div className="flex select-none items-center justify-between border-b-4 border-foreground bg-secondary px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-full border-2 border-foreground bg-red-400" />
              <span className="size-3 rounded-full border-2 border-foreground bg-yellow-400" />
              <span className="size-3 rounded-full border-2 border-foreground bg-green-400" />
            </div>
            <span className="truncate font-mono text-xs font-black uppercase tracking-wider text-foreground/80">
              {eyebrow}
            </span>
            <div className="shrink-0 rounded border border-foreground/20 bg-background/50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-foreground/50">
              SYS.EXE
            </div>
          </div>

          <div className="flex flex-col space-y-6 p-6 text-center sm:p-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-xl border-4 border-foreground bg-secondary text-primary shadow-[3px_3px_0px_0px_var(--foreground)] transition-transform duration-300 hover:rotate-6 hover:scale-105 [&>svg]:size-8">
              {icon}
            </div>

            <div className="space-y-3">
              <h1 className="font-heading text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {title}
              </h1>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                {description}
              </p>
            </div>

            {children ? (
              <>
                <div className="h-0.5 border-t-2 border-dashed border-foreground/20" />
                <div className="w-full pt-2 text-left">{children}</div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
