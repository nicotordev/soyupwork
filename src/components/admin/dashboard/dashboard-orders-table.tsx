import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANTS,
} from "@/constants/dashboard.constants";
import {
  formatDashboardCurrency,
  formatDashboardRelativeTime,
} from "@/lib/admin/formatters";
import {
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import type { DashboardOrder } from "@/types/dashboard.types";
import { IconReceipt } from "@tabler/icons-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DashboardOrdersTableProps = {
  orders: DashboardOrder[];
};

export function DashboardOrdersTable({ orders }: DashboardOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <section
        className={adminPanelClass}
        aria-labelledby="recent-orders-title"
      >
        <div className={adminPanelHeaderClass}>
          <div className="flex items-center gap-2">
            <IconReceipt className="size-4 text-primary" stroke={2.5} />
            <div>
              <h2 id="recent-orders-title" className={adminPanelTitleClass}>
                Pedidos recientes
              </h2>
              <p className="text-xs text-muted-foreground">
                Últimas transacciones registradas
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/sales">Ver todos</Link>
          </Button>
        </div>
        <div className="px-4 py-4">
          <Empty className="border-2 border-dashed border-foreground/30 bg-muted/20 py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconReceipt />
              </EmptyMedia>
              <EmptyTitle>Aun no hay pedidos.</EmptyTitle>
              <EmptyDescription>
                Las ventas nuevas apareceran aqui automaticamente.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </section>
    );
  }

  return (
    <section className={adminPanelClass} aria-labelledby="recent-orders-title">
      <div className={adminPanelHeaderClass}>
        <div className="flex items-center gap-2">
          <IconReceipt className="size-4 text-primary" stroke={2.5} />
          <div>
            <h2 id="recent-orders-title" className={adminPanelTitleClass}>
              Pedidos recientes
            </h2>
            <p className="text-xs text-muted-foreground">
              Últimas transacciones registradas
            </p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/sales">Ver todos</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-foreground/20 hover:bg-transparent">
            <TableHead className="font-mono text-[10px] uppercase">
              Pedido
            </TableHead>
            <TableHead className="font-mono text-[10px] uppercase">
              Cliente
            </TableHead>
            <TableHead className="hidden font-mono text-[10px] uppercase md:table-cell">
              Curso
            </TableHead>
            <TableHead className="font-mono text-[10px] uppercase">
              Monto
            </TableHead>
            <TableHead className="font-mono text-[10px] uppercase">
              Estado
            </TableHead>
            <TableHead className="hidden font-mono text-[10px] uppercase sm:table-cell">
              Fecha
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="border-foreground/15">
              <TableCell className="font-mono text-xs font-bold">
                {order.id}
              </TableCell>
              <TableCell className="font-medium">{order.customer}</TableCell>
              <TableCell className="hidden max-w-[200px] truncate text-muted-foreground md:table-cell">
                {order.course}
              </TableCell>
              <TableCell className="font-mono text-xs font-bold">
                {formatDashboardCurrency(order.amount)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={ORDER_STATUS_VARIANTS[order.status]}
                  className="font-mono text-[10px] uppercase"
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {formatDashboardRelativeTime(order.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
