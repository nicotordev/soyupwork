import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import {
  BlogPostStatus,
  ResourceAvailability,
  ResourceStatus,
} from "@/generated/prisma/client";
import { BLOG_INDEX_PATH, blogPostPath } from "@/lib/seo/blog-paths";
import {
  guidePath,
  GUIDES_INDEX_PATH,
  templatePath,
  TEMPLATES_INDEX_PATH,
} from "@/lib/resources/paths";
import { getAppOrigin } from "@/lib/seo/app-origin";
import prisma from "@/lib/db/prisma";

/** Data-cache TTL for sitemap DB queries — refreshed on publish via revalidateSitemap(). */
export const SITEMAP_REVALIDATE_SECONDS = 3600;
export const SITEMAP_CACHE_TAG = "sitemap";

async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const origin = getAppOrigin();

  const [posts, guides, templates] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        status: BlogPostStatus.PUBLISHED,
        publishedAt: { not: null },
      },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.resource.findMany({
      where: {
        status: ResourceStatus.PUBLISHED,
        availability: { not: ResourceAvailability.COMING_SOON },
        kind: "GUIDE",
        content: { not: null },
      },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.resource.findMany({
      where: {
        status: ResourceStatus.PUBLISHED,
        availability: { not: ResourceAvailability.COMING_SOON },
        kind: "TEMPLATE",
      },
      select: { slug: true, updatedAt: true, templateSections: true },
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: origin, changeFrequency: "weekly", priority: 1 },
    {
      url: `${origin}${BLOG_INDEX_PATH}`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${origin}${GUIDES_INDEX_PATH}`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${origin}${TEMPLATES_INDEX_PATH}`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    { url: `${origin}/pricing`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${origin}/catalog`, changeFrequency: "daily", priority: 0.8 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${origin}${blogPostPath(post.slug)}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guides.map((item) => ({
    url: `${origin}${guidePath(item.slug)}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const templateRoutes: MetadataRoute.Sitemap = templates
    .filter(
      (item) =>
        Array.isArray(item.templateSections) &&
        item.templateSections.length > 0,
    )
    .map((item) => ({
      url: `${origin}${templatePath(item.slug)}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly",
      priority: 0.75,
    }));

  return [...staticRoutes, ...blogRoutes, ...guideRoutes, ...templateRoutes];
}

const getCachedSitemapEntries = unstable_cache(
  buildSitemapEntries,
  ["sitemap-entries"],
  {
    revalidate: SITEMAP_REVALIDATE_SECONDS,
    tags: [SITEMAP_CACHE_TAG],
  },
);

export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  return getCachedSitemapEntries();
}
