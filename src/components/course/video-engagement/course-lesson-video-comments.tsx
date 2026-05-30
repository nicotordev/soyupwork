"use client";

import { createLessonDiscussion } from "@/app/actions/lesson-discussion.actions";
import { Button } from "@/components/ui/button";
import { COURSE_PAGE } from "@/constants/course-page.constants";
import { adminPanelClass } from "@/lib/admin/styles";
import {
  appendCommentToTree,
  countLessonComments,
} from "@/lib/course/lesson-discussion-tree";
import { cn } from "@/lib/utils";
import type { CoursePageLessonComment } from "@/types/course-page.types";
import { IconCornerDownRight, IconMessageCircle } from "@tabler/icons-react";
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
};

function getAvatarColor(name: string): string {
  const colors = [
    "bg-rose-200 text-rose-800 border-rose-300",
    "bg-amber-200 text-amber-800 border-amber-300",
    "bg-emerald-200 text-emerald-800 border-emerald-300",
    "bg-cyan-200 text-cyan-800 border-cyan-300",
    "bg-indigo-200 text-indigo-800 border-indigo-300",
    "bg-fuchsia-200 text-fuchsia-800 border-fuchsia-300",
    "bg-violet-200 text-violet-800 border-violet-300",
    "bg-orange-200 text-orange-800 border-orange-300",
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

type CommentComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isPending: boolean;
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
      <div className="size-8 rounded-full border-2 border-foreground bg-primary text-primary-foreground flex items-center justify-center font-black text-xs select-none shadow-[1px_1px_0px_0px_var(--foreground)] shrink-0">
        T
      </div>
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
  isDemo: boolean;
  replyingToId: string | null;
  onStartReply: (commentId: string) => void;
  onCancelReply: () => void;
  replyDraft: string;
  onReplyDraftChange: (value: string) => void;
  onSubmitReply: (parentId: string) => void;
  isPending: boolean;
};

function CommentItem({
  comment,
  isReply = false,
  canComment,
  isDemo,
  replyingToId,
  onStartReply,
  onCancelReply,
  replyDraft,
  onReplyDraftChange,
  onSubmitReply,
  isPending,
}: CommentItemProps) {
  const avatarColor = getAvatarColor(comment.authorName);
  const initials = getInitials(comment.authorName);
  const isReplying = replyingToId === comment.id;

  return (
    <li
      className={cn(
        "flex gap-3 items-start",
        !isReply &&
          "border-b border-foreground/5 pb-4 last:border-b-0 last:pb-0",
      )}
    >
      <div
        className={cn(
          "size-8 rounded-full border-2 border-foreground flex items-center justify-center font-black text-xs select-none shadow-[1px_1px_0px_0px_var(--foreground)] shrink-0",
          avatarColor,
          isReply && "size-7 text-[10px]",
        )}
      >
        {initials}
      </div>
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
        {canComment && !isReply ? (
          <div className="flex items-center pt-1.5">
            <button
              type="button"
              onClick={() => onStartReply(comment.id)}
              className="text-[10px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <IconCornerDownRight className="size-3" stroke={2.5} />
              Responder
            </button>
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
                isDemo={isDemo}
                replyingToId={replyingToId}
                onStartReply={onStartReply}
                onCancelReply={onCancelReply}
                replyDraft={replyDraft}
                onReplyDraftChange={onReplyDraftChange}
                onSubmitReply={onSubmitReply}
                isPending={isPending}
              />
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

export function CourseLessonVideoComments({
  courseSlug,
  lessonId,
  comments: initialComments,
  canComment,
  isDemo = false,
}: CourseLessonVideoCommentsProps) {
  const [comments, setComments] =
    useState<CoursePageLessonComment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");

  const createMutation = useMutation({
    mutationFn: async (input: { body: string; parentId?: string }) => {
      if (isDemo) {
        return {
          ok: true as const,
          comment: {
            id: `local-${Date.now()}`,
            authorName: "Tú",
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
          />
        ) : null}

        {comments.length > 0 ? (
          <ul className="space-y-4 pt-2">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                canComment={canComment}
                isDemo={isDemo}
                replyingToId={replyingToId}
                onStartReply={setReplyingToId}
                onCancelReply={() => setReplyingToId(null)}
                replyDraft={replyDraft}
                onReplyDraftChange={setReplyDraft}
                onSubmitReply={(parentId) =>
                  submitComment(replyDraft, parentId)
                }
                isPending={createMutation.isPending}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">
            {COURSE_PAGE.videoCommentsEmpty}
          </p>
        )}
      </div>
    </section>
  );
}
