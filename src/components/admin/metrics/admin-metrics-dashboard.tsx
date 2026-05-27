"use client";

import { AdminCardGrid } from "@/components/admin/listing/admin-card-grid";
import { AdminListingPanel } from "@/components/admin/listing/admin-listing-panel";
import { AdminToolbar } from "@/components/admin/listing/admin-toolbar";
import { EmptyState } from "@/components/admin/listing/empty-state";
import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { ADMIN_LISTING_VIEW } from "@/constants/admin-listing.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import {
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BarChart4,
  Eye,
  Lightbulb,
  MousePointerClick,
  Receipt,
  Award,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FunnelStage = {
  id: string;
  name: string;
  count: number;
  percentage: number;
  description: string;
  color: string;
  icon: LucideIcon;
};

const STAGES: FunnelStage[] = [
  {
    id: "stage-1",
    name: "Visitas al Catálogo",
    count: 12500,
    percentage: 100,
    description: "Estudiantes potenciales que buscan cursos.",
    color: "bg-primary",
    icon: Eye,
  },
  {
    id: "stage-2",
    name: "Clicks en Detalles",
    count: 6200,
    percentage: 49.6,
    description: "Usuarios interesados en la currícula de un curso.",
    color: "bg-secondary",
    icon: MousePointerClick,
  },
  {
    id: "stage-3",
    name: "Pedidos Iniciados",
    count: 1800,
    percentage: 14.4,
    description: "Estudiantes que ingresan datos de pago.",
    color: "bg-amber-400",
    icon: Receipt,
  },
  {
    id: "stage-4",
    name: "Ventas Completadas",
    count: 240,
    percentage: 1.92,
    description: "Alumnos con acceso activo al curso.",
    color: "bg-emerald-400",
    icon: Award,
  },
];

