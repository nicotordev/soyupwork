import type { Metadata } from "next";
import { LegalMarketingShell } from "@/components/legal/legal-marketing-shell";
import { PrivacyPageContent } from "@/components/legal/privacy-page-content";
import { buildPrivacyMetadata } from "@/constants/privacy.constants";

export const metadata: Metadata = buildPrivacyMetadata();

export default function PrivacidadPage() {
  return (
    <LegalMarketingShell seed={712}>
      <PrivacyPageContent />
    </LegalMarketingShell>
  );
}
