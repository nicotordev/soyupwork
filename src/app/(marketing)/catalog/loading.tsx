import { Skeleton } from "@/components/ui/skeleton";
import { IconSchool, IconAdjustmentsHorizontal, IconSearch } from "@tabler/icons-react";

export default function CatalogLoading() {
    return (
        <div className="bg-background min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Hero Header Skeleton */}
            <header className="max-w-7xl mx-auto mb-10 space-y-6 pt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-4 border-foreground pb-6">
                    <div className="space-y-4 max-w-3xl w-full">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary border-2 border-foreground rounded font-mono text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--foreground)] opacity-70">
                            <IconSchool className="size-4 text-primary animate-pulse" />
                            Cargando catálogo...
                        </div>
                        <Skeleton className="h-10 w-3/4 max-w-lg bg-muted border-2 border-foreground" />
                        <Skeleton className="h-4 w-5/6 max-w-xl bg-muted border-2 border-foreground" />
                    </div>
                </div>

                {/* Search Bar Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center pt-2">
                    <div className="lg:col-span-2 relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <IconSearch className="size-4 text-muted-foreground animate-pulse" />
                        </span>
                        <div className="w-full h-11 bg-card border-2 border-foreground rounded-lg animate-pulse" />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <Skeleton className="h-5 w-24 bg-muted border border-foreground/35" />
                        <Skeleton className="h-5 w-16 bg-muted border border-foreground/35 animate-pulse" />
                        <Skeleton className="h-5 w-16 bg-muted border border-foreground/35" />
                    </div>
                </div>
            </header>

            {/* Main Content Skeleton */}
            <main className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Skeleton */}
                    <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-card border-2 border-foreground rounded-lg p-5 shadow-[4px_4px_0px_0px_var(--foreground)]">
                        <div className="flex items-center justify-between border-b-2 border-foreground pb-3">
                            <h3 className="font-bold font-mono text-sm uppercase flex items-center gap-2">
                                <IconAdjustmentsHorizontal className="size-4 text-primary animate-pulse" />
                                Filtros
                            </h3>
                        </div>
                        {/* Filter sections */}
                        {[1, 2, 3].map((section) => (
                            <div key={section} className="space-y-2 pt-2">
                                <Skeleton className="h-4 w-20 bg-muted" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3.5 w-full bg-muted" />
                                    <Skeleton className="h-3.5 w-5/6 bg-muted" />
                                    <Skeleton className="h-3.5 w-4/5 bg-muted" />
                                </div>
                            </div>
                        ))}
                    </aside>

                    {/* Main Grid Skeleton */}
                    <section className="lg:col-span-3 space-y-6">
                        <div className="h-12 bg-secondary/15 border-2 border-foreground rounded-lg animate-pulse" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="bg-card border-2 border-foreground rounded-lg p-4 h-64 shadow-[4px_4px_0px_0px_var(--foreground)] flex flex-col justify-between"
                                >
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-20 bg-muted" />
                                            <Skeleton className="h-4 w-12 bg-muted animate-pulse" />
                                        </div>
                                        <Skeleton className="h-5 w-full bg-muted border-2 border-foreground" />
                                        <Skeleton className="h-3.5 w-5/6 bg-muted" />
                                        <Skeleton className="h-3.5 w-2/3 bg-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-px w-full bg-muted" />
                                        <div className="flex gap-2 justify-between">
                                            <Skeleton className="h-4 w-12 bg-muted" />
                                            <Skeleton className="h-4 w-12 bg-muted" />
                                            <Skeleton className="h-4 w-12 bg-muted" />
                                        </div>
                                        <Skeleton className="h-8 w-full bg-muted border-2 border-foreground animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}