import { getStudentDashboardData } from "@/app/actions/student-dashboard.actions";
import { StudentDashboardOverview } from "@/components/dashboard/student-dashboard-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Panel",
  description: "Área de estudiante de SoyUpwork. Sigue tu progreso, lecciones y certificados freelance.",
};

export default async function DashboardPage() {
  const data = await getStudentDashboardData();

  return <StudentDashboardOverview data={data} />;
}