"use client";

import Link from "next/link";
import {
  IconSearchOff,
  IconHome,
  IconLayoutDashboard,
  IconMapPin,
  IconClock,
  IconBriefcase,
  IconCurrencyDollar,
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

interface AppEmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  showDashboardButton?: boolean;
}

export function AppEmptyState({
  title = "No encontramos esta página",
  description = "Puede que el enlace haya cambiado, el contenido ya no exista o todavía no tengas acceso.",
  icon,
  showDashboardButton = true,
}: AppEmptyStateProps) {
  return (
    <div className="flex min-h-[70vh] w-full min-w-0 flex-col items-center justify-center p-4 sm:min-h-[85vh] sm:p-6 md:p-8">
      {/* Decorative Grid Pattern (No gradients, just grid lines) */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-35 sm:bg-[size:4rem_4rem] dark:opacity-20" />

      {/* Main Container */}
      <div className="w-full min-w-0 max-w-xl space-y-6">
        {/* Creative "Upwork Job Post" style mockup card */}
        <Card className="relative overflow-hidden border-2 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--foreground)] transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--foreground)]">
          {/* Top Status Banner */}
          <div className="flex flex-col gap-1.5 border-b-2 border-foreground bg-secondary px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-foreground bg-destructive animate-pulse" />
              <span className="truncate font-mono text-[9px] font-bold uppercase tracking-wide text-foreground sm:text-[10px] sm:tracking-wider">
                ESTADO: PROPUESTA INVALIDA (404)
              </span>
            </div>
            <div className="shrink-0 font-mono text-[9px] text-muted-foreground sm:text-[10px]">
              ID: 0x404_NOT_FOUND
            </div>
          </div>

          <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="space-y-1">
                {/* Meta details resembling an Upwork job post */}
                <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-primary">
                  <span className="bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                    LMS_ROUTE_ERROR
                  </span>
                  <span className="bg-muted border border-border px-2 py-0.5 rounded">
                    Ruta rota
                  </span>
                </div>
                <CardTitle className="pt-1.5 font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
                  {title}
                </CardTitle>
              </div>
              <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-foreground bg-background text-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
                {icon || <IconSearchOff className="h-6 w-6" stroke={2} />}
              </div>
            </div>
          </CardHeader>

          {/* Job Details Meta row */}
          <CardContent className="px-4 py-0 sm:px-6">
            <div className="my-2 grid grid-cols-2 gap-2 border-y-2 border-dashed border-foreground/35 py-3 text-xs sm:grid-cols-4 sm:gap-3 sm:py-4">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <IconCurrencyDollar className="h-4 w-4 shrink-0 text-foreground" />
                <div>
                  <p className="text-[9px] font-bold uppercase text-foreground leading-none">
                    Presupuesto
                  </p>
                  <p className="font-semibold text-foreground">$0 USD</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <IconBriefcase className="h-4 w-4 shrink-0 text-foreground" />
                <div>
                  <p className="text-[9px] font-bold uppercase text-foreground leading-none">
                    Tipo Trabajo
                  </p>
                  <p className="font-semibold text-foreground">Inexistente</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <IconClock className="h-4 w-4 shrink-0 text-foreground" />
                <div>
                  <p className="text-[9px] font-bold uppercase text-foreground leading-none">
                    Expira
                  </p>
                  <p className="font-semibold text-foreground">Inmediato</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <IconMapPin className="h-4 w-4 shrink-0 text-foreground" />
                <div>
                  <p className="text-[9px] font-bold uppercase text-foreground leading-none">
                    Ubicación
                  </p>
                  <p className="font-semibold text-foreground">Ciberespacio</p>
                </div>
              </div>
            </div>

            {/* Main Description */}
            <div className="space-y-3 py-4">
              <p className="font-mono text-[11px] font-bold uppercase text-foreground">
                Descripción del problema:
              </p>
              <CardDescription className="text-xs/relaxed text-foreground md:text-sm/relaxed">
                {description}
              </CardDescription>
            </div>
          </CardContent>

          {/* Action Area */}
          <CardFooter className="flex flex-col gap-2 border-t-2 border-foreground bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:p-6">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/">
                <IconHome className="mr-2 h-4 w-4" />
                Volver al inicio
              </Link>
            </Button>

            {showDashboardButton && (
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/dashboard">
                  <IconLayoutDashboard className="mr-2 h-4 w-4" />
                  Entrar a mi Panel
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
