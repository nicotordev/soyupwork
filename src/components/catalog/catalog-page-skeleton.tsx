import { Skeleton } from "@/components/ui/skeleton";

function CourseCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border-2 border-foreground bg-card p-4 shadow-[4px_4px_0px_0px_var(--foreground)]">
      <div className="space-y-3">
        <div className="flex justify-between gap-2">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-14 rounded" />
        </div>
        <Skeleton className="h-9 w-full rounded border-2 border-foreground" />
      </div>
    </div>
  );
}

export function CatalogPageSkeleton() {
  return (
    <div className="px-4 py-8 font-sans text-foreground sm:px-6 lg:px-8">
      <header className="mx-auto mb-10 max-w-7xl space-y-6 pt-4">
        <div className="space-y-4 border-b-4 border-foreground pb-6">
          <Skeleton className="h-7 w-44 rounded border-2 border-foreground" />
          <Skeleton className="h-10 w-full max-w-xl md:h-14" />
          <Skeleton className="h-16 w-full max-w-2xl" />
        </div>
        <div className="grid grid-cols-1 items-center gap-4 pt-2 lg:grid-cols-3">
          <Skeleton className="h-12 rounded-lg border-2 border-foreground shadow-[3px_3px_0px_0px_var(--foreground)] lg:col-span-2" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded" />
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>
        </div>
      </header>

      <section className="mx-auto mb-12 max-w-7xl">
        <Skeleton className="mb-6 h-7 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </section>

      <main className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="hidden space-y-4 lg:block">
            <Skeleton className="h-10 w-full rounded-lg border-2 border-foreground" />
            <Skeleton className="h-48 w-full rounded-lg border-2 border-foreground" />
            <Skeleton className="h-32 w-full rounded-lg border-2 border-foreground" />
          </aside>
          <section className="space-y-6 lg:col-span-3">
            <Skeleton className="h-14 w-full rounded-lg border-2 border-foreground" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
