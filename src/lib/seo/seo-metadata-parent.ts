import type { Prisma } from "@/generated/prisma/client";

export type SeoMetadataParent =
  | { courseId: string; blogPostId?: never }
  | { blogPostId: string; courseId?: never };

export function assertSeoMetadataParent(
  parent: SeoMetadataParent,
): SeoMetadataParent {
  const hasCourse = Boolean(parent.courseId);
  const hasBlog = Boolean(parent.blogPostId);

  if (hasCourse === hasBlog) {
    throw new Error(
      "SeoMetadata must reference exactly one of courseId or blogPostId.",
    );
  }

  return parent;
}

export function seoMetadataParentData(
  parent: SeoMetadataParent,
): Pick<Prisma.SeoMetadataCreateInput, "course" | "blogPost"> {
  assertSeoMetadataParent(parent);

  if (parent.courseId) {
    return { course: { connect: { id: parent.courseId } } };
  }

  return { blogPost: { connect: { id: parent.blogPostId } } };
}
