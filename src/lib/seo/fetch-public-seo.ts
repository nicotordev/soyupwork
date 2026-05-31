import "server-only";

import { CourseStatus, BlogPostStatus } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import { blogPostPath } from "@/lib/seo/blog-paths";
import { mapSeoRecordToMetadata } from "@/lib/seo/map-seo-to-metadata";
import type { ResolvedSeoMetadata } from "@/types/seo.types";

const seoSelect = {
  id: true,
  title: true,
  titleTemplate: true,
  titleAbsolute: true,
  description: true,
  applicationName: true,
  generator: true,
  creator: true,
  publisher: true,
  keywords: true,
  referrer: true,
  abstract: true,
  category: true,
  classification: true,
  manifest: true,
  robots: true,
  alternates: true,
  icons: true,
  openGraph: true,
  twitter: true,
  facebook: true,
  pinterest: true,
  verification: true,
  authors: true,
  appleWebApp: true,
  formatDetection: true,
  itunes: true,
  appLinks: true,
  pagination: true,
  other: true,
  archives: true,
  assets: true,
  bookmarks: true,
} as const;

export async function getPublishedCourseSeoMetadata(
  courseSlug: string,
): Promise<ResolvedSeoMetadata | null> {
  const course = await prisma.course.findFirst({
    where: { slug: courseSlug, status: CourseStatus.PUBLISHED },
    select: {
      title: true,
      description: true,
      thumbnailUrl: true,
      seoMetadata: { select: seoSelect },
    },
  });

  if (!course) return null;

  return mapSeoRecordToMetadata(course.seoMetadata, {
    title: course.title,
    description: course.description,
    canonicalPath: `/courses/${courseSlug}`,
    imageUrl: course.thumbnailUrl,
    openGraphType: "website",
  });
}

export async function getPublishedBlogPostSeoMetadata(
  blogSlug: string,
): Promise<ResolvedSeoMetadata | null> {
  const post = await prisma.blogPost.findFirst({
    where: { slug: blogSlug, status: BlogPostStatus.PUBLISHED },
    select: {
      title: true,
      excerpt: true,
      coverImageUrl: true,
      seoMetadata: { select: seoSelect },
    },
  });

  if (!post) return null;

  return mapSeoRecordToMetadata(post.seoMetadata, {
    title: post.title,
    description: post.excerpt,
    canonicalPath: blogPostPath(blogSlug),
    imageUrl: post.coverImageUrl,
    openGraphType: "article",
  });
}
