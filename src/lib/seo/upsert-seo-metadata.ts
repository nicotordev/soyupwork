import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";
import {
  assertSeoMetadataParent,
  type SeoMetadataParent,
} from "@/lib/seo/seo-metadata-parent";
import type { SeoMetadataInput } from "@/types/seo.types";

function buildSeoPayload(
  input: SeoMetadataInput,
): Prisma.SeoMetadataCreateInput {
  return {
    title: input.title ?? null,
    titleTemplate: input.titleTemplate ?? null,
    titleAbsolute: input.titleAbsolute ?? null,
    description: input.description ?? null,
    applicationName: input.applicationName ?? null,
    generator: input.generator ?? null,
    creator: input.creator ?? null,
    publisher: input.publisher ?? null,
    keywords: input.keywords ?? [],
    referrer: input.referrer ?? null,
    abstract: input.abstract ?? null,
    category: input.category ?? null,
    classification: input.classification ?? null,
    manifest: input.manifest ?? null,
    robots: input.robots ?? undefined,
    alternates: input.alternates ?? undefined,
    icons: input.icons ?? undefined,
    openGraph: input.openGraph ?? undefined,
    twitter: input.twitter ?? undefined,
    facebook: input.facebook ?? undefined,
    pinterest: input.pinterest ?? undefined,
    verification: input.verification ?? undefined,
    authors: input.authors ?? undefined,
    appleWebApp: input.appleWebApp ?? undefined,
    formatDetection: input.formatDetection ?? undefined,
    itunes: input.itunes ?? undefined,
    appLinks: input.appLinks ?? undefined,
    pagination: input.pagination ?? undefined,
    other: input.other ?? undefined,
    archives: input.archives ?? [],
    assets: input.assets ?? [],
    bookmarks: input.bookmarks ?? [],
  };
}

export async function upsertSeoMetadata(
  parent: SeoMetadataParent,
  input?: SeoMetadataInput | null,
): Promise<void> {
  assertSeoMetadataParent(parent);
  const payload = buildSeoPayload(input ?? {});

  if (parent.courseId) {
    await prisma.seoMetadata.upsert({
      where: { courseId: parent.courseId },
      create: {
        ...payload,
        course: { connect: { id: parent.courseId } },
      },
      update: payload,
    });
    return;
  }

  await prisma.seoMetadata.upsert({
    where: { blogPostId: parent.blogPostId },
    create: {
      ...payload,
      blogPost: { connect: { id: parent.blogPostId } },
    },
    update: payload,
  });
}
