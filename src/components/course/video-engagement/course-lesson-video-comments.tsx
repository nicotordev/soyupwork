"use client";

import {
  createLessonDiscussion,
  deleteLessonDiscussion,
} from "@/app/actions/lesson-discussion.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  COURSE_PAGE,
  DEMO_LESSON_COMMENT_AUTHOR_ID,
} from "@/constants/course-page.constants";
import { adminPanelClass } from "@/lib/admin/styles";
import {
  appendCommentToTree,
  countLessonComments,
  removeCommentFromTree,
} from "@/lib/course/lesson-discussion-tree";
import { cn } from "@/lib/utils";
import type { CoursePageLessonComment } from "@/types/course-page.types";
import { useUser } from "@clerk/nextjs";
import {
  IconCornerDownRight,
  IconMessageCircle,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast as sonnerToast } from "sonner";
import { formatLessonCommentDate } from "./format-lesson-comment-date";

type CourseLessonVideoCommentsProps = {
  courseSlug: string;
  lessonId: string;
  comments: CoursePageLessonComment[];
  canComment: boolean;
  isDemo?: boolean;
  currentUserId?: string | null;
};

function getAvatarColor(name: string): string {
  const colors = [
    "bg-rose-200 text-rose-800",
    "bg-amber-200 text-amber-800",
    "bg-emerald-200 text-emerald-800",
    "bg-cyan-200 text-cyan-800",
    "bg-indigo-200 text-indigo-800",
    "bg-fuchsia-200 text-fuchsia-800",
    "bg-violet-200 text-violet-800",
    "bg-orange-200 text-orange-800",
  ];
  const charCodeSum = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

type CommentAvatarProps = {
  name: string;
  imageUrl: string | null;
  size?: "default" | "sm";
};

function CommentAvatar({
  name,
  imageUrl,
  size = "default",
}: CommentAvatarProps) {
  const isSmall = size === "sm";

  return (
    <Avatar
      size={isSmall ? "sm" : "default"}
      className={cn(
        "rounded-full border-2 border-foreground shadow-[1px_1px_0px_0px_var(--foreground)]",
        isSmall ? "size-7" : "size-8",
      )}
    >
      {imageUrl ? (
        <AvatarImage src={imageUrl} alt={name} className="rounded-full" />
      ) : null}
      <AvatarFallback
        className={cn(
          "rounded-full border-0 font-black text-foreground",
          getAvatarColor(name),
          isSmall ? "text-[10px]" : "text-xs",
        )}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

type CommentComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isPending: boolean;
  authorName: string;
  authorImageUrl: string | null;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
};

function CommentComposer({
  value,
  onChange,
  onSubmit,
  onCancel,
  isPending,
  authorName,
  authorImageUrl,
  placeholder = COURSE_PAGE.videoCommentsPlaceholder,
  submitLabel = "Comentar",
  autoFocus = false,
}: CommentComposerProps) {
  const [isFocused, setIsFocused] = useState(autoFocus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isPending) return;
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-start">
      <CommentAvatar name={authorName} imageUrl={authorImageUrl} />
      <div className="flex-1 space-y-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full bg-transparent border-b-2 border-foreground/20 py-1.5 text-sm focus:outline-none focus:border-foreground transition-all duration-200 font-sans"
        />
        {(isFocused || autoFocus) && (
          <div className="flex justify-end gap-2 animate-in fade-in-50 slide-in-from-top-1 duration-150">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs font-bold rounded-full"
              onClick={() => {
                setIsFocused(false);
                onCancel();
              }}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground font-black text-xs shadow-[2px_2px_0px_0px_var(--foreground)] border-2 border-foreground rounded-full hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              disabled={!value.trim() || isPending}
            >
              {isPending ? "Publicando…" : submitLabel}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}

type CommentItemProps = {
  comment: CoursePageLessonComment;
  isReply?: boolean;
  canComment: boolean;
  currentUserName: string;
  currentUserImageUrl: string | null;
  replyingToId: string | null;
  onStartReply: (commentId: string) => void;
  onCancelReply: () => void;
  replyDraft: string;
  onReplyDraftChange: (value: string) => void;
  onSubmitReply: (parentId: string) => void;
  isPending: boolean;
  effectiveCurrentUserId: string | null;
  onRequestDelete: (commentId: string) => void;
  isDeletePending: boolean;
};

function CommentItem({
  comment,
  isReply = false,
  canComment,
  currentUserName,
  currentUserImageUrl,
  replyingToId,
  onStartReply,
  onCancelReply,
  replyDraft,
  onReplyDraftChange,
  onSubmitReply,
  isPending,
  effectiveCurrentUserId,
  onRequestDelete,
  isDeletePending,
}: CommentItemProps) {
  const isReplying = replyingToId === comment.id;
  const canDelete =
    effectiveCurrentUserId != null &&
    comment.authorId === effectiveCurrentUserId;

  return (
    <li
      className={cn(
        "flex gap-3 items-start",
        !isReply &&
          "border-b border-foreground/5 pb-4 last:border-b-0 last:pb-0",
      )}
    >
      <CommentAvatar
        name={comment.authorName}
        imageUrl={comment.authorImageUrl}
        size={isReply ? "sm" : "default"}
      />
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-xs font-black text-foreground">
            {comment.authorName}
          </span>
          <span className="text-[9px] font-mono text-muted-foreground">
            {formatLessonCommentDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-foreground font-sans">
          {comment.body}
        </p>
        {(canComment && !isReply) || canDelete ? (
          <div className="flex items-center gap-3 pt-1.5">
            {canComment && !isReply ? (
              <button
                type="button"
                onClick={() => onStartReply(comment.id)}
                className="text-[10px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <IconCornerDownRight className="size-3" stroke={2.5} />
                Responder
              </button>
            ) : null}
            {canDelete ? (
              <button
                type="button"
                onClick={() => onRequestDelete(comment.id)}
                disabled={isDeletePending}
                className="text-[10px] font-bold text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <IconTrash className="size-3" stroke={2.5} />
                {COURSE_PAGE.videoCommentDelete}
              </button>
            ) : null}
          </div>
        ) : null}
        {isReplying ? (
          <div className="pt-3">
            <CommentComposer
              value={replyDraft}
              onChange={onReplyDraftChange}
              onSubmit={() => onSubmitReply(comment.id)}
              onCancel={() => {
                onCancelReply();
                onReplyDraftChange("");
              }}
              isPending={isPending}
              authorName={currentUserName}
              authorImageUrl={currentUserImageUrl}
              placeholder="Escribe una respuesta…"
              submitLabel="Responder"
              autoFocus
            />
          </div>
        ) : null}
        {comment.replies.length > 0 ? (
          <ul className="mt-3 space-y-3 border-l-2 border-foreground/10 pl-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                isReply
                canComment={canComment}
                currentUserName={currentUserName}
                currentUserImageUrl={currentUserImageUrl}
                replyingToId={replyingToId}
                onStartReply={onStartReply}
                onCancelReply={onCancelReply}
                replyDraft={replyDraft}
                onReplyDraftChange={onReplyDraftChange}
                onSubmitReply={onSubmitReply}
                isPending={isPending}
                effectiveCurrentUserId={effectiveCurrentUserId}
                onRequestDelete={onRequestDelete}
                isDeletePending={isDeletePending}
              />
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

const commentDialogButtonClass =
  "font-black text-xs border-2 border-foreground rounded-full shadow-[2px_2px_0px_0px_var(--foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_var(--foreground)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all";

export function CourseLessonVideoComments({
  courseSlug,
  lessonId,
  comments: initialComments,
  canComment,
  isDemo = false,
  currentUserId,
}: CourseLessonVideoCommentsProps) {
  const { user } = useUser();
  const [comments, setComments] =
    useState<CoursePageLessonComment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const currentUserName =
    user?.fullName?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    "Tú";
  const currentUserImageUrl = user?.imageUrl ?? null;
  const effectiveCurrentUserId = isDemo
    ? DEMO_LESSON_COMMENT_AUTHOR_ID
    : (currentUserId ?? null);

  const createMutation = useMutation({
    mutationFn: async (input: { body: string; parentId?: string }) => {
      if (isDemo) {
        return {
          ok: true as const,
          comment: {
            id: `local-${Date.now()}`,
            authorId: DEMO_LESSON_COMMENT_AUTHOR_ID,
            authorName: currentUserName,
            authorImageUrl: currentUserImageUrl,
            body: input.body,
            createdAt: new Date().toISOString(),
            parentId: input.parentId ?? null,
            replies: [],
          },
        };
      }

      return createLessonDiscussion({
        courseSlug,
        lessonId,
        body: input.body,
        parentId: input.parentId,
      });
    },
    onSuccess: (result, variables) => {
      if (!result.ok) {
        sonnerToast.error(result.error);
        return;
      }

      setComments((prev) => appendCommentToTree(prev, result.comment));
      sonnerToast.success(
        variables.parentId
          ? "¡Respuesta publicada!"
          : "¡Comentario publicado con éxito!",
      );

      if (variables.parentId) {
        setReplyingToId(null);
        setReplyDraft("");
      } else {
        setNewComment("");
      }
    },
    onError: () => {
      sonnerToast.error("No se pudo publicar. Intenta de nuevo.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (discussionId: string) => {
      if (isDemo) {
        return { ok: true as const };
      }

      return deleteLessonDiscussion({
        courseSlug,
        lessonId,
        discussionId,
      });
    },
    onSuccess: (result, discussionId) => {
      if (!result.ok) {
        sonnerToast.error(result.error);
        return;
      }

      setComments((prev) => removeCommentFromTree(prev, discussionId));
      if (replyingToId === discussionId) {
        setReplyingToId(null);
        setReplyDraft("");
      }
      setDeleteTargetId(null);
      sonnerToast.success(COURSE_PAGE.videoCommentDeleted);
    },
    onError: () => {
      sonnerToast.error("No se pudo eliminar. Intenta de nuevo.");
    },
  });

  const confirmDelete = () => {
    if (!deleteTargetId || deleteMutation.isPending) return;
    deleteMutation.mutate(deleteTargetId);
  };

  const totalCount = countLessonComments(comments);

  const submitComment = (body: string, parentId?: string) => {
    const trimmed = body.trim();
    if (!trimmed) return;
    createMutation.mutate({ body: trimmed, parentId });
  };

  return (
    <section
      className={cn(adminPanelClass, "overflow-hidden mt-6")}
      aria-labelledby="video-comments-title"
    >
      <header className="flex items-center gap-2 border-b-2 border-foreground px-4 py-3">
        <IconMessageCircle
          className="size-4 shrink-0 text-primary"
          stroke={2.25}
          aria-hidden
        />
        <h2
          id="video-comments-title"
          className="text-xs font-extrabold uppercase tracking-wide text-foreground font-mono"
        >
          {COURSE_PAGE.videoCommentsTitle}
        </h2>
        {totalCount > 0 ? (
          <span className="ml-auto text-[10px] font-black font-mono border-2 border-foreground bg-secondary px-2 py-0.5 rounded-full shadow-[1px_1px_0px_0px_var(--foreground)]">
            {totalCount}
          </span>
        ) : null}
      </header>

      <div className="space-y-6 p-4 sm:p-5">
        {canComment ? (
          <CommentComposer
            value={newComment}
            onChange={setNewComment}
            onSubmit={() => submitComment(newComment)}
            onCancel={() => setNewComment("")}
            isPending={createMutation.isPending}
            authorName={currentUserName}
            authorImageUrl={currentUserImageUrl}
          />
        ) : null}

        {comments.length > 0 ? (
          <ul className="space-y-4 pt-2">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                canComment={canComment}
                currentUserName={currentUserName}
                currentUserImageUrl={currentUserImageUrl}
                replyingToId={replyingToId}
                onStartReply={setReplyingToId}
                onCancelReply={() => setReplyingToId(null)}
                replyDraft={replyDraft}
                onReplyDraftChange={setReplyDraft}
                onSubmitReply={(parentId) =>
                  submitComment(replyDraft, parentId)
                }
                isPending={createMutation.isPending}
                effectiveCurrentUserId={effectiveCurrentUserId}
                onRequestDelete={setDeleteTargetId}
                isDeletePending={deleteMutation.isPending}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">
            {COURSE_PAGE.videoCommentsEmpty}
          </p>
        )}
      </div>

      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent className="border-2 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] rounded-xl sm:max-w-md">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="font-extrabold text-foreground">
              {COURSE_PAGE.videoCommentDeleteTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {COURSE_PAGE.videoCommentDeleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={commentDialogButtonClass}
              disabled={deleteMutation.isPending}
            >
              {COURSE_PAGE.videoCommentDeleteCancel}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className={cn(commentDialogButtonClass)}
              disabled={deleteMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                confirmDelete();
              }}
            >
              {deleteMutation.isPending
                ? "Eliminando…"
                : COURSE_PAGE.videoCommentDeleteConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
