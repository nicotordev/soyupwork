import type { Metadata } from "next";
import { NeobrutalistPageDecoration } from "@/components/common/neobrutalist-page-decoration";
import { PricingComparison } from "@/components/pricing/pricing-comparison";
import { PricingFaqSectionClient } from "@/components/pricing/pricing-faq-section.client";
import { PricingFinalCta } from "@/components/pricing/pricing-final-cta";
import { PricingHero } from "@/components/pricing/pricing-hero";
import { PricingMobileStickyCta } from "@/components/pricing/pricing-mobile-sticky-cta.client";
import { PricingProducts } from "@/components/pricing/pricing-products";
import { PricingTrustSection } from "@/components/pricing/pricing-trust-section";
import { buildPricingMetadata } from "@/constants/pricing.constants";
import { getPricingPageData } from "@/lib/pricing/get-pricing-page-data";

export const metadata: Metadata = buildPricingMetadata();

export default async function PricingPage() {
  const data = await getPricingPageData();

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-background pb-20 font-sans text-foreground antialiased md:pb-0">
      <NeobrutalistPageDecoration shapeCount={6} seed={137} />
      <div className="relative z-10">
        <PricingHero hero={data.hero} waitlistMode={data.waitlistMode} />

        <PricingProducts
          miniModules={data.miniModules}
          flagship={data.flagship}
          premium={data.premium}
          waitlistMode={data.waitlistMode}
        />

        <PricingComparison features={data.comparison} />

        <PricingTrustSection trust={data.trust} />

        <PricingFaqSectionClient items={data.faq} />

        <PricingFinalCta
          finalCta={data.finalCta}
          waitlistMode={data.waitlistMode}
        />
      </div>

      <PricingMobileStickyCta waitlistMode={data.waitlistMode} />
    </div>
  );
}
