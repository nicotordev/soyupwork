import type { MetadataRoute } from "next";
import { BlogPostStatus } from "@/generated/prisma/client";
import { GUIDE_ITEMS } from "@/constants/guides.constants";
import { TEMPLATE_ITEMS } from "@/constants/templates.constants";
import { BLOG_INDEX_PATH, blogPostPath } from "@/lib/seo/blog-paths";
import {
  guidePath,
  GUIDES_INDEX_PATH,
  templatePath,
  TEMPLATES_INDEX_PATH,
} from "@/lib/resources/paths";
import { getAppOrigin } from "@/lib/seo/app-origin";
import prisma from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getAppOrigin();

  const posts = await prisma.blogPost.findMany({
    where: {
      status: BlogPostStatus.PUBLISHED,
      publishedAt: { not: null },
    },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

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

  const guideRoutes: MetadataRoute.Sitemap = GUIDE_ITEMS.filter(
    (item) => item.availability !== "coming_soon",
  ).map((item) => ({
    url: `${origin}${guidePath(item.slug)}`,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const templateRoutes: MetadataRoute.Sitemap = TEMPLATE_ITEMS.filter(
    (item) => item.availability !== "coming_soon",
  ).map((item) => ({
    url: `${origin}${templatePath(item.slug)}`,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...blogRoutes, ...guideRoutes, ...templateRoutes];
}
