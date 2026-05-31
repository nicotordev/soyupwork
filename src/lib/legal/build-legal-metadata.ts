import type { Metadata } from "next";

const SITE_NAME = "soyup.work";

function getAppOrigin(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!url) return "https://soyup.work";
  return url.replace(/\/$/, "");
}

export type LegalMetadataInput = {
  path: string;
  title: string;
  description: string;
  keywords: readonly string[];
};

export function buildLegalMetadata(input: LegalMetadataInput): Metadata {
  const origin = getAppOrigin();
  const canonical = `${origin}${input.path.startsWith("/") ? input.path : `/${input.path}`}`;

  return {
    title: input.title,
    description: input.description,
    keywords: [...input.keywords],
    alternates: { canonical },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "es_LA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}
