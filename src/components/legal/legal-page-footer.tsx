import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_BRAND } from "@/constants/site-brand.constants";
import type { LegalFooterLink } from "@/types/legal-page.types";

type LegalPageFooterProps = {
  links: readonly LegalFooterLink[];
  disclaimer: string;
};

export function LegalPageFooter({ links, disclaimer }: LegalPageFooterProps) {
  return (
    <footer className="mt-12 border-t-2 border-foreground bg-secondary/20 sm:mt-16">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="rounded-2xl border-2 border-foreground bg-card p-5 shadow-[4px_4px_0px_0px_var(--foreground)] sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-block font-heading text-lg font-black tracking-tight"
              >
                {SITE_BRAND.name}
              </Link>
              <p className="max-w-sm text-sm font-medium text-muted-foreground">
                Academia práctica para freelancers de Upwork en LATAM. Operación
                comercial, propuestas y criterio internacional — sin humo.
              </p>
            </div>

            <nav aria-label="Enlaces legales relacionados">
              <p className="mb-3 font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Enlaces
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm font-bold text-foreground transition-colors hover:text-primary"
                    >
                      {link.title}
                      <ArrowRight className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <p className="mt-6 border-t-2 border-dashed border-foreground/20 pt-5 font-mono text-[10px] font-semibold leading-relaxed text-muted-foreground sm:text-xs">
            {disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
