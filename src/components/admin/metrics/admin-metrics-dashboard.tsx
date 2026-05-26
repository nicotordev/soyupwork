"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  IconChartBar,
  IconEye,
  IconClick,
  IconReceipt,
  IconCertificate,
  IconBulb,
} from "@tabler/icons-react";
import {
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";

type FunnelStage = {
  id: string;
  name: string;
  count: number;
  percentage: number;
  description: string;
  color: string;
  icon: any;
};

const STAGES: FunnelStage[] = [
  {
    id: "stage-1",
    name: "Visitas al Catálogo",
    count: 12500,
    percentage: 100,
    description: "Estudiantes potenciales que buscan cursos.",
    color: "bg-primary",
    icon: IconEye,
  },
  {
    id: "stage-2",
    name: "Clicks en Detalles",
    count: 6200,
    percentage: 49.6,
    description: "Usuarios interesados en la currícula de un curso.",
    color: "bg-secondary",
    icon: IconClick,
  },
  {
    id: "stage-3",
    name: "Pedidos Iniciados",
    count: 1800,
    percentage: 14.4,
    description: "Estudiantes que ingresan su cupón o datos de pago.",
    color: "bg-amber-400",
    icon: IconReceipt,
  },
  {
    id: "stage-4",
    name: "Ventas Completadas",
    count: 240,
    percentage: 1.92,
    description: "Alumnos con acceso al curso activo en SoyUpwork.",
    color: "bg-emerald-400",
    icon: IconCertificate,
  },
];

export function AdminMetricsDashboard() {
  const [selectedStage, setSelectedStage] = useState<FunnelStage>(STAGES[0]);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className={cn(adminPanelClass, "p-4 bg-card")}>
          <p className={adminPanelTitleClass}>Tasa de Conversión</p>
          <p className="mt-2 font-heading text-2xl font-extrabold text-primary">1.92%</p>
          <p className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Visita a Venta</p>
        </div>
        <div className={cn(adminPanelClass, "p-4 bg-card")}>
          <p className={adminPanelTitleClass}>Retención del Checkout</p>
          <p className="mt-2 font-heading text-2xl font-extrabold">13.3%</p>
          <p className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Pedido a Pago</p>
        </div>
        <div className={cn(adminPanelClass, "p-4 bg-card")}>
          <p className={adminPanelTitleClass}>Tiempo de decisión</p>
          <p className="mt-2 font-heading text-2xl font-extrabold">4.8 hrs</p>
          <p className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Promedio de Alumno</p>
        </div>
        <div className={cn(adminPanelClass, "p-4 bg-emerald-500/10 border-emerald-500")}>
          <p className={adminPanelTitleClass}>LTV Estudiante</p>
          <p className="mt-2 font-heading text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
            $185 USD
          </p>
          <p className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Valor de por vida</p>
        </div>
      </div>

      {/* Main Funnel Visualization & Stage Details */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* SVG Interactive Funnel Grid */}
        <div className={cn(adminPanelClass, "md:col-span-2 p-5 bg-background space-y-4")}>
          <div className="flex items-center gap-2 border-b-2 border-foreground/10 pb-2">
            <IconChartBar className="size-5 text-primary" stroke={2.5} />
            <h3 className="font-heading text-sm font-extrabold uppercase font-mono">
              Embudo de Conversión de Adquisición
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            {STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isSelected = selectedStage.id === stage.id;
              
              // Scale block size corresponding to funnel volume
              const scaleWidth = stage.percentage;

              return (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStage(stage)}
                  className="space-y-1 cursor-pointer group"
                >
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase">
                    <span className="flex items-center gap-1">
                      <span className="size-4 flex items-center justify-center bg-foreground text-background font-mono text-[8px] rounded-full">
                        {idx + 1}
                      </span>
                      {stage.name}
                    </span>
                    <span className="text-muted-foreground">
                      {stage.count.toLocaleString("es-CL")} ({stage.percentage}%)
                    </span>
                  </div>

                  <div className="h-9 border-2 border-foreground bg-muted/20 rounded overflow-hidden flex shadow-[2px_2px_0px_0px_var(--foreground)] transition-all group-hover:translate-x-px group-hover:translate-y-px group-hover:shadow-[1px_1px_0px_0px_var(--foreground)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${scaleWidth}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={cn(
                        "h-full flex items-center px-3 gap-2 text-white font-mono text-[10px] font-bold border-r-2 border-foreground uppercase",
                        stage.color,
                        isSelected && "ring-4 ring-offset-2 ring-primary/45"
                      )}
                    >
                      <Icon className="size-4 shrink-0 text-foreground" stroke={2.5} />
                      <span className="text-foreground truncate">{stage.name}</span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail Panel */}
        <div className={cn(adminPanelClass, "p-5 bg-card flex flex-col justify-between")}>
          <div className="space-y-4">
            <div className={adminPanelHeaderClass}>
              <h4 className={adminPanelTitleClass}>Análisis del Paso</h4>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Paso Seleccionado
              </span>
              <h3 className="font-heading text-lg font-extrabold tracking-tight">
                {selectedStage.name}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedStage.description}
              </p>
            </div>

            <div className="border-t border-foreground/15 pt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Miembros Totales:</span>
                <strong className="font-mono">{selectedStage.count.toLocaleString("es-CL")}</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Porcentaje Relativo:</span>
                <strong className="font-mono">{selectedStage.percentage}%</strong>
              </div>
            </div>
          </div>

          <div className="border-2 border-foreground bg-secondary/15 rounded p-3 text-[11px] text-muted-foreground flex gap-2 items-start mt-4">
            <IconBulb className="size-4 shrink-0 text-primary mt-0.5" stroke={2.5} />
            <div>
              <strong>Recomendación IA:</strong> Para mejorar el paso de detalles a pedido iniciado, optimiza la descripción y añade más testimonios de Upwork.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
