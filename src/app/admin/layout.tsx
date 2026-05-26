import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin | SoyUpwork",
    template: "%s | Admin | SoyUpwork",
  },
  description: "Panel de administración de SoyUpwork.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}
