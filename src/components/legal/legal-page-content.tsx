import { LegalPageFooter } from "@/components/legal/legal-page-footer";
import { LegalPageHero } from "@/components/legal/legal-page-hero";
import { LegalSectionBlock } from "@/components/legal/legal-section";
import { LegalToc } from "@/components/legal/legal-toc";
import type {
  LegalFooterLink,
  LegalSection,
  LegalTocItem,
} from "@/types/legal-page.types";

type LegalPageContentProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  toc: readonly LegalTocItem[];
  sections: readonly LegalSection[];
  readingEstimate?: string;
  footerLinks: readonly LegalFooterLink[];
  footerDisclaimer: string;
  beforeSections?: React.ReactNode;
  afterSections?: React.ReactNode;
};

export function LegalPageContent({
  eyebrow,
  title,
  subtitle,
  lastUpdated,
  toc,
  sections,
  readingEstimate,
  footerLinks,
  footerDisclaimer,
  beforeSections,
  afterSections,
}: LegalPageContentProps) {
  return (
    <article className="relative z-10">
      <LegalPageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        lastUpdated={lastUpdated}
      />

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12">
          <aside className="mb-6 md:mb-0">
            <LegalToc items={toc} />
          </aside>

          <div className="min-w-0 max-w-3xl md:max-w-none">
            {readingEstimate ? (
              <div className="mb-8 rounded-2xl border-2 border-foreground bg-card/80 p-4 shadow-[3px_3px_0px_0px_var(--foreground)] sm:p-5 md:hidden">
                <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Lectura estimada
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {readingEstimate}
                </p>
              </div>
            ) : null}

            {beforeSections}

            <div className="space-y-2 sm:space-y-4">
              {sections.map((section, index) => (
                <LegalSectionBlock
                  key={section.id}
                  section={section}
                  index={index}
                />
              ))}
            </div>

            {afterSections}
          </div>
        </div>
      </div>

      <LegalPageFooter links={footerLinks} disclaimer={footerDisclaimer} />
    </article>
  );
}
