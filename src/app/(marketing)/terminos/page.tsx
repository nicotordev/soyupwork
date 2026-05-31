import type { Metadata } from "next";
import { LegalMarketingShell } from "@/components/legal/legal-marketing-shell";
import { TermsPageContent } from "@/components/legal/terms-page-content";
import { buildTermsMetadata } from "@/constants/terms.constants";

export const metadata: Metadata = buildTermsMetadata();

export default function TerminosPage() {
  return (
    <LegalMarketingShell seed={901}>
      <TermsPageContent />
    </LegalMarketingShell>
  );
}
