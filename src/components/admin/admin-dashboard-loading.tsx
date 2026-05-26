import { AdminDashboardContainer } from "@/components/admin/admin-dashboard-container";
import { Skeleton } from "@/components/ui/skeleton";
import {
  adminEyebrowClass,
  adminPanelClass,
  adminStatCardClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { IconLayoutDashboard, IconLoader } from "@tabler/icons-react";

type AdminDashboardLoadingProps = {
  label?: string;
};

export function AdminDashboardLoading({
  label = "Cargando panel...",
}: AdminDashboardLoadingProps) {
  return (
    <AdminDashboardContainer>
      <div
        className="space-y-8"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={label}
      >
        <header className="flex flex-col gap-6 border-b-4 border-foreground pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <div className={cn(adminEyebrowClass, "opacity-80")}>
              <IconLayoutDashboard
                className="size-4 animate-pulse text-primary"
                stroke={2.5}
              />
              <span className="flex items-center gap-2">
                <IconLoader
                  className="size-3.5 animate-spin text-primary"
                  stroke={2.5}
                  aria-hidden
                />
                {label}
              </span>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-9 w-56 max-w-full border-2 border-foreground bg-muted md:h-10 md:w-72" />
              <Skeleton className="h-4 w-full max-w-xl border-2 border-foreground bg-muted/80" />
              <Skeleton className="h-4 w-4/5 max-w-lg border-2 border-foreground bg-muted/60" />
            </div>
          </div>
          <Skeleton className="h-10 w-36 shrink-0 border-2 border-foreground bg-muted shadow-[2px_2px_0px_0px_var(--foreground)] sm:w-40" />
        </header>

        <section
          aria-hidden
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={adminStatCardClass}>
              <div className="flex items-center gap-2">
                <Skeleton className="size-8 shrink-0 rounded border-2 border-foreground bg-muted" />
                <Skeleton className="h-3 w-24 border border-foreground bg-muted" />
              </div>
              <Skeleton className="mt-3 h-8 w-16 border-2 border-foreground bg-muted" />
              <Skeleton className="mt-2 h-2.5 w-28 border border-foreground bg-muted/70" />
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className={adminPanelClass}>
              <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-3">
                <Skeleton className="h-3 w-32 border border-foreground bg-muted" />
                <Skeleton className="h-8 w-40 border-2 border-foreground bg-muted" />
              </div>
              <div className="space-y-3 p-4">
                <Skeleton className="h-48 w-full border-2 border-foreground bg-muted/50" />
                <div className="flex gap-2">
                  <Skeleton className="h-3 w-12 border border-foreground bg-muted" />
                  <Skeleton className="h-3 w-12 border border-foreground bg-muted" />
                  <Skeleton className="h-3 w-12 border border-foreground bg-muted" />
                </div>
              </div>
            </div>

            <div className={adminPanelClass}>
              <div className="border-b-2 border-foreground px-4 py-3">
                <Skeleton className="h-3 w-40 border border-foreground bg-muted" />
              </div>
              <div className="divide-y-2 divide-foreground">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 px-4 py-3"
                  >
                    <Skeleton className="h-4 w-24 border border-foreground bg-muted" />
                    <Skeleton className="h-4 flex-1 border border-foreground bg-muted/70" />
                    <Skeleton className="h-5 w-16 border-2 border-foreground bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={adminPanelClass}>
              <div className="border-b-2 border-foreground px-4 py-3">
                <Skeleton className="h-3 w-28 border border-foreground bg-muted" />
              </div>
              <div className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-1">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-16 w-full border-2 border-foreground bg-muted/60"
                  />
                ))}
              </div>
            </div>

            <div className={adminPanelClass}>
              <div className="border-b-2 border-foreground px-4 py-3">
                <Skeleton className="h-3 w-36 border border-foreground bg-muted" />
              </div>
              <div className="space-y-3 p-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Skeleton className="size-8 shrink-0 rounded border-2 border-foreground bg-muted" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-full border border-foreground bg-muted" />
                      <Skeleton className="h-2.5 w-2/3 border border-foreground bg-muted/60" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardContainer>
  );
}
