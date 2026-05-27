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
    <div className="relative isolate flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-4 py-12 sm:py-20">
      {/* Background layers (z-0 inside isolate — negative z-index breaks behind body) */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_12%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_12%,transparent)_1px,transparent_1px)] bg-size-[60px_60px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]" />
      </div>

      {/* Decorative shapes */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
        aria-hidden
      >
        <svg
          viewBox="-4 -4 32 32"
          className="absolute -left-6 -top-6 size-20 animate-float-y sm:left-10 sm:top-10 sm:size-28"
        >
          <path
            d="M12 0L14.5 9L24 12L14.5 15L12 24L9.5 15L0 12L9.5 9Z"
            fill="var(--foreground)"
            transform="translate(2, 2)"
          />
          <path
            d="M12 0L14.5 9L24 12L14.5 15L12 24L9.5 15L0 12L9.5 9Z"
            fill="#fde047"
            stroke="var(--foreground)"
            strokeWidth={1.5}
          />
        </svg>

        <svg
          viewBox="-4 -4 32 32"
          className="absolute -right-6 -bottom-6 size-24 animate-float-y-delayed sm:right-10 sm:bottom-10 sm:size-32"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="var(--foreground)"
            transform="translate(2, 2)"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="#6ee7b7"
            stroke="var(--foreground)"
            strokeWidth={1.5}
          />
          <circle
            cx="12"
            cy="12"
            r="6"
            fill="none"
            stroke="var(--foreground)"
            strokeWidth={1.5}
          />
          <circle cx="12" cy="12" r="2" fill="var(--foreground)" />
        </svg>

        <svg
          viewBox="-4 -4 32 32"
          className="absolute top-[18%] -right-4 hidden size-14 animate-spin-slow lg:block"
        >
          <path
            d="M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z"
            fill="var(--foreground)"
            transform="translate(2, 2)"
          />
          <path
            d="M10 2h4v8h8v4h-8v8h-4v-8H2v-4h8V2z"
            fill="#c7d2fe"
            stroke="var(--foreground)"
            strokeWidth={1.5}
          />
        </svg>

        <svg
          viewBox="-4 -4 32 32"
          className="absolute bottom-[22%] -left-4 hidden size-20 animate-float-y lg:block"
        >
          <path
            d="M12 2L2 22h20L12 2z"
            fill="var(--foreground)"
            transform="translate(2, 2)"
          />
          <path
            d="M12 2L2 22h20L12 2z"
            fill="#fbcfe8"
            stroke="var(--foreground)"
            strokeWidth={1.5}
          />
        </svg>
      </div>

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
