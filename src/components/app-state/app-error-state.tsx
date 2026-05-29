"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  IconAlertTriangle,
  IconRefresh,
  IconHome,
  IconLayoutDashboard,
  IconCode,
  IconTerminal,
  IconShield,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AppErrorStateProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}

export function AppErrorState({
  error,
  reset,
  title = "Algo salió mal",
  description = "No pudimos cargar esta parte de la plataforma. Puedes intentarlo nuevamente o volver al inicio de la página.",
}: AppErrorStateProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Runtime Error captured by boundary:", error);
    }
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex min-h-[70vh] w-full min-w-0 flex-col items-center justify-center p-4 sm:min-h-[85vh] sm:p-6 md:p-8">
      {/* Grid background pattern without gradients */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-35 sm:bg-[size:4rem_4rem] dark:opacity-20" />

      <div className="w-full min-w-0 max-w-xl space-y-6">
        <Card className="relative overflow-hidden border-2 border-destructive bg-card shadow-[4px_4px_0px_0px_var(--destructive)] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--destructive)]">
          {/* Header Banner representing a Contract Dispute / Tech Alert */}
          <div className="flex flex-col gap-1.5 border-b-2 border-destructive bg-destructive/10 px-3 py-2 text-destructive sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
              <IconShield className="h-4 w-4 shrink-0 animate-bounce" />
              <span className="truncate font-mono text-[9px] font-bold uppercase tracking-wide sm:text-[10px] sm:tracking-wider">
                ALERTA: CONTRATO INTERRUMPIDO
              </span>
            </div>
            <div className="shrink-0 font-mono text-[9px] sm:text-[10px]">
              TICKET: #{error.digest?.slice(0, 8) || "SYSTEM_CRASH"}
            </div>
          </div>

          <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-destructive">
                  <span className="bg-destructive/15 border border-destructive/30 px-2 py-0.5 rounded">
                    RUNTIME_CRASH
                  </span>
                  <span className="bg-muted border border-border px-2 py-0.5 rounded">
                    Acción Requerida
                  </span>
                </div>
                <CardTitle className="pt-1.5 font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
                  {title}
                </CardTitle>
              </div>
              <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-destructive bg-background text-destructive shadow-[2px_2px_0px_0px_var(--destructive)]">
                <IconAlertTriangle className="h-6 w-6" stroke={2} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-4 py-0 sm:px-6">
            {/* Warning Message Box */}
            <div className="my-2 rounded-lg border-2 border-dashed border-destructive/40 bg-destructive/5 p-3 text-xs sm:p-4">
              <div className="flex items-start gap-2.5">
                <IconTerminal className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                <div className="space-y-2">
                  <p className="font-mono text-[10px] font-bold uppercase text-destructive">
                    DETALLES DE LA INTERRUPCIÓN:
                  </p>
                  <CardDescription className="text-xs/relaxed text-foreground md:text-sm/relaxed font-medium">
                    {description}
                  </CardDescription>
                </div>
              </div>
            </div>

            {/* Dev Mode Debug Terminal mockup */}
            {isDev && (
              <div className="mt-4 border-2 border-foreground rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_var(--foreground)]">
                <div className="flex items-center gap-1.5 bg-secondary border-b-2 border-foreground px-3 py-1.5">
                  <IconCode className="h-3.5 w-3.5 text-foreground" />
                  <span className="font-mono text-[9px] font-bold uppercase text-foreground">
                    soyupwork-console-debugger v1.0
                  </span>
                </div>
                <div className="bg-background p-3 font-mono text-[10px] text-foreground overflow-x-auto max-h-42 space-y-2">
                  <div>
                    <span className="text-destructive font-bold">
                      $ error_message:{" "}
                    </span>
                    <span className="text-foreground">
                      {error.message || "Unknown error occurred"}
                    </span>
                  </div>
                  {error.stack && (
                    <div>
                      <span className="text-muted-foreground font-bold">
                        $ stack_trace:
                      </span>
                      <pre className="mt-1 text-[9px] text-muted-foreground leading-normal whitespace-pre-wrap">
                        {error.stack.split("\n").slice(0, 3).join("\n")}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>

          {/* Action Row */}
          <CardFooter className="mt-4 flex flex-col gap-2 border-t-2 border-destructive bg-muted/30 p-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:p-6">
            <Button
              onClick={() => reset()}
              variant="destructive"
              size="lg"
              className="w-full border-destructive bg-destructive text-destructive-foreground sm:w-auto"
            >
              <IconRefresh className="mr-2 h-4 w-4" />
              Intentar de nuevo
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/">
                <IconHome className="mr-2 h-4 w-4" />
                Ir al inicio
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/dashboard">
                <IconLayoutDashboard className="mr-2 h-4 w-4" />
                Panel
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
