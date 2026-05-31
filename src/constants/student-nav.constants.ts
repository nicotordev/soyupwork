import type { TablerIcon } from "@tabler/icons-react";
import {
  IconBook,
  IconBooks,
  IconCertificate,
  IconChartBar,
  IconCompass,
  IconNotebook,
  IconPlayerPlay,
  IconUserCircle,
} from "@tabler/icons-react";

export type StudentNavItem = {
  label: string;
  href: string;
  icon: TablerIcon;
  /** `exact` solo para /dashboard; `prefix` para el resto */
  match?: "exact" | "prefix";
};

export type StudentNavGroup = {
  label: string;
  items: StudentNavItem[];
};

export const STUDENT_LEARNING_NAV: StudentNavItem[] = [
  { label: "Mi Panel", href: "/dashboard", icon: IconBook, match: "exact" },
  {
    label: "Continuar",
    href: "/dashboard/continue",
    icon: IconPlayerPlay,
    match: "prefix",
  },
  {
    label: "Mis Cursos",
    href: "/dashboard/courses",
    icon: IconBooks,
    match: "prefix",
  },
  {
    label: "Progreso",
    href: "/dashboard/progress",
    icon: IconChartBar,
    match: "prefix",
  },
  {
    label: "Certificados",
    href: "/dashboard/certificates",
    icon: IconCertificate,
    match: "prefix",
  },
];

export const STUDENT_EXPLORE_NAV: StudentNavItem[] = [
  { label: "Catálogo", href: "/catalog", icon: IconCompass, match: "prefix" },
  {
    label: "Recursos",
    href: "/resources/guias",
    icon: IconNotebook,
    match: "prefix",
  },
];

export const STUDENT_ACCOUNT_NAV: StudentNavItem[] = [
  {
    label: "Mi perfil",
    href: "/dashboard/profile",
    icon: IconUserCircle,
    match: "prefix",
  },
];

export function isStudentNavItemActive(
  pathname: string,
  item: StudentNavItem,
): boolean {
  if (item.match === "exact") {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
