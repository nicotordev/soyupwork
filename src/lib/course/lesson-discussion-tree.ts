import { displayName } from "@/lib/user/display-name";
import type { CoursePageLessonComment } from "@/types/course-page.types";

export type DiscussionRow = {
  id: string;
  parentId: string | null;
  body: string;
  createdAt: Date;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
};

export function formatDiscussionAuthor(user: DiscussionRow["user"]): string {
  return displayName(user);
}

export function mapDiscussionRow(row: DiscussionRow): CoursePageLessonComment {
  return {
    id: row.id,
    authorName: formatDiscussionAuthor(row.user),
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    parentId: row.parentId,
    replies: [],
  };
}

export function buildCommentTree(
  rows: DiscussionRow[],
): CoursePageLessonComment[] {
  const mapped = rows.map(mapDiscussionRow);
  const byId = new Map(mapped.map((comment) => [comment.id, comment]));
  const roots: CoursePageLessonComment[] = [];

  for (const comment of mapped) {
    if (comment.parentId) {
      const parent = byId.get(comment.parentId);
      if (parent) {
        parent.replies.push(comment);
      }
    } else {
      roots.push(comment);
    }
  }

  const byNewest = (a: CoursePageLessonComment, b: CoursePageLessonComment) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  const byOldest = (a: CoursePageLessonComment, b: CoursePageLessonComment) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  roots.sort(byNewest);
  for (const comment of mapped) {
    comment.replies.sort(byOldest);
  }

  return roots;
}

export function countLessonComments(
  comments: CoursePageLessonComment[],
): number {
  return comments.reduce(
    (total, comment) => total + 1 + comment.replies.length,
    0,
  );
}

export function appendCommentToTree(
  comments: CoursePageLessonComment[],
  comment: CoursePageLessonComment,
): CoursePageLessonComment[] {
  if (!comment.parentId) {
    return [comment, ...comments];
  }

  return comments.map((root) => {
    if (root.id === comment.parentId) {
      return {
        ...root,
        replies: [...root.replies, comment],
      };
    }
    return root;
  });
}