export function AdminMetricsDashboard() {
  const [selectedStage, setSelectedStage] = useState<FunnelStage>(STAGES[0]!);
  const { localQuery, setLocalQuery, viewMode, setViewMode, isPending } =
    useAdminListingParams({ resetPageOnChange: false });

  const filteredStages = useMemo(() => {
    const q = localQuery.trim().toLowerCase();
    if (!q) return STAGES;
    return STAGES.filter(
      (stage) =>
        stage.name.toLowerCase().includes(q) ||
        stage.description.toLowerCase().includes(q),
    );
  }, [localQuery]);

  const hasActiveFilters = localQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      <AdminDashboardPageHeader
        eyebrow="Panel de administración"
        icon={<BarChart3 className="size-4 text-primary" aria-hidden />}
        title="Métricas y Analíticas"
        description="Embudos de conversión y retención del estudiante."
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <div className={cn(adminPanelClass, "bg-card p-4")}>
          <p className={adminPanelTitleClass}>Tasa de Conversión</p>
          <p className="mt-2 font-heading text-2xl font-extrabold text-primary">
            1.92%
          </p>
        </div>
        <div className={cn(adminPanelClass, "bg-card p-4")}>
          <p className={adminPanelTitleClass}>Retención del Checkout</p>
          <p className="mt-2 font-heading text-2xl font-extrabold">13.3%</p>
        </div>
        <div className={cn(adminPanelClass, "bg-card p-4")}>
          <p className={adminPanelTitleClass}>Tiempo de decisión</p>
          <p className="mt-2 font-heading text-2xl font-extrabold">4.8 hrs</p>
        </div>
        <div
          className={cn(
            adminPanelClass,
            "border-emerald-500 bg-emerald-500/10 p-4",
          )}
        >
          <p className={adminPanelTitleClass}>LTV Estudiante</p>
          <p className="mt-2 font-heading text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
            $185 USD
          </p>
        </div>
      </div>

      <AdminToolbar
        isPending={isPending}
        search={{
          value: localQuery,
          onChange: setLocalQuery,
          placeholder: "Buscar paso del embudo...",
          ariaLabel: "Buscar métricas",
        }}
        view={{ mode: viewMode, onChange: setViewMode }}
        resultSummary={
          filteredStages.length === 1
            ? "1 paso encontrado"
            : `${filteredStages.length} pasos del embudo`
        }
      />

      {filteredStages.length === 0 ? (
        <EmptyState
          icon={BarChart4}
          title="Sin pasos"
          description="Ajustá la búsqueda para ver etapas del embudo."
          hasFilters={hasActiveFilters}
          onClearFilters={
            hasActiveFilters ? () => setLocalQuery("") : undefined
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {viewMode === ADMIN_LISTING_VIEW.TABLE ? (
            <AdminListingPanel
              title="Embudo de conversión"
              description="Vista tabular por etapa"
              className="md:col-span-2"
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-foreground/20 hover:bg-transparent">
                    <TableHead className="font-mono text-[10px] uppercase">
                      Paso
                    </TableHead>
                    <TableHead className="font-mono text-[10px] uppercase">
                      Volumen
                    </TableHead>
                    <TableHead className="font-mono text-[10px] uppercase">
                      %
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStages.map((stage, idx) => {
                    const Icon = stage.icon;
                    const isSelected = selectedStage.id === stage.id;
                    return (
                      <TableRow
                        key={stage.id}
                        className={cn(
                          "cursor-pointer border-foreground/15",
                          isSelected && "bg-muted/30",
                        )}
                        onClick={() => setSelectedStage(stage)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="flex size-5 items-center justify-center rounded-full bg-foreground font-mono text-[8px] text-background">
                              {idx + 1}
                            </span>
                            <Icon className="size-4 text-primary" aria-hidden />
                            <span className="text-xs font-semibold">
                              {stage.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs font-bold">
                          {stage.count.toLocaleString("es-CL")}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {stage.percentage}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </AdminListingPanel>
          ) : (
            <div className={cn(adminPanelClass, "space-y-4 p-5 md:col-span-2")}>
              <div className="flex items-center gap-2 border-b-2 border-foreground/10 pb-2">
                <BarChart3 className="size-5 text-primary" aria-hidden />
                <h3 className="font-heading font-mono text-sm font-extrabold uppercase">
                  Embudo de adquisición
                </h3>
              </div>
              <AdminCardGrid columns="compact" className="gap-3">
                {filteredStages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isSelected = selectedStage.id === stage.id;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => setSelectedStage(stage)}
                      className={cn(
                        "rounded-lg border-2 border-foreground bg-card p-3 text-left shadow-[3px_3px_0px_0px_var(--foreground)] transition-all hover:-translate-x-px hover:-translate-y-px",
                        isSelected && "ring-2 ring-primary ring-offset-2",
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between text-[10px] font-mono font-bold uppercase">
                        <span className="flex items-center gap-1">
                          <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-[8px] text-background">
                            {idx + 1}
                          </span>
                          {stage.name}
                        </span>
                        <span className="text-muted-foreground">
                          {stage.percentage}%
                        </span>
                      </div>
                      <div className="flex h-8 overflow-hidden rounded border-2 border-foreground bg-muted/20">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stage.percentage}%` }}
                          className={cn(
                            "flex h-full items-center gap-1 px-2 font-mono text-[10px] font-bold uppercase",
                            stage.color,
                          )}
                        >
                          <Icon className="size-3.5 shrink-0" aria-hidden />
                        </motion.div>
                      </div>
                    </button>
                  );
                })}
              </AdminCardGrid>
            </div>
          )}

          <div className={cn(adminPanelClass, "flex flex-col justify-between p-5")}>
            <div className="space-y-4">
              <div className={adminPanelHeaderClass}>
                <h4 className={adminPanelTitleClass}>Análisis del paso</h4>
              </div>
              <div className="space-y-2">
                <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Paso seleccionado
                </span>
                <h3 className="font-heading text-lg font-extrabold tracking-tight">
                  {selectedStage.name}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {selectedStage.description}
                </p>
              </div>
              <div className="space-y-2 border-t border-foreground/15 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Miembros totales</span>
                  <strong className="font-mono">
                    {selectedStage.count.toLocaleString("es-CL")}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Porcentaje</span>
                  <strong className="font-mono">
                    {selectedStage.percentage}%
                  </strong>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded border-2 border-foreground bg-secondary/15 p-3 text-[11px] text-muted-foreground">
              <Lightbulb
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <p>
                <strong>Recomendación:</strong> Optimizá testimonios y
                descripción del curso para mejorar la conversión en este paso.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
