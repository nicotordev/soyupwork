export type PricingMiniModule = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  ctaHref: string;
};

export type PricingFlagshipProduct = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  launchPriceLabel: string;
  normalPriceLabel: string;
  billingLabel: string;
  ctaLabel: string;
  ctaHref: string;
  courseSlug?: string;
  features: readonly string[];
};

export type PricingPremiumOffer = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  billingLabel: string;
  ctaLabel: string;
  ctaHref: string;
  features: readonly string[];
};

export type PricingComparisonFeature = {
  id: string;
  label: string;
  mini: boolean | string;
  flagship: boolean | string;
  premium: boolean | string;
};

export type PricingFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type PricingTrustItem = {
  id: string;
  title: string;
  description: string;
};

export type PricingPageData = {
  miniModules: readonly PricingMiniModule[];
  flagship: PricingFlagshipProduct;
  premium: PricingPremiumOffer;
  comparison: readonly PricingComparisonFeature[];
  hero: typeof import("@/constants/pricing.constants").PRICING_PAGE.hero;
  trust: {
    section: typeof import("@/constants/pricing.constants").PRICING_PAGE.trustSection;
    items: readonly PricingTrustItem[];
  };
  faq: readonly PricingFaqItem[];
  finalCta: typeof import("@/constants/pricing.constants").PRICING_PAGE.finalCta;
  waitlistMode: boolean;
  isSignedIn: boolean;
  enableStripeCheckout: boolean;
};
