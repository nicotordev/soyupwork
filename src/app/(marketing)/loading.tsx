import { Skeleton } from "@/components/ui/skeleton";

function HeroLoading() {
  return (
    <section className="relative mx-auto w-full max-w-6xl overflow-x-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[3rem_3rem] opacity-20" />

      <div className="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
        <Skeleton className="h-6 w-64 max-w-full rounded-md border border-primary/20" />

        <div className="w-full space-y-5">
          <div className="space-y-3">
            <Skeleton className="mx-auto h-10 w-full max-w-3xl sm:h-12 md:h-14" />
            <Skeleton className="mx-auto h-10 w-11/12 max-w-2xl sm:h-12 md:h-14" />
            <Skeleton className="mx-auto h-8 w-4/5 max-w-xl sm:h-10 md:hidden" />
          </div>
          <Skeleton className="mx-auto h-24 w-full max-w-3xl sm:h-28" />
        </div>

        <div className="flex w-full max-w-lg flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Skeleton className="h-[3.25rem] w-full rounded border-2 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] sm:w-52" />
          <Skeleton className="h-[3.25rem] w-full rounded border-2 border-primary/40 sm:w-48" />
        </div>

        <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-2">
          {["w-32", "w-40", "w-48"].map((widthClass) => (
            <div key={widthClass} className="inline-flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-3.5 shrink-0 rounded-sm" />
              <Skeleton className={`h-3.5 ${widthClass}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function MarketingHomeLoading() {
  return (
    <div className="min-h-screen select-none overflow-x-hidden bg-background font-sans text-foreground antialiased">
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-[600px] w-full bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--primary),transparent)] opacity-10" />
      <div className="pointer-events-none absolute right-[-20%] top-[20%] z-0 h-[50vw] w-[50vw] bg-[radial-gradient(circle_at_center,var(--primary),transparent_70%)] opacity-3 blur-3xl" />
      <div className="pointer-events-none absolute left-[-20%] top-[60%] z-0 h-[50vw] w-[50vw] bg-[radial-gradient(circle_at_center,var(--primary),transparent_70%)] opacity-2 blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-10" />

      <main className="relative z-10 min-w-0">
        <HeroLoading />

        <hr className="border-foreground" />

        {/* Propuesta de valor */}
        <section className="border-y-2 border-foreground bg-secondary/15 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="space-y-3 rounded-2xl border-2 border-foreground bg-card p-5 text-center shadow-[4px_4px_0px_0px_var(--foreground)] sm:p-8"
                >
                  <Skeleton className="mx-auto size-12 rounded-xl border-2 border-foreground" />
                  <Skeleton className="mx-auto h-8 w-24 sm:h-9" />
                  <Skeleton className="mx-auto h-3 w-full max-w-[12rem]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simulador */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid min-w-0 grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-5">
              <Skeleton className="h-6 w-44 rounded-md border border-primary/30" />
              <Skeleton className="h-9 w-full sm:h-10" />
              <Skeleton className="h-9 w-11/12 sm:h-10" />
              <Skeleton className="h-16 w-full" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="h-4.5 w-4.5 shrink-0 rounded-sm" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border-2 border-border bg-card shadow-2xl lg:col-span-7">
              <div className="flex flex-col gap-3 border-b border-border bg-muted/30 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="ml-2 h-3 w-24 sm:w-52" />
                </div>
                <div className="grid w-full grid-cols-2 gap-1 rounded border border-border bg-background p-1 sm:flex sm:w-auto">
                  <Skeleton className="h-7 w-full rounded sm:h-6 sm:w-28" />
                  <Skeleton className="h-7 w-full rounded sm:h-6 sm:w-32" />
                </div>
              </div>
              <div className="space-y-4 p-3 sm:p-5">
                <Skeleton className="h-16 w-full rounded-lg border border-border" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Comparativa — mobile cards */}
        <section className="border-t border-border bg-card/20 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-14">
              <Skeleton className="mx-auto h-6 w-52 rounded-md" />
              <Skeleton className="mx-auto h-8 w-full max-w-lg" />
              <Skeleton className="mx-auto h-8 w-4/5 max-w-md" />
            </div>

            <div className="space-y-3 md:hidden">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-lg"
                >
                  <Skeleton className="h-10 w-full border-b border-border" />
                  <div className="space-y-3 p-3">
                    <Skeleton className="h-16 w-full rounded-lg bg-destructive/10" />
                    <Skeleton className="h-16 w-full rounded-lg bg-primary/10" />
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-lg md:block">
              <div className="grid grid-cols-3 gap-4 border-b border-border bg-muted/30 p-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 gap-4 border-b border-border p-4 last:border-b-0"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full bg-destructive/10" />
                  <Skeleton className="h-4 w-full bg-primary/10" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-14">
            <Skeleton className="mx-auto h-6 w-44 rounded-md" />
            <Skeleton className="mx-auto h-10 w-full max-w-xl" />
            <Skeleton className="mx-auto h-4 w-full max-w-lg" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6"
              >
                <Skeleton className="h-9 w-10 font-mono" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Selector de rutas */}
        <section className="relative z-10 border-t border-border bg-card/10 py-14 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 max-w-3xl space-y-4 text-center sm:mb-16">
              <Skeleton className="mx-auto h-6 w-52 rounded-md" />
              <Skeleton className="mx-auto h-10 w-full max-w-2xl" />
              <Skeleton className="mx-auto h-4 w-full max-w-xl" />
            </div>
            <div className="grid min-w-0 grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
              <div className="space-y-6 rounded-xl border-2 border-border bg-card p-4 sm:p-6 lg:col-span-5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
                <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-16 w-full rounded border border-border"
                    />
                  ))}
                </div>
                <div className="space-y-3 rounded-lg border border-border bg-background p-4">
                  <Skeleton className="h-3 w-28" />
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative min-w-0 lg:col-span-7">
                <div className="space-y-5 rounded-xl border border-border bg-background p-4 shadow-2xl sm:space-y-6 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Skeleton className="h-20 rounded-lg border border-border" />
                    <Skeleton className="h-20 rounded-lg border border-primary/20" />
                  </div>
                  <Skeleton className="h-28 w-full rounded-lg sm:h-32" />
                  <div className="grid grid-cols-1 gap-3 border-t border-border pt-2 sm:grid-cols-2 sm:gap-4">
                    <Skeleton className="h-12 rounded border border-border sm:h-10" />
                    <Skeleton className="h-12 rounded border border-primary/20 sm:h-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Plataforma LMS */}
        <section className="border-t border-border bg-card/30 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex max-w-2xl flex-col gap-3 sm:mb-14 sm:flex-row sm:items-start">
              <Skeleton className="h-5 w-5 shrink-0 rounded-sm" />
              <Skeleton className="h-7 w-full sm:h-8" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6"
                >
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto mb-8 max-w-2xl space-y-3 text-center sm:mb-14">
            <Skeleton className="mx-auto h-6 w-44 rounded-md" />
            <Skeleton className="mx-auto h-8 w-64" />
          </div>
          <div className="w-full divide-y divide-border overflow-hidden rounded-lg border-t border-border bg-card">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2 px-4 py-4">
                <Skeleton className="h-4 w-full max-w-lg" />
                {i === 1 ? (
                  <Skeleton className="h-12 w-full max-w-2xl" />
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <div className="relative space-y-5 overflow-hidden rounded-2xl border-2 border-border bg-card p-6 text-center shadow-2xl sm:space-y-6 sm:p-10 md:p-14">
            <Skeleton className="mx-auto h-6 w-28 rounded-md" />
            <div className="mx-auto max-w-2xl space-y-3">
              <Skeleton className="mx-auto h-9 w-full sm:h-10 md:h-12" />
              <Skeleton className="mx-auto h-9 w-4/5" />
            </div>
            <Skeleton className="mx-auto h-4 w-full max-w-xl" />
            <Skeleton className="mx-auto h-12 w-full max-w-xs rounded border-2 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] sm:w-56" />
          </div>
        </section>
      </main>
    </div>
  );
}
