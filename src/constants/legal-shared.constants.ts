import type { LegalFooterLink } from "@/types/legal-page.types";

export const LEGAL_LAST_UPDATED = "30 de mayo de 2026";

export const LEGAL_FOOTER_DISCLAIMER =
  "Este documento no sustituye asesoría legal personalizada. La fecha vigente siempre aparece en el encabezado de cada política.";

export function legalFooterLinks(
  omitHref?: string,
): readonly LegalFooterLink[] {
  const links: LegalFooterLink[] = [
    { title: "Términos", href: "/terminos" },
    { title: "Privacidad", href: "/privacidad" },
    { title: "Reembolsos", href: "/reembolsos" },
    { title: "Contacto", href: "/contacto" },
    { title: "Pricing", href: "/pricing" },
    { title: "Cursos", href: "/catalog" },
  ];
  return omitHref ? links.filter((l) => l.href !== omitHref) : links;
}
