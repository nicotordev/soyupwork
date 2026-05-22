import { IconLoader, IconBook, IconCircleDot, IconPlayerPlay } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AppLoadingStateProps {
  label?: string;
}

export function AppLoadingState({ label = "Cargando soyup.work..." }: AppLoadingStateProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 md:p-8">
      {/* Grid background pattern without gradients */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 dark:opacity-20" />

      {/* Top Header Block - Styled as a course progress card */}
      <div className="relative border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--foreground)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            {/* Spinning loader with solid state label */}
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded border-2 border-foreground bg-secondary">
                <IconLoader className="h-4.5 w-4.5 animate-spin text-primary" stroke={2.5} />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                {label}
              </span>
            </div>
            {/* Outline skeletal text placeholders */}
            <div className="w-56 h-7 border border-foreground bg-muted/70 rounded" />
            <div className="w-80 h-4 border border-foreground bg-muted/40 rounded" />
          </div>
          {/* Skeleton outline button */}
          <div className="h-9 w-32 border-2 border-foreground bg-secondary rounded shadow-[2px_2px_0px_0px_var(--foreground)] self-start md:self-auto" />
        </div>
      </div>

      {/* Main content columns: simulate course modules & sidebar */}
      <div className="grid gap-8 lg:grid-cols-3">

        {/* Course Modules Column (Spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <IconBook className="h-4 w-4" />
              Módulos del Curso en preparación...
            </h3>
            <span className="font-mono text-[10px] text-muted-foreground">CRONOGRAMA DE ESTUDIOS</span>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-start gap-4 border-2 border-foreground bg-card p-4 shadow-[2px_2px_0px_0px_var(--foreground)]"
              >
                {/* Visual marker */}
                <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded border-2 border-foreground bg-secondary">
                  <IconPlayerPlay className="h-4 w-4 text-foreground/40" />
                </div>
                {/* Text lines */}
                <div className="flex-1 space-y-2 py-0.5">
                  <div className="h-4 w-1/3 border border-foreground bg-muted/80 rounded" />
                  <div className="h-3 w-3/4 border border-foreground bg-muted/40 rounded" />
                </div>
                <div className="h-5 w-16 border border-foreground bg-muted/50 rounded text-center font-mono text-[9px] font-bold" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Info Column (Spans 1 col) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <IconCircleDot className="h-4 w-4 text-foreground/75" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Tu Progreso
            </h3>
          </div>

          <div className="border-2 border-dashed border-foreground bg-card/60 p-5 space-y-5 shadow-[2px_2px_0px_0px_var(--foreground)]">
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-[9px] font-bold">
                <span>COMPLETADO</span>
                <span>--%</span>
              </div>
              {/* Wireframe border progress bar */}
              <div className="h-4 w-full border-2 border-foreground bg-background rounded-none overflow-hidden">
                <div className="h-full w-1/3 bg-primary border-r-2 border-foreground animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="h-3 w-full border border-foreground bg-muted/40 rounded" />
              <div className="h-3 w-5/6 border border-foreground bg-muted/30 rounded" />
              <div className="h-3 w-2/3 border border-foreground bg-muted/20 rounded" />
            </div>

            <div className="pt-2 border-t border-foreground/30">
              <div className="h-9 w-full border-2 border-foreground bg-secondary rounded shadow-[2px_2px_0px_0px_var(--foreground)]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
