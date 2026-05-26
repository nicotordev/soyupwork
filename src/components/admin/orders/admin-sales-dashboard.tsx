"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconReceipt,
  IconSearch,
  IconArrowRight,
  IconRefresh,
  IconCheck,
  IconCurrencyDollar,
  IconLoader,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  adminBrutalButtonClass,
  adminInputClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/dashboard-styles";
import { cn } from "@/lib/utils";

type SalesOrder = {
  id: string;
  customer: string;
  course: string;
  amount: number;
  status: "PAID" | "PENDING" | "REFUNDED" | "FAILED";
  date: string;
};

const INITIAL_SALES: SalesOrder[] = [
  {
    id: "ord_1001",
    customer: "María González",
    course: "Ventas B2B en Upwork",
    amount: 149,
    status: "PAID",
    date: "2026-05-26 08:32",
  },
  {
    id: "ord_1002",
    customer: "Lucas Pérez",
    course: "Propuestas que convierten",
    amount: 89,
    status: "PAID",
    date: "2026-05-25 19:12",
  },
  {
    id: "ord_1003",
    customer: "Ana Ruiz",
    course: "Freelance desde cero",
    amount: 199,
    status: "PENDING",
    date: "2026-05-25 15:00",
  },
  {
    id: "ord_1004",
    customer: "Diego Martín",
    course: "Portafolio para clientes",
    amount: 79,
    status: "PAID",
    date: "2026-05-24 11:22",
  },
  {
    id: "ord_1005",
    customer: "Sofía Lima",
    course: "Ventas B2B en Upwork",
    amount: 149,
    status: "FAILED",
    date: "2026-05-23 14:05",
  },
];

export function AdminSalesDashboard() {
  const [sales, setSales] = useState<SalesOrder[]>(INITIAL_SALES);
  const [query, setQuery] = useState("");
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const totalRevenue = sales
    .filter((s) => s.status === "PAID")
    .reduce((acc, s) => acc + s.amount, 0);

  const handleRefund = (orderId: string) => {
    setRefundingId(orderId);
    
    // Simulate Stripe refund API delay
    setTimeout(() => {
      setSales((prev) =>
        prev.map((s) => (s.id === orderId ? { ...s, status: "REFUNDED" } : s))
      );
      setRefundingId(null);
    }, 1500);
  };

  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.customer.toLowerCase().includes(query.toLowerCase()) ||
      s.course.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Dynamic Stripe Simulator Overlay */}
      <AnimatePresence>
        {refundingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <div className={cn(adminPanelClass, "p-8 max-w-sm bg-background border-2 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] text-center space-y-4")}>
              <IconLoader className="size-10 animate-spin text-primary mx-auto" stroke={2.5} />
              <div className="space-y-2">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Stripe Payment gateway
                </p>
                <h4 className="font-heading text-sm font-extrabold">Reembolsando Pedido {refundingId}...</h4>
                <p className="text-[11px] text-muted-foreground">
                  Comunicándose con las API de Stripe para retornar fondos y cancelar acceso del alumno.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top metrics bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={cn(adminPanelClass, "p-4 bg-emerald-500/10 border-emerald-500")}>
          <p className={adminPanelTitleClass}>Ingresos de Ventas</p>
          <p className="mt-2 font-heading text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
            ${totalRevenue.toLocaleString("es-CL")}
          </p>
          <p className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Cobrado con éxito</p>
        </div>
        <div className={cn(adminPanelClass, "p-4 bg-card")}>
          <p className={adminPanelTitleClass}>Pedidos Procesados</p>
          <p className="mt-2 font-heading text-2xl font-extrabold">
            {sales.filter((s) => s.status !== "PENDING").length} pedidos
          </p>
          <p className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Stripe Checkout sessions</p>
        </div>
        <div className={cn(adminPanelClass, "p-4 bg-destructive/5")}>
          <p className={adminPanelTitleClass}>Reembolsos / Fallidos</p>
          <p className="mt-2 font-heading text-2xl font-extrabold">
            {sales.filter((s) => s.status === "REFUNDED" || s.status === "FAILED").length} transacciones
          </p>
          <p className="font-mono text-[9px] text-muted-foreground uppercase mt-1">Tasa de contracargo</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className={cn(adminPanelClass, "p-4 bg-background")}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 flex-1">
            <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" stroke={2.25} />
            <Input
              type="search"
              placeholder="Buscar por cliente, curso o ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(adminInputClass, "h-9 pl-8 font-mono text-xs")}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "PAID", "PENDING", "REFUNDED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={cn(
                  "px-3 py-1 font-mono text-[10px] font-extrabold uppercase border-2 border-foreground rounded transition-all shadow-[2px_2px_0px_0px_var(--foreground)] active:translate-y-px",
                  filterStatus === st ? "bg-secondary text-foreground" : "bg-background text-muted-foreground"
                )}
              >
                {st === "ALL" ? "Todos" : st === "PAID" ? "Cobrados" : st === "PENDING" ? "Pendientes" : "Reembolsados"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sales log */}
      <div className={cn(adminPanelClass, "overflow-hidden")}>
        <div className={adminPanelHeaderClass}>
          <div>
            <h2 className={adminPanelTitleClass}>Libro de Cobros</h2>
            <p className="text-[10px] text-muted-foreground">Monitoreo transaccional de pasarela</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-foreground/20 bg-muted/20 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">ID Pedido</th>
                <th className="px-4 py-3">Cliente / Curso</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Estado Pasarela</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="text-xs transition-colors hover:bg-muted/15">
                  <td className="px-4 py-3 font-mono font-bold">{sale.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{sale.customer}</div>
                    <div className="text-[10px] text-muted-foreground">{sale.course}</div>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold">${sale.amount}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        sale.status === "PAID"
                          ? "default"
                          : sale.status === "PENDING"
                          ? "secondary"
                          : "destructive"
                      }
                      className="font-mono text-[9px] uppercase"
                    >
                      {sale.status === "PAID"
                        ? "Cobrado"
                        : sale.status === "PENDING"
                        ? "Pendiente"
                        : sale.status === "REFUNDED"
                        ? "Reembolsado"
                        : "Fallido"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {sale.status === "PAID" ? (
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleRefund(sale.id)}
                        className={cn(adminBrutalButtonClass, "text-[9px] font-mono hover:bg-destructive/10")}
                      >
                        <IconRefresh className="size-3 mr-1" />
                        Reembolso
                      </Button>
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
