import "server-only";

import prisma from "@/lib/db/prisma";
import type { CoursePageLessonComment } from "@/types/course-page.types";
import {
  buildCommentTree,
  mapDiscussionRow,
  type DiscussionRow,
} from "@/lib/course/lesson-discussion-tree";

export type { DiscussionRow } from "@/lib/course/lesson-discussion-tree";
export {
  appendCommentToTree,
  buildCommentTree,
  countLessonComments,
  formatDiscussionAuthor,
  mapDiscussionRow,
  removeCommentFromTree,
} from "@/lib/course/lesson-discussion-tree";

const discussionUserSelect = {
  firstName: true,
  lastName: true,
  email: true,
  imageUrl: true,
} as const;

export async function fetchLessonDiscussions(
  lessonId: string,
): Promise<CoursePageLessonComment[]> {
  const rows = await prisma.courseDiscussion.findMany({
    where: { lessonId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      parentId: true,
      body: true,
      createdAt: true,
      userId: true,
      user: { select: discussionUserSelect },
    },
  });

  return buildCommentTree(rows);
}

export async function fetchDiscussionById(
  discussionId: string,
): Promise<CoursePageLessonComment | null> {
  const row = await prisma.courseDiscussion.findUnique({
    where: { id: discussionId },
    select: {
      id: true,
      parentId: true,
      body: true,
      createdAt: true,
      userId: true,
      user: { select: discussionUserSelect },
    },
  });

  if (!row) return null;
  return mapDiscussionRow(row as DiscussionRow);
}
