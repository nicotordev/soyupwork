"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconUsersGroup,
  IconCalendar,
  IconPlus,
  IconCheck,
  IconLock,
  IconLockOpen,
  IconBulb,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  adminBrutalButtonClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/dashboard-styles";
import { cn } from "@/lib/utils";

type Cohort = {
  id: string;
  name: string;
  startDate: string;
  studentsCount: number;
  maxStudents: number;
  status: "OPEN" | "CLOSED" | "FINISHED";
  instructor: string;
};

const INITIAL_COHORTS: Cohort[] = [
  {
    id: "coh_1",
    name: "Cohorte Mayo 2026 - Acelerador Upwork",
    startDate: "2026-05-15",
    studentsCount: 28,
    maxStudents: 30,
    status: "OPEN",
    instructor: "Valentina Gómez",
  },
  {
    id: "coh_2",
    name: "Cohorte Junio 2026 - Propuestas Técnicas",
    startDate: "2026-06-01",
    studentsCount: 12,
    maxStudents: 25,
    status: "OPEN",
    instructor: "Esteban Altamirano",
  },
  {
    id: "coh_3",
    name: "Cohorte Abril 2026 - Freelance Masterclass",
    startDate: "2026-04-10",
    studentsCount: 40,
    maxStudents: 40,
    status: "FINISHED",
    instructor: "Valentina Gómez",
  },
];

export function AdminCohortsDashboard() {
  const [cohorts, setCohorts] = useState<Cohort[]>(INITIAL_COHORTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addStudent = (cohortId: string) => {
    setCohorts((prev) =>
      prev.map((c) => {
        if (c.id === cohortId) {
          if (c.studentsCount >= c.maxStudents) {
            triggerToast(`La cohorte ${c.name} ya está llena.`);
            return c;
          }
          triggerToast(`Estudiante inscrito en ${c.name}`);
          return { ...c, studentsCount: c.studentsCount + 1 };
        }
        return c;
      })
    );
  };

  const toggleStatus = (cohortId: string) => {
    setCohorts((prev) =>
      prev.map((c) => {
        if (c.id === cohortId) {
          const nextStatus = c.status === "OPEN" ? "CLOSED" : "OPEN";
          triggerToast(`Inscripciones para ${c.name} ahora están: ${nextStatus}`);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 border-2 border-foreground bg-secondary px-4 py-2.5 font-mono text-xs font-bold uppercase shadow-[4px_4px_0px_0px_var(--foreground)]"
          >
            <IconCheck className="size-4 text-emerald-600" stroke={3} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro info box */}
      <div className={cn(adminPanelClass, "p-5 bg-secondary/10 flex items-start gap-4")}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded border-2 border-foreground bg-background shadow-[3px_3px_0px_0px_var(--foreground)]">
          <IconBulb className="size-6 text-primary" stroke={2.5} />
        </span>
        <div className="space-y-1.5">
          <h4 className="font-heading text-sm font-extrabold">Gestión de Cohortes e Inscripción Conjunta</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Las cohortes te permiten agrupar a tus alumnos en clases con fechas de inicio específicas para mentorías grupales, desafíos semanales en vivo y foros privados exclusivos.
          </p>
        </div>
      </div>

      {/* Cohorts grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {cohorts.map((cohort) => {
          const fillPercentage = Math.min((cohort.studentsCount / cohort.maxStudents) * 100, 100);

          return (
            <article key={cohort.id} className={cn(adminPanelClass, "flex flex-col justify-between bg-card p-5 space-y-4")}>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={cohort.status === "OPEN" ? "default" : "outline"} className="font-mono text-[9px] uppercase">
                    {cohort.status === "OPEN" ? "Inscripciones abiertas" : cohort.status === "CLOSED" ? "Cerrado" : "Finalizado"}
                  </Badge>
                  <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                    <IconCalendar className="size-3" />
                    Inicia: {cohort.startDate}
                  </span>
                </div>
                
                <h3 className="font-heading text-base font-extrabold tracking-tight">
                  {cohort.name}
                </h3>

                <p className="text-xs text-muted-foreground">
                  Instructor: <strong>{cohort.instructor}</strong>
                </p>
              </div>

              {/* Progress capacity bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10px] font-bold uppercase">
                  <span>Capacidad de Alumnos</span>
                  <span>{cohort.studentsCount} / {cohort.maxStudents}</span>
                </div>
                <div className="h-4 border-2 border-foreground bg-background rounded-full overflow-hidden">
                  <div
                    style={{ width: `${fillPercentage}%` }}
                    className="h-full bg-primary border-r-2 border-foreground transition-all duration-500 ease-out"
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-foreground/15">
                {cohort.status !== "FINISHED" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addStudent(cohort.id)}
                      className={cn(adminBrutalButtonClass, "flex-1 text-[10px] font-mono font-bold uppercase")}
                    >
                      <IconPlus className="size-3.5 mr-1" />
                      Inscribir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(cohort.id)}
                      className={cn(adminBrutalButtonClass, "text-[10px] font-mono font-bold uppercase")}
                      title="Abrir/Cerrar Inscripciones"
                    >
                      {cohort.status === "OPEN" ? (
                        <IconLock className="size-3.5" />
                      ) : (
                        <IconLockOpen className="size-3.5" />
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center w-full font-mono text-[10px] font-bold uppercase text-muted-foreground py-1 bg-muted/20 border border-dashed border-foreground/20 rounded">
                    Clase completada
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
