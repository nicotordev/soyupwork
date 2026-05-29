import type { StudentNavItem } from "@/constants/student-nav.constants";
import { isStudentNavItemActive } from "@/constants/student-nav.constants";

export { isStudentNavItemActive };

export function getStudentBreadcrumbLabel(pathname: string): string {
  const labels: Record<string, string> = {
    dashboard: "Mi Panel",
    continue: "Continuar",
    courses: "Mis Cursos",
    progress: "Progreso",
    certificates: "Certificados",
    purchases: "Mis compras",
    profile: "Mi perfil",
    lessons: "Lección",
  };

  const parts = pathname.split("/").filter(Boolean);
  const section = parts[1] ?? "dashboard";

  if (section === "dashboard" && parts.length === 1) {
    return "Mi Panel";
  }

  return labels[section] ?? "Área Estudiante";
}

export function findActiveStudentNavItem(
  pathname: string,
  items: StudentNavItem[],
): StudentNavItem | undefined {
  return items.find((item) => isStudentNavItemActive(pathname, item));
}
