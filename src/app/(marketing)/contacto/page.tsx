import type { Metadata } from "next";
import { LegalMarketingShell } from "@/components/legal/legal-marketing-shell";
import { ContactPageContent } from "@/components/legal/contact-page-content";
import { buildContactMetadata } from "@/constants/contact.constants";
import { getResolvedEmailSupport } from "@/lib/platform/settings/resolve";

export const metadata: Metadata = buildContactMetadata();

export default async function ContactoPage() {
  const supportEmail = await getResolvedEmailSupport();

  return (
    <LegalMarketingShell seed={204}>
      <ContactPageContent supportEmail={supportEmail} />
    </LegalMarketingShell>
  );
}
