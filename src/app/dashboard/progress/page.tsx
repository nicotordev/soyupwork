import { StudentProgressView } from "@/components/dashboard/student-progress-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progreso",
  description: "Tu avance en los cursos de SoyUpwork.",
};

export default function StudentProgressPage() {
  return <StudentProgressView />;
}
