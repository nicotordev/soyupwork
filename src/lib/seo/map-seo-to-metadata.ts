import { getAppOrigin, getMetadataBase } from "@/lib/seo/app-origin";
import type {
  ResolvedSeoMetadata,
  SeoMetadataDefaults,
  SeoMetadataFields,
} from "@/types/seo.types";
import type { Metadata } from "next";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeOpenGraph(
  stored: unknown,
  defaults: SeoMetadataDefaults,
  title: Metadata["title"],
  description: string | undefined,
): Metadata["openGraph"] | undefined {
  const base = isRecord(stored) ? { ...stored } : {};
  const titleText =
    typeof title === "string"
      ? title
      : title && typeof title === "object" && "default" in title
        ? String(title.default)
        : defaults.title;

  const origin = getAppOrigin();
  const canonical = `${origin}${defaults.canonicalPath.startsWith("/") ? defaults.canonicalPath : `/${defaults.canonicalPath}`}`;

  const merged = {
    type: defaults.openGraphType ?? "website",
    locale: "es_LA",
    siteName: defaults.siteName ?? "SoyUpwork",
    url: canonical,
    title: (base.title as string | undefined) ?? titleText,
    description:
      (base.description as string | undefined) ?? description ?? undefined,
    ...(defaults.imageUrl && !base.images
      ? { images: [{ url: defaults.imageUrl, alt: titleText }] }
      : {}),
    ...base,
  };

  return merged as Metadata["openGraph"];
}

function resolveTitle(
  seo: SeoMetadataFields | null,
  defaults: SeoMetadataDefaults,
): Metadata["title"] {
  if (seo?.titleAbsolute?.trim()) {
    return { absolute: seo.titleAbsolute.trim() };
  }

  const primary = seo?.title?.trim() || defaults.title;

  if (seo?.titleTemplate?.trim()) {
    return {
      default: primary,
      template: seo.titleTemplate.trim(),
    };
  }

  return primary;
}

function resolveAlternates(
  seo: SeoMetadataFields | null,
  defaults: SeoMetadataDefaults,
): Metadata["alternates"] | undefined {
  const origin = getAppOrigin();
  const canonical = `${origin}${defaults.canonicalPath.startsWith("/") ? defaults.canonicalPath : `/${defaults.canonicalPath}`}`;

  if (seo?.alternates && isRecord(seo.alternates)) {
    return {
      ...seo.alternates,
      canonical:
        (seo.alternates as { canonical?: string }).canonical ?? canonical,
    } as Metadata["alternates"];
  }

  return { canonical };
}

function pickJsonField<T>(value: unknown): T | undefined {
  if (value === null || value === undefined) return undefined;
  return value as T;
}

/**
 * Builds Next.js `Metadata` from a stored `SeoMetadata` row and content fallbacks.
 */
export function mapSeoRecordToMetadata(
  seo: SeoMetadataFields | null,
  defaults: SeoMetadataDefaults,
): ResolvedSeoMetadata {
  const title = resolveTitle(seo, defaults);
  const description =
    seo?.description?.trim() || defaults.description?.trim() || undefined;

  const metadata: Metadata = {
    metadataBase: getMetadataBase(),
    title,
    description,
    applicationName: seo?.applicationName ?? undefined,
    generator: seo?.generator ?? undefined,
    creator: seo?.creator ?? undefined,
    publisher: seo?.publisher ?? undefined,
    keywords: seo?.keywords?.length ? seo.keywords : undefined,
    referrer: (seo?.referrer as Metadata["referrer"]) ?? undefined,
    abstract: seo?.abstract ?? undefined,
    category: seo?.category ?? undefined,
    classification: seo?.classification ?? undefined,
    manifest: seo?.manifest ?? undefined,
    robots: pickJsonField<Metadata["robots"]>(seo?.robots),
    alternates: resolveAlternates(seo, defaults),
    icons: pickJsonField<Metadata["icons"]>(seo?.icons),
    openGraph: mergeOpenGraph(seo?.openGraph, defaults, title, description),
    twitter: pickJsonField<Metadata["twitter"]>(seo?.twitter),
    facebook: pickJsonField<Metadata["facebook"]>(seo?.facebook),
    pinterest: pickJsonField<Metadata["pinterest"]>(seo?.pinterest),
    verification: pickJsonField<Metadata["verification"]>(seo?.verification),
    authors: pickJsonField<Metadata["authors"]>(seo?.authors),
    appleWebApp: pickJsonField<Metadata["appleWebApp"]>(seo?.appleWebApp),
    formatDetection: pickJsonField<Metadata["formatDetection"]>(
      seo?.formatDetection,
    ),
    itunes: pickJsonField<Metadata["itunes"]>(seo?.itunes),
    appLinks: pickJsonField<Metadata["appLinks"]>(seo?.appLinks),
    pagination: pickJsonField<Metadata["pagination"]>(seo?.pagination),
    other: pickJsonField<Metadata["other"]>(seo?.other),
    archives: seo?.archives?.length ? seo.archives : undefined,
    assets: seo?.assets?.length ? seo.assets : undefined,
    bookmarks: seo?.bookmarks?.length ? seo.bookmarks : undefined,
  };

  if (!metadata.twitter && metadata.openGraph) {
    const og = metadata.openGraph;
    const ogTitle = typeof og.title === "string" ? og.title : defaults.title;
    metadata.twitter = {
      card: "summary_large_image",
      title: ogTitle,
      description: og.description ?? description,
      images:
        og.images && Array.isArray(og.images)
          ? og.images
          : defaults.imageUrl
            ? [defaults.imageUrl]
            : undefined,
    };
  }

  return metadata;
}
