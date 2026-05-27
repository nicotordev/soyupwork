"use client";

import { AdminCardGrid } from "@/components/admin/listing/admin-card-grid";
import {
  AdminFilterField,
  adminFilterSelectTriggerClass,
} from "@/components/admin/listing/admin-filter-field";
import { AdminListingPanel } from "@/components/admin/listing/admin-listing-panel";
import { AdminToolbar } from "@/components/admin/listing/admin-toolbar";
import { EmptyState } from "@/components/admin/listing/empty-state";
import { AdminDashboardPageHeader } from "@/components/common/admin-dashboard-page-header";
import { ADMIN_LISTING_VIEW } from "@/constants/admin-listing.constants";
import { useAdminListingParams } from "@/hooks/use-admin-listing-params";
import { formatDashboardDate } from "@/lib/admin/formatters";
import { adminPanelClass, adminPanelTitleClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import type { AdminSalesPageData } from "@/types/admin-sales.types";
import type { AdminActiveFilter } from "@/types/admin-listing.types";
import { Receipt } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
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

type OrderStatus = "PAID" | "PENDING" | "REFUNDED" | "FAILED" | "CANCELLED";

const STATUS_OPTIONS = [
  { value: STATUS_FILTER_ALL, label: "Todos" },
  { value: "PAID", label: "Cobrados" },
  { value: "PENDING", label: "Pendientes" },
  { value: "REFUNDED", label: "Reembolsados" },
  { value: "FAILED", label: "Fallidos" },
  { value: "CANCELLED", label: "Cancelados" },
] as const;

function statusLabel(status: OrderStatus): string {
  if (status === "PAID") return "Cobrado";
  if (status === "PENDING") return "Pendiente";
  if (status === "REFUNDED") return "Reembolsado";
  if (status === "CANCELLED") return "Cancelado";
  return "Fallido";
}

function statusBadgeVariant(status: OrderStatus) {
  if (status === "PAID") return "default" as const;
  if (status === "PENDING") return "secondary" as const;
  if (status === "REFUNDED") return "secondary" as const;
  if (status === "FAILED") return "destructive" as const;
  if (status === "CANCELLED") return "destructive" as const;
  return "destructive" as const;
}

type AdminSalesDashboardProps = {
  data: AdminSalesPageData;
};

export function AdminSalesDashboard({ data }: AdminSalesDashboardProps) {
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

  const filteredSales = useMemo(() => {
    const q = localQuery.trim().toLowerCase();
    return data.orders.filter((s) => {
      const matchesSearch =
        !q ||
        s.customer.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q);
      const matchesStatus =
        filterStatus === STATUS_FILTER_ALL || s.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [data.orders, localQuery, filterStatus]);

  const hasActiveFilters =
    localQuery.trim().length > 0 || filterStatus !== STATUS_FILTER_ALL;

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

  const resultSummary =
    filteredSales.length === 1
      ? "1 pedido encontrado"
      : `${filteredSales.length} pedidos encontrados`;

  return (
    <div className="space-y-6">
      <AdminDashboardPageHeader
        eyebrow="Panel de administración"
        icon={<Receipt className="size-4 text-primary" aria-hidden />}
        title="Ventas y Cobros"
        description="Seguimiento de pedidos, suscripciones e integraciones."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div
          className={cn(
            adminPanelClass,
            "border-emerald-500 bg-emerald-500/10 p-4",
          )}
        >
          <p className={adminPanelTitleClass}>Ingresos de Ventas</p>
          <p className="mt-2 font-heading text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
            ${data.stats.totalRevenue.toLocaleString("es-CL")}
          </p>
        </div>
        <div className={cn(adminPanelClass, "bg-card p-4")}>
          <p className={adminPanelTitleClass}>Pedidos Procesados</p>
          <p className="mt-2 font-heading text-2xl font-extrabold">
            {data.stats.processedOrders}
          </p>
        </div>
        <div className={cn(adminPanelClass, "bg-destructive/5 p-4")}>
          <p className={adminPanelTitleClass}>Reembolsos / Fallidos</p>
          <p className="mt-2 font-heading text-2xl font-extrabold">
            {data.stats.failedOrRefundedOrders}
          </p>
        </div>
      </div>

      <AdminToolbar
        isPending={isPending}
        search={{
          value: localQuery,
          onChange: setLocalQuery,
          placeholder: "Buscar por cliente, curso o ID...",
          ariaLabel: "Buscar pedidos",
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
        resultSummary={resultSummary}
      />

      {filteredSales.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Sin pedidos"
          description="Los pedidos procesados por Stripe aparecerán en este listado."
          hasFilters={hasActiveFilters}
          onClearFilters={
            hasActiveFilters ? () => clearParams(["status", "q"]) : undefined
          }
        />
      ) : viewMode === ADMIN_LISTING_VIEW.TABLE ? (
        <AdminListingPanel
          title="Libro de cobros"
          description="Monitoreo transaccional de pasarela"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-foreground/20 hover:bg-transparent">
                <TableHead className="font-mono text-[10px] uppercase">
                  ID
                </TableHead>
                <TableHead className="font-mono text-[10px] uppercase">
                  Cliente / Curso
                </TableHead>
                <TableHead className="font-mono text-[10px] uppercase">
                  Monto
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
              {filteredSales.map((sale) => (
                <TableRow
                  key={sale.id}
                  className="border-foreground/15 text-xs"
                >
                  <TableCell className="font-mono font-bold">
                    {sale.id}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{sale.customer}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {sale.course}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-bold">
                    ${sale.amount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusBadgeVariant(sale.status)}
                      className="font-mono text-[9px] uppercase"
                    >
                      {statusLabel(sale.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">
                      —
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminListingPanel>
      ) : (
        <>
          <AdminListingPanel
            title="Vista de tarjetas"
            description="Pedidos filtrados"
            className="border-b-0 rounded-b-none pb-0"
          />
          <AdminCardGrid columns="wide" className="mb-6">
            {filteredSales.map((sale) => (
              <article
                key={sale.id}
                role="listitem"
                className={cn(
                  adminPanelClass,
                  "flex flex-col overflow-hidden p-0 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--foreground)]",
                )}
              >
                <div className="border-b-2 border-foreground bg-muted/40 p-4">
                  <p className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    {sale.id}
                  </p>
                  <p className="font-heading text-sm font-extrabold">
                    {sale.customer}
                  </p>
                  <p className="text-xs text-muted-foreground">{sale.course}</p>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground uppercase">
                      Monto
                    </span>
                    <span className="font-extrabold text-primary">
                      ${sale.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground uppercase">
                      Fecha
                    </span>
                    <span>{formatDashboardDate(sale.date)}</span>
                  </div>
                  <Badge
                    variant={statusBadgeVariant(sale.status)}
                    className="w-fit font-mono text-[9px] uppercase"
                  >
                    {statusLabel(sale.status)}
                  </Badge>
                </div>
                {sale.status === "PAID" ? (
                  <div className="border-t-2 border-foreground bg-muted p-2">
                    <p className="font-mono text-[10px] text-muted-foreground uppercase">
                      Sin acciones disponibles
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </AdminCardGrid>
        </>
      )}
    </div>
  );
}
