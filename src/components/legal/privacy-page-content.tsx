import { LegalPageContent } from "@/components/legal/legal-page-content";
import { LEGAL_LAST_UPDATED } from "@/constants/legal-shared.constants";
import {
  PRIVACY_PAGE,
  PRIVACY_SECTIONS,
  PRIVACY_TOC,
} from "@/constants/privacy.constants";

export function PrivacyPageContent() {
  return (
    <LegalPageContent
      eyebrow={PRIVACY_PAGE.hero.eyebrow}
      title={PRIVACY_PAGE.hero.title}
      subtitle={PRIVACY_PAGE.hero.subtitle}
      lastUpdated={LEGAL_LAST_UPDATED}
      toc={PRIVACY_TOC}
      sections={PRIVACY_SECTIONS}
      readingEstimate={`~10 min · ${PRIVACY_TOC.length} secciones`}
      footerLinks={PRIVACY_PAGE.footer.links}
      footerDisclaimer={PRIVACY_PAGE.footer.disclaimer}
    />
  );
}
