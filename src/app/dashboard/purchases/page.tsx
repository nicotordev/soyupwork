import { StudentPurchasesView } from "@/components/dashboard/student-purchases-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis compras",
};

export default function StudentPurchasesPage() {
  return <StudentPurchasesView />;
}
