"use client";

import {
  AdminFilterField,
  adminFilterSelectTriggerClass,
} from "@/components/admin/listing/admin-filter-field";
import { AdminCardGrid } from "@/components/admin/listing/admin-card-grid";
import { AdminListingPanel } from "@/components/admin/listing/admin-listing-panel";
import { AdminToolbar } from "@/components/admin/listing/admin-toolbar";
import { EmptyState } from "@/components/admin/listing/empty-state";
import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { ADMIN_LISTING_VIEW } from "@/constants/admin-listing.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import { formatDashboardDate } from "@/lib/admin/formatters";
import {
  adminBrutalButtonClass,
  adminPanelClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type {
  AdminCohortsPageData,
  AdminCohortStatus,
} from "@/types/admin-cohorts.types";
import type { AdminActiveFilter } from "@/types/admin-listing.types";
import { Calendar, Lightbulb, Users } from "lucide-react";
import { useMemo } from "react";

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

const STATUS_FILTER_ALL = "ALL";

const STATUS_OPTIONS = [
  { value: STATUS_FILTER_ALL, label: "Todos" },
  { value: "OPEN", label: "Abiertas" },
  { value: "CLOSED", label: "Cerradas" },
  { value: "FINISHED", label: "Finalizadas" },
] as const;

function cohortStatusLabel(status: AdminCohortStatus): string {
  if (status === "OPEN") return "Inscripciones abiertas";
  if (status === "CLOSED") return "Cerrado";
  return "Finalizado";
}

type AdminCohortsDashboardProps = {
  data: AdminCohortsPageData;
};

export function AdminCohortsDashboard({ data }: AdminCohortsDashboardProps) {
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

  const filterStatus = data.filters.status;
  const cohorts = data.cohorts;
  const hasActiveFilters =
    data.filters.q.length > 0 || filterStatus !== STATUS_FILTER_ALL;

  const activeFiltersCount = filterStatus !== STATUS_FILTER_ALL ? 1 : 0;

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

  return (
    <div className="space-y-6">
      <AdminDashboardPageHeader
        eyebrow="Panel de administración"
        icon={<Users className="size-4 text-primary" aria-hidden />}
        title="Cohortes y Grupos"
        description="Calendarios de estudio y mentorías grupales."
      />

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
            Gestión de cohortes basada en datos reales
          </h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Esta vista se construye desde cursos, estado de publicación y
            matrículas activas/completadas en la base de datos.
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
          data.pagination.totalCount === 1
            ? "1 cohorte encontrada"
            : `${data.pagination.totalCount} cohortes encontradas`
        }
      />

      {cohorts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin cohortes"
          description="Creá cohortes para organizar mentorías grupales con fechas de inicio."
          hasFilters={hasActiveFilters}
          onClearFilters={
            hasActiveFilters ? () => clearParams(["status", "q"]) : undefined
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
                  Detalle
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cohorts.map((cohort) => {
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
                        {formatDashboardDate(cohort.startDate)}
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
                      <span className="font-mono text-[10px] text-muted-foreground uppercase">
                        Solo lectura
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </AdminListingPanel>
      ) : (
        <AdminCardGrid columns="wide">
          {cohorts.map((cohort) => {
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
                      variant={cohort.status === "OPEN" ? "default" : "outline"}
                      className="font-mono text-[9px] uppercase"
                    >
                      {cohortStatusLabel(cohort.status)}
                    </Badge>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                      <Calendar className="size-3" aria-hidden />
                      {formatDashboardDate(cohort.startDate)}
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

                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    adminBrutalButtonClass,
                    "w-full font-mono text-[10px] font-bold uppercase",
                  )}
                  disabled
                >
                  Solo lectura
                </Button>
              </article>
            );
          })}
        </AdminCardGrid>
      )}
    </div>
  );
}
