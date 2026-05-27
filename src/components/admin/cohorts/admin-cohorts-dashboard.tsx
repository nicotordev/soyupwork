"use client";

import {
  AdminFilterField,
  adminFilterSelectTriggerClass,
} from "@/components/admin/listing/admin-filter-field";
import { AdminCardGrid } from "@/components/admin/listing/admin-card-grid";
import { AdminListingPanel } from "@/components/admin/listing/admin-listing-panel";
import { AdminTableActions } from "@/components/admin/listing/admin-table-actions";
import { AdminToolbar } from "@/components/admin/listing/admin-toolbar";
import { EmptyState } from "@/components/admin/listing/empty-state";
import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { ADMIN_LISTING_VIEW } from "@/constants/admin-listing.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import {
  adminBrutalButtonClass,
  adminPanelClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { AdminActiveFilter } from "@/types/admin-listing.types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Check,
  Lightbulb,
  Lock,
  LockOpen,
  Plus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "@/lib/toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CohortStatus = "OPEN" | "CLOSED" | "FINISHED";

type Cohort = {
  id: string;
  name: string;
  startDate: string;
  studentsCount: number;
  maxStudents: number;
  status: CohortStatus;
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

const STATUS_FILTER_ALL = "ALL";

const STATUS_OPTIONS = [
  { value: STATUS_FILTER_ALL, label: "Todos" },
  { value: "OPEN", label: "Abiertas" },
  { value: "CLOSED", label: "Cerradas" },
  { value: "FINISHED", label: "Finalizadas" },
] as const;

function cohortStatusLabel(status: CohortStatus): string {
  if (status === "OPEN") return "Inscripciones abiertas";
  if (status === "CLOSED") return "Cerrado";
  return "Finalizado";
}

export function AdminCohortsDashboard() {
  const [cohorts, setCohorts] = useState<Cohort[]>(INITIAL_COHORTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    localQuery,
    setLocalQuery,
    viewMode,
    setViewMode,
    setParam,
    clearParams,
    searchParams,
    isPending,
  } = useAdminListingParams({ resetPageOnChange: false });

  const filterStatus = searchParams.get("status") ?? STATUS_FILTER_ALL;

  const notify = (msg: string) => {
    setToastMessage(msg);
    toast.success(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addStudent = (cohortId: string) => {
    setCohorts((prev) =>
      prev.map((c) => {
        if (c.id !== cohortId) return c;
        if (c.studentsCount >= c.maxStudents) {
          notify(`La cohorte ${c.name} ya está llena.`);
          return c;
        }
        notify(`Estudiante inscrito en ${c.name}`);
        return { ...c, studentsCount: c.studentsCount + 1 };
      }),
    );
  };

  const toggleStatus = (cohortId: string) => {
    setCohorts((prev) =>
      prev.map((c) => {
        if (c.id !== cohortId) return c;
        const nextStatus: CohortStatus =
          c.status === "OPEN" ? "CLOSED" : "OPEN";
        notify(
          `Inscripciones para ${c.name}: ${nextStatus === "OPEN" ? "abiertas" : "cerradas"}`,
        );
        return { ...c, status: nextStatus };
      }),
    );
  };

  const filteredCohorts = useMemo(() => {
    const q = localQuery.trim().toLowerCase();
    return cohorts.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q);
      const matchesStatus =
        filterStatus === STATUS_FILTER_ALL || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [cohorts, localQuery, filterStatus]);

  const hasActiveFilters =
    localQuery.trim().length > 0 || filterStatus !== STATUS_FILTER_ALL;

  const activeFiltersCount =
    filterStatus !== STATUS_FILTER_ALL ? 1 : 0;

  const activeFilterBadges = useMemo((): AdminActiveFilter[] => {
    if (filterStatus === STATUS_FILTER_ALL) return [];
    const label =
      STATUS_OPTIONS.find((o) => o.value === filterStatus)?.label ??
      filterStatus;
    return [
      {
        key: "status",
        label: "Estado",
        value: label,
        onRemove: () => setParam("status", null, STATUS_FILTER_ALL),
      },
    ];
  }, [filterStatus, setParam]);

  const renderCohortActions = (cohort: Cohort) => {
    if (cohort.status === "FINISHED") return [];

    return [
      {
        id: "enroll",
        label: `Inscribir alumno en ${cohort.name}`,
        icon: <Plus className="size-4" aria-hidden />,
        onClick: () => addStudent(cohort.id),
      },
      {
        id: "toggle",
        label:
          cohort.status === "OPEN"
            ? `Cerrar inscripciones de ${cohort.name}`
            : `Abrir inscripciones de ${cohort.name}`,
        icon:
          cohort.status === "OPEN" ? (
            <Lock className="size-4" aria-hidden />
          ) : (
            <LockOpen className="size-4" aria-hidden />
          ),
        onClick: () => toggleStatus(cohort.id),
      },
    ];
  };

  return (
    <div className="space-y-6">
      <AdminDashboardPageHeader
        eyebrow="Panel de administración"
        icon={<Users className="size-4 text-primary" aria-hidden />}
        title="Cohortes y Grupos"
        description="Calendarios de estudio y mentorías grupales."
      />

      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 border-2 border-foreground bg-secondary px-4 py-2.5 font-mono text-xs font-bold uppercase shadow-[4px_4px_0px_0px_var(--foreground)]"
          >
            <Check className="size-4 text-emerald-600" aria-hidden />
            {toastMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div
        className={cn(
          adminPanelClass,
          "flex items-start gap-4 bg-secondary/10 p-5",
        )}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded border-2 border-foreground bg-background shadow-[3px_3px_0px_0px_var(--foreground)]">
          <Lightbulb className="size-6 text-primary" aria-hidden />
        </span>
        <div className="space-y-1.5">
          <h4 className="font-heading text-sm font-extrabold">
            Gestión de cohortes e inscripción conjunta
          </h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Agrupá alumnos en clases con fechas de inicio específicas para
            mentorías grupales y foros privados.
          </p>
        </div>
      </div>

      <AdminToolbar
        isPending={isPending}
        search={{
          value: localQuery,
          onChange: setLocalQuery,
          placeholder: "Buscar cohorte o instructor...",
          ariaLabel: "Buscar cohortes",
        }}
        filters={{
          activeCount: activeFiltersCount,
          hasActiveFilters,
          onClear: () => clearParams(["status", "q"]),
          title: "Filtros",
          children: (
            <AdminFilterField label="Estado">
              <Select
                value={filterStatus}
                onValueChange={(value) =>
                  setParam("status", value, STATUS_FILTER_ALL)
                }
              >
                <SelectTrigger className={adminFilterSelectTriggerClass}>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AdminFilterField>
          ),
        }}
        view={{ mode: viewMode, onChange: setViewMode }}
        activeFilterBadges={activeFilterBadges}
        resultSummary={
          filteredCohorts.length === 1
            ? "1 cohorte encontrada"
            : `${filteredCohorts.length} cohortes encontradas`
        }
      />

      {filteredCohorts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin cohortes"
          description="Creá cohortes para organizar mentorías grupales con fechas de inicio."
          hasFilters={hasActiveFilters}
          onClearFilters={
            hasActiveFilters
              ? () => clearParams(["status", "q"])
              : undefined
          }
        />
      ) : viewMode === ADMIN_LISTING_VIEW.TABLE ? (
        <AdminListingPanel
          title="Listado de cohortes"
          description="Capacidad y estado de inscripción"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-foreground/20 hover:bg-transparent">
                <TableHead className="font-mono text-[10px] uppercase">
                  Cohorte
                </TableHead>
                <TableHead className="hidden font-mono text-[10px] uppercase md:table-cell">
                  Instructor
                </TableHead>
                <TableHead className="font-mono text-[10px] uppercase">
                  Capacidad
                </TableHead>
                <TableHead className="font-mono text-[10px] uppercase">
                  Estado
                </TableHead>
                <TableHead className="text-right font-mono text-[10px] uppercase">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCohorts.map((cohort) => {
                const fill = Math.min(
                  (cohort.studentsCount / cohort.maxStudents) * 100,
                  100,
                );
                return (
                  <TableRow
                    key={cohort.id}
                    className="border-foreground/15 text-xs"
                  >
                    <TableCell>
                      <p className="font-semibold">{cohort.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                        <Calendar className="size-3" aria-hidden />
                        {cohort.startDate}
                      </p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {cohort.instructor}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-bold">
                        {cohort.studentsCount}/{cohort.maxStudents}
                      </span>
                      <div className="mt-1 h-2 w-24 overflow-hidden rounded-full border border-foreground bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${fill}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          cohort.status === "OPEN" ? "default" : "outline"
                        }
                        className="font-mono text-[9px] uppercase"
                      >
                        {cohortStatusLabel(cohort.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {cohort.status === "FINISHED" ? (
                        <span className="font-mono text-[10px] text-muted-foreground uppercase">
                          —
                        </span>
                      ) : (
                        <AdminTableActions
                          actions={renderCohortActions(cohort)}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </AdminListingPanel>
      ) : (
        <AdminCardGrid columns="wide">
          {filteredCohorts.map((cohort) => {
            const fillPercentage = Math.min(
              (cohort.studentsCount / cohort.maxStudents) * 100,
              100,
            );

            return (
              <article
                key={cohort.id}
                role="listitem"
                className={cn(
                  adminPanelClass,
                  "flex flex-col justify-between space-y-4 p-5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)]",
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant={
                        cohort.status === "OPEN" ? "default" : "outline"
                      }
                      className="font-mono text-[9px] uppercase"
                    >
                      {cohortStatusLabel(cohort.status)}
                    </Badge>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                      <Calendar className="size-3" aria-hidden />
                      {cohort.startDate}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-extrabold tracking-tight">
                    {cohort.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Instructor: <strong>{cohort.instructor}</strong>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[10px] font-bold uppercase">
                    <span>Capacidad</span>
                    <span>
                      {cohort.studentsCount} / {cohort.maxStudents}
                    </span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full border-2 border-foreground bg-background">
                    <div
                      style={{ width: `${fillPercentage}%` }}
                      className="h-full border-r-2 border-foreground bg-primary transition-all duration-500"
                    />
                  </div>
                </div>

                {cohort.status !== "FINISHED" ? (
                  <div className="flex items-center gap-2 border-t border-foreground/15 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addStudent(cohort.id)}
                      className={cn(
                        adminBrutalButtonClass,
                        "flex-1 font-mono text-[10px] font-bold uppercase",
                      )}
                    >
                      <Plus className="mr-1 size-3.5" aria-hidden />
                      Inscribir
                    </Button>
                    <AdminTableActions
                      actions={[renderCohortActions(cohort)[1]!]}
                    />
                  </div>
                ) : (
                  <p className="rounded border border-dashed border-foreground/20 bg-muted/20 py-1 text-center font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    Clase completada
                  </p>
                )}
              </article>
            );
          })}
        </AdminCardGrid>
      )}
    </div>
  );
}
