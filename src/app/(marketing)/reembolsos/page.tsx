import type { Metadata } from "next";
import { LegalMarketingShell } from "@/components/legal/legal-marketing-shell";
import { RefundsPageContent } from "@/components/legal/refunds-page-content";
import { buildRefundsMetadata } from "@/constants/refunds.constants";
import { getPlatformSettings } from "@/lib/platform/settings/store";

export const metadata: Metadata = buildRefundsMetadata();

export default async function ReembolsosPage() {
  const settings = await getPlatformSettings();

  return (
    <LegalMarketingShell seed={513}>
      <RefundsPageContent refundPolicyDays={settings.refundPolicyDays} />
    </LegalMarketingShell>
  );
}
