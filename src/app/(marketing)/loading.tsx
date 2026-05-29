import { Skeleton } from "@/components/ui/skeleton";

function HeroLoading() {
  return (
    <section className="relative mx-auto w-full overflow-x-hidden px-4 py-12 sm:px-6 sm:py-20 md:py-28 lg:px-8">
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

        <div className="flex w-full max-w-lg flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
          <Skeleton className="h-12 min-h-12 w-full rounded border-2 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] sm:w-52 md:h-14 md:min-h-14" />
          <Skeleton className="h-12 min-h-12 w-full rounded border-2 border-primary/40 sm:w-48 md:h-14 md:min-h-14" />
        </div>

        {/* Mobile trust rows */}
        <div className="w-full max-w-sm overflow-hidden rounded-xl border-2 border-foreground md:hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex min-h-11 items-center gap-3 px-3 py-2 ${
                i < 3 ? "border-b-2 border-foreground" : ""
              }`}
            >
              <Skeleton className="size-4 shrink-0 rounded-sm" />
              <Skeleton className="h-3.5 flex-1" />
            </div>
          ))}
        </div>

        {/* Desktop trust badges */}
        <div className="hidden w-full max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-2 md:flex">
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
    <div className="min-h-screen select-none overflow-x-hidden bg-background pb-20 font-sans text-foreground antialiased md:pb-0">
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-[600px] w-full bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--primary),transparent)] opacity-10" />
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-10" />

      <main className="relative z-10 min-w-0">
        <HeroLoading />

        <hr className="border-foreground" />

        {/* Propuesta de valor */}
        <section className="border-y-2 border-foreground bg-secondary/15 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Mobile list panel */}
            <div className="overflow-hidden rounded-xl border-2 border-foreground md:hidden">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex min-h-11 items-center gap-3 px-3 py-2 ${
                    i < 3 ? "border-b-2 border-foreground" : ""
                  }`}
                >
                  <Skeleton className="size-8 shrink-0 rounded-lg border-2 border-foreground" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-2.5 w-full max-w-[10rem]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop cards */}
            <div className="hidden grid-cols-3 gap-6 md:grid">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="space-y-3 rounded-2xl border-2 border-foreground bg-card p-8 text-center shadow-[4px_4px_0px_0px_var(--foreground)]"
                >
                  <Skeleton className="mx-auto size-12 rounded-xl border-2 border-foreground" />
                  <Skeleton className="mx-auto h-9 w-24" />
                  <Skeleton className="mx-auto h-3 w-full max-w-[12rem]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simulador */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
          <div className="grid min-w-0 grid-cols-1 items-center gap-6 sm:gap-12 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5 md:space-y-6">
              <Skeleton className="h-6 w-44 rounded-md border border-primary/30" />
              <Skeleton className="h-8 w-full md:h-10" />
              <Skeleton className="h-16 w-full" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="size-4 shrink-0 rounded-sm" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_var(--foreground)] lg:col-span-7 md:shadow-[4px_4px_0px_0px_var(--foreground)]">
              <div className="flex flex-col gap-3 border-b-2 border-foreground bg-muted/30 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="size-2 rounded-full" />
                  <Skeleton className="size-2 rounded-full" />
                  <Skeleton className="size-2 rounded-full" />
                  <Skeleton className="ml-2 h-3 w-24 md:w-52" />
                </div>
                <div className="grid w-full grid-cols-2 gap-1 rounded border-2 border-foreground/20 bg-background p-1 sm:flex sm:w-auto">
                  <Skeleton className="h-11 w-full rounded sm:h-6 sm:w-28" />
                  <Skeleton className="h-11 w-full rounded sm:h-6 sm:w-32" />
                </div>
              </div>
              <div className="space-y-3 p-3 md:space-y-4 md:p-5">
                <Skeleton className="h-16 w-full border-b border-foreground/10" />
                <Skeleton className="h-24 w-full bg-destructive/5" />
                <Skeleton className="h-14 w-full bg-primary/5" />
              </div>
            </div>
          </div>
        </section>

        {/* Comparativa */}
        <section className="border-y-2 border-foreground bg-muted py-10 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-14">
              <Skeleton className="mx-auto h-6 w-52 rounded-md" />
              <Skeleton className="mx-auto h-7 w-full max-w-lg md:h-8" />
              <Skeleton className="mx-auto h-4 w-4/5 max-w-md" />
            </div>

            {/* Mobile panel */}
            <div className="overflow-hidden rounded-xl border-2 border-foreground md:hidden">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={i < 4 ? "border-b-2 border-foreground" : undefined}
                >
                  <Skeleton className="h-9 w-full border-b-2 border-foreground" />
                  <Skeleton className="h-14 w-full bg-destructive/5" />
                  <Skeleton className="h-14 w-full bg-primary/5" />
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border-2 border-foreground bg-card shadow-[8px_8px_0px_0px_var(--foreground)] md:block">
              <div className="grid grid-cols-3 gap-4 border-b-2 border-foreground bg-muted/30 p-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 gap-4 border-b-2 border-foreground p-4 last:border-b-0"
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
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-14">
            <Skeleton className="mx-auto h-6 w-44 rounded-md" />
            <Skeleton className="mx-auto h-7 w-full max-w-xl md:h-10" />
            <Skeleton className="mx-auto h-4 w-full max-w-lg" />
          </div>

          {/* Mobile list */}
          <div className="overflow-hidden rounded-xl border-2 border-foreground md:hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex min-h-11 items-start gap-3 px-3 py-3 ${
                  i < 4 ? "border-b-2 border-foreground" : ""
                }`}
              >
                <Skeleton className="h-5 w-5 shrink-0" />
                <Skeleton className="size-7 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop grid */}
          <div className="hidden grid-cols-2 gap-6 lg:grid lg:grid-cols-4 md:grid">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="space-y-4 rounded-2xl border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--foreground)]"
              >
                <Skeleton className="h-9 w-10 font-mono" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Selector de rutas */}
        <section className="relative z-10 border-b-2 border-foreground bg-secondary/15 py-10 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-8 max-w-3xl space-y-4 text-center sm:mb-16">
              <Skeleton className="mx-auto h-6 w-52 rounded-md" />
              <Skeleton className="mx-auto h-7 w-full max-w-2xl md:h-10" />
              <Skeleton className="mx-auto h-4 w-full max-w-xl" />
            </div>

            {/* Mobile */}
            <div className="space-y-4 md:hidden">
              <div className="overflow-hidden rounded-xl border-2 border-foreground">
                <Skeleton className="h-9 w-full border-b-2 border-foreground" />
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex min-h-11 items-center gap-3 px-3 py-2 ${
                      i < 4 ? "border-b-2 border-foreground" : ""
                    }`}
                  >
                    <Skeleton className="size-4 shrink-0 rounded-sm" />
                    <Skeleton className="h-3.5 w-24" />
                  </div>
                ))}
              </div>
              <div className="overflow-hidden rounded-xl border-2 border-foreground">
                <Skeleton className="h-11 w-full border-b-2 border-foreground" />
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    className={`h-12 w-full ${
                      i < 4 ? "border-b-2 border-foreground" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden min-w-0 grid-cols-1 items-center gap-6 md:grid lg:grid-cols-12 lg:gap-8">
              <div className="space-y-6 rounded-2xl border-2 border-foreground bg-card p-6 lg:col-span-5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-16 w-full rounded border-2 border-foreground"
                    />
                  ))}
                </div>
              </div>
              <div className="relative min-w-0 lg:col-span-7">
                <div className="space-y-5 rounded-2xl border-2 border-foreground bg-background p-6 shadow-[8px_8px_0px_0px_var(--foreground)]">
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-20 rounded-xl border-2 border-foreground" />
                    <Skeleton className="h-20 rounded-xl border-2 border-primary/20" />
                  </div>
                  <Skeleton className="h-28 w-full rounded-xl" />
                  <div className="grid grid-cols-2 gap-4 border-t-2 border-foreground pt-4">
                    <Skeleton className="h-10 rounded-lg border-2 border-foreground" />
                    <Skeleton className="h-10 rounded-lg border-2 border-primary/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Plataforma LMS */}
        <section className="border-b-2 border-foreground bg-primary/5 py-10 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex max-w-2xl flex-col gap-3 sm:mb-14 sm:flex-row sm:items-start">
              <Skeleton className="size-12 shrink-0 rounded-2xl border-2 border-foreground" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-full sm:h-8" />
              </div>
            </div>

            {/* Mobile list */}
            <div className="overflow-hidden rounded-xl border-2 border-foreground md:hidden">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex min-h-11 items-start gap-3 px-3 py-3 ${
                    i < 3 ? "border-b-2 border-foreground" : ""
                  }`}
                >
                  <Skeleton className="size-8 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop cards */}
            <div className="hidden grid-cols-3 gap-8 md:grid">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="space-y-4 rounded-2xl border-2 border-foreground bg-card p-6 shadow-[6px_6px_0px_0px_var(--foreground)]"
                >
                  <Skeleton className="size-10 rounded-xl" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto mb-6 max-w-2xl space-y-3 text-center sm:mb-14">
            <Skeleton className="mx-auto h-6 w-44 rounded-md" />
            <Skeleton className="mx-auto h-7 w-64 md:h-8" />
          </div>
          <div className="w-full overflow-hidden rounded-xl border-2 border-foreground bg-card">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`min-h-11 px-3 py-3 sm:px-4 ${
                  i < 6 ? "border-b-2 border-foreground" : ""
                }`}
              >
                <Skeleton className="h-4 w-full max-w-lg" />
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-24 lg:px-8">
          <div className="overflow-hidden rounded-2xl border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--foreground)] sm:rounded-3xl md:shadow-[8px_8px_0px_0px_var(--foreground)]">
            <Skeleton className="h-11 w-full border-b-2 border-foreground" />
            <div className="space-y-4 px-5 py-10 sm:px-10 sm:py-14 lg:flex lg:items-center lg:justify-between lg:gap-8">
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-full max-w-lg lg:h-10" />
                <Skeleton className="h-8 w-4/5 max-w-md lg:h-9" />
                <Skeleton className="h-14 w-full max-w-xl lg:max-w-2xl" />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0 lg:flex-col xl:flex-row">
                <Skeleton className="h-12 min-h-12 w-full rounded border-2 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] sm:w-48 md:h-14" />
                <Skeleton className="h-12 min-h-12 w-full rounded border-2 border-primary/40 sm:w-44 md:h-14" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky CTA placeholder */}
      <div className="fixed inset-x-0 bottom-0 z-[100] border-t-2 border-foreground bg-background pb-safe backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-10 w-32 shrink-0 rounded border-2 border-foreground" />
        </div>
      </div>
    </div>
  );
}
