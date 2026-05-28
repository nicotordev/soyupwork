import { StudentCertificatesView } from "@/components/dashboard/student-certificates-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificados",
  description: "Certificados obtenidos en SoyUpwork.",
};

export default function StudentCertificatesPage() {
  return <StudentCertificatesView />;
}
