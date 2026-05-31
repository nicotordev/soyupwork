import { LegalPageContent } from "@/components/legal/legal-page-content";
import {
  LEGAL_LAST_UPDATED,
  legalFooterLinks,
} from "@/constants/legal-shared.constants";
import {
  TERMS_PAGE,
  TERMS_SECTIONS,
  TERMS_TOC,
} from "@/constants/terms.constants";

export function TermsPageContent() {
  return (
    <LegalPageContent
      eyebrow={TERMS_PAGE.hero.eyebrow}
      title={TERMS_PAGE.hero.title}
      subtitle={TERMS_PAGE.hero.subtitle}
      lastUpdated={LEGAL_LAST_UPDATED}
      toc={TERMS_TOC}
      sections={TERMS_SECTIONS}
      readingEstimate={`~12 min · ${TERMS_TOC.length} secciones`}
      footerLinks={legalFooterLinks(TERMS_PAGE.path)}
      footerDisclaimer={TERMS_PAGE.footer.disclaimer}
    />
  );
}
