import type { OrderStatus } from "@/generated/prisma/client";

export type AdminSalesOrderRow = {
  id: string;
  customer: string;
  course: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  date: string;
};

export type AdminSalesStats = {
  totalRevenue: number;
  processedOrders: number;
  failedOrRefundedOrders: number;
};

export type AdminSalesPageData = {
  orders: AdminSalesOrderRow[];
  stats: AdminSalesStats;
  filters: {
    q: string;
    status: OrderStatus | "ALL";
    page: number;
    pageSize: number;
  };
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};
