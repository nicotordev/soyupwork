import type { Prisma } from "@/generated/prisma/client";
import type { Metadata } from "next";

/**
 * Persisted SEO record mapped to Next.js `Metadata` (see `metadata-interface.d.ts`).
 *
 * Column → Metadata field:
 * - title, titleTemplate, titleAbsolute → title
 * - description → description
 * - applicationName, generator, creator, publisher → same
 * - keywords → keywords
 * - referrer → referrer
 * - abstract, category, classification → same
 * - manifest → manifest
 * - robots → robots (Robots)
 * - alternates → alternates (canonical, languages, media, types)
 * - icons → icons
 * - openGraph → openGraph
 * - twitter → twitter
 * - facebook, pinterest, verification, authors → same
 * - appleWebApp, formatDetection, itunes, appLinks, pagination, other → same
 * - archives, assets, bookmarks → same
 *
 * Not stored (use layout / env): metadataBase, themeColor, colorScheme, viewport.
 */
export type SeoMetadataRecord = Prisma.SeoMetadataGetPayload<object>;

/** Fields required to build Next.js Metadata (subset of full row). */
export type SeoMetadataFields = Omit<
  SeoMetadataRecord,
  "createdAt" | "updatedAt" | "courseId" | "blogPostId"
>;

export type SeoMetadataJsonFields = Pick<
  SeoMetadataRecord,
  | "robots"
  | "alternates"
  | "icons"
  | "openGraph"
  | "twitter"
  | "facebook"
  | "pinterest"
  | "verification"
  | "authors"
  | "appleWebApp"
  | "formatDetection"
  | "itunes"
  | "appLinks"
  | "pagination"
  | "other"
>;

export type SeoMetadataDefaults = {
  title: string;
  description?: string | null;
  canonicalPath: string;
  imageUrl?: string | null;
  siteName?: string;
  openGraphType?: "website" | "article";
};

export type SeoMetadataInput = {
  title?: string | null;
  titleTemplate?: string | null;
  titleAbsolute?: string | null;
  description?: string | null;
  applicationName?: string | null;
  generator?: string | null;
  creator?: string | null;
  publisher?: string | null;
  keywords?: string[];
  referrer?: string | null;
  abstract?: string | null;
  category?: string | null;
  classification?: string | null;
  manifest?: string | null;
  robots?: Prisma.InputJsonValue | null;
  alternates?: Prisma.InputJsonValue | null;
  icons?: Prisma.InputJsonValue | null;
  openGraph?: Prisma.InputJsonValue | null;
  twitter?: Prisma.InputJsonValue | null;
  facebook?: Prisma.InputJsonValue | null;
  pinterest?: Prisma.InputJsonValue | null;
  verification?: Prisma.InputJsonValue | null;
  authors?: Prisma.InputJsonValue | null;
  appleWebApp?: Prisma.InputJsonValue | null;
  formatDetection?: Prisma.InputJsonValue | null;
  itunes?: Prisma.InputJsonValue | null;
  appLinks?: Prisma.InputJsonValue | null;
  pagination?: Prisma.InputJsonValue | null;
  other?: Prisma.InputJsonValue | null;
  archives?: string[];
  assets?: string[];
  bookmarks?: string[];
};

export type ResolvedSeoMetadata = Metadata;
