import Link from "next/link";
import { Mail, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/legal/contact-form.client";
import { LegalPageFooter } from "@/components/legal/legal-page-footer";
import { LegalPageHero } from "@/components/legal/legal-page-hero";
import { LegalSectionBlock } from "@/components/legal/legal-section";
import { LegalToc } from "@/components/legal/legal-toc";
import {
  CONTACT_PAGE,
  CONTACT_SECTIONS,
  CONTACT_TOC,
} from "@/constants/contact.constants";
import { LEGAL_LAST_UPDATED } from "@/constants/legal-shared.constants";
import { cn } from "@/lib/utils";

type ContactPageContentProps = {
  supportEmail?: string | null;
};

export function ContactPageContent({ supportEmail }: ContactPageContentProps) {
  const [canales, temas, antesDeEscribir] = CONTACT_SECTIONS;

  return (
    <article className="relative z-10">
      <LegalPageHero
        eyebrow={CONTACT_PAGE.hero.eyebrow}
        title={CONTACT_PAGE.hero.title}
        subtitle={CONTACT_PAGE.hero.subtitle}
        lastUpdated={LEGAL_LAST_UPDATED}
      />

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12">
          <aside className="mb-6 md:mb-0">
            <LegalToc items={CONTACT_TOC} />
          </aside>

          <div className="min-w-0 max-w-3xl space-y-2 sm:space-y-4 md:max-w-none">
            {supportEmail ? (
              <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`mailto:${supportEmail}`}
                  className={cn(
                    "flex min-h-11 flex-1 items-center gap-3 rounded-xl border-2 border-foreground bg-card px-4 py-3",
                    "shadow-[3px_3px_0px_0px_var(--foreground)] transition-all",
                    "hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_var(--foreground)]",
                  )}
                >
                  <Mail className="size-4 shrink-0 text-primary" />
                  <span className="min-w-0 truncate text-sm font-bold">
                    {supportEmail}
                  </span>
                </a>
                <div className="flex min-h-11 items-center gap-3 rounded-xl border-2 border-dashed border-foreground/30 bg-muted/30 px-4 py-3">
                  <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Respuesta: {CONTACT_PAGE.responseTime}
                  </span>
                </div>
              </div>
            ) : null}

            <LegalSectionBlock
              section={canales}
              index={0}
              showSeparator={false}
            />

            <section
              id="formulario"
              aria-labelledby="formulario-heading"
              className="scroll-mt-24 py-4 sm:scroll-mt-28 sm:py-6"
            >
              <h2 id="formulario-heading" className="sr-only">
                Formulario de contacto
              </h2>
              <ContactForm />
            </section>

            <LegalSectionBlock section={temas} index={1} />
            <LegalSectionBlock section={antesDeEscribir} index={2} />

            <p className="pt-4 text-sm font-medium text-muted-foreground">
              Documentos relacionados:{" "}
              <Link
                href="/terminos"
                className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4"
              >
                Términos
              </Link>
              {" · "}
              <Link
                href="/reembolsos"
                className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4"
              >
                Reembolsos
              </Link>
              {" · "}
              <Link
                href="/privacidad"
                className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4"
              >
                Privacidad
              </Link>
            </p>
          </div>
        </div>
      </div>

      <LegalPageFooter
        links={CONTACT_PAGE.footer.links}
        disclaimer={CONTACT_PAGE.footer.disclaimer}
      />
    </article>
  );
}
