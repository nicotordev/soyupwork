import {
  PRICING_COMPARISON,
  PRICING_FAQ_ITEMS,
  PRICING_FLAGSHIP,
  PRICING_MINI_MODULES,
  PRICING_PAGE,
  PRICING_PREMIUM,
  PRICING_TRUST_ITEMS,
} from "@/constants/pricing.constants";
import { getAuthSession } from "@/lib/auth/session";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import { isPublicWaitlistMode } from "@/lib/platform/public-waitlist-mode";
import type { PricingPageData } from "@/types/pricing.types";

export async function getPricingPageData(): Promise<PricingPageData> {
  const [{ isSignedIn }, settings] = await Promise.all([
    getAuthSession(),
    getPlatformSettings(),
  ]);

  return {
    miniModules: PRICING_MINI_MODULES,
    flagship: PRICING_FLAGSHIP,
    premium: PRICING_PREMIUM,
    comparison: PRICING_COMPARISON,
    hero: PRICING_PAGE.hero,
    trust: {
      section: PRICING_PAGE.trustSection,
      items: PRICING_TRUST_ITEMS,
    },
    faq: PRICING_FAQ_ITEMS,
    finalCta: PRICING_PAGE.finalCta,
    waitlistMode: isPublicWaitlistMode(),
    isSignedIn,
    enableStripeCheckout: settings.enableStripeCheckout,
  };
}
