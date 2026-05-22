"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IconAlertTriangle, IconRefresh, IconHome, IconLayoutDashboard, IconCode, IconTerminal, IconShield } from "@tabler/icons-react"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="flex min-h-[85vh] w-full flex-col items-center justify-center p-4 md:p-8">
      {/* Grid background pattern without gradients */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 dark:opacity-20" />

      <div className="w-full max-w-xl space-y-6">
        <Card className="relative overflow-hidden border-2 border-destructive bg-card shadow-[4px_4px_0px_0px_var(--destructive)] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--destructive)]">
          
          {/* Header Banner representing a Contract Dispute / Tech Alert */}
          <div className="flex items-center justify-between border-b-2 border-destructive bg-destructive/10 px-4 py-2 text-destructive">
            <div className="flex items-center gap-2">
              <IconShield className="h-4 w-4 animate-bounce" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                ALERTA: CONTRATO INTERRUMPIDO
              </span>
            </div>
            <div className="font-mono text-[10px]">
              TICKET: #{error.digest?.slice(0, 8) || "SYSTEM_CRASH"}
            </div>
          </div>

          <CardHeader className="p-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-destructive">
                  <span className="bg-destructive/15 border border-destructive/30 px-2 py-0.5 rounded">RUNTIME_CRASH</span>
                  <span className="bg-muted border border-border px-2 py-0.5 rounded">Acción Requerida</span>
                </div>
                <CardTitle className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground pt-1.5">
                  {title}
                </CardTitle>
              </div>
              <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-destructive bg-background text-destructive shadow-[2px_2px_0px_0px_var(--destructive)]">
                <IconAlertTriangle className="h-6 w-6" stroke={2} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-0">
            {/* Warning Message Box */}
            <div className="border-2 border-dashed border-destructive/40 bg-destructive/5 rounded-lg p-4 my-2 text-xs">
              <div className="flex items-start gap-2.5">
                <IconTerminal className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                <div className="space-y-2">
                  <p className="font-mono text-[10px] font-bold uppercase text-destructive">DETALLES DE LA INTERRUPCIÓN:</p>
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
                  <span className="font-mono text-[9px] font-bold uppercase text-foreground">soyupwork-console-debugger v1.0</span>
                </div>
                <div className="bg-background p-3 font-mono text-[10px] text-foreground overflow-x-auto max-h-42 space-y-2">
                  <div>
                    <span className="text-destructive font-bold">$ error_message: </span>
                    <span className="text-foreground">{error.message || "Unknown error occurred"}</span>
                  </div>
                  {error.stack && (
                    <div>
                      <span className="text-muted-foreground font-bold">$ stack_trace:</span>
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
          <CardFooter className="flex flex-col sm:flex-row items-center justify-end gap-3 border-t-2 border-destructive bg-muted/30 p-6 mt-6">
            <Button
              onClick={() => reset()}
              variant="default"
              size="lg"
              className="w-full sm:w-auto border-2 border-destructive bg-destructive text-destructive-foreground shadow-[2px_2px_0px_0px_var(--destructive)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--destructive)] active:translate-y-[2px] transition-all"
            >
              <IconRefresh className="mr-2 h-4 w-4" />
              Intentar de nuevo
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-foreground bg-background text-foreground shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-y-[2px] transition-all"
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
              className="w-full sm:w-auto border border-transparent hover:border-foreground hover:bg-secondary transition-all"
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
