import { LegalPageContent } from "@/components/legal/legal-page-content";
import { LEGAL_LAST_UPDATED } from "@/constants/legal-shared.constants";
import {
  getRefundsSections,
  REFUNDS_PAGE,
  REFUNDS_TOC,
} from "@/constants/refunds.constants";

type RefundsPageContentProps = {
  refundPolicyDays: number;
};

export function RefundsPageContent({
  refundPolicyDays,
}: RefundsPageContentProps) {
  const sections = getRefundsSections(refundPolicyDays);

  return (
    <LegalPageContent
      eyebrow={REFUNDS_PAGE.hero.eyebrow}
      title={REFUNDS_PAGE.hero.title}
      subtitle={REFUNDS_PAGE.hero.subtitle}
      lastUpdated={LEGAL_LAST_UPDATED}
      toc={REFUNDS_TOC}
      sections={sections}
      readingEstimate={`~8 min · ${REFUNDS_TOC.length} secciones`}
      footerLinks={REFUNDS_PAGE.footer.links}
      footerDisclaimer={REFUNDS_PAGE.footer.disclaimer}
    />
  );
}
