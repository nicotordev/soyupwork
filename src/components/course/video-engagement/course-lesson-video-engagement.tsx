"use client";

import { CourseLessonVideoAiPanel } from "@/components/course/video-engagement/course-lesson-video-ai-panel";
import { CourseLessonVideoComments } from "@/components/course/video-engagement/course-lesson-video-comments";
import {
  isAdminPreviewMode,
  isPublicDemoMode,
} from "@/lib/course/course-page-mode";
import type {
  CoursePageLesson,
  CoursePageLessonComment,
  CoursePageMode,
  CoursePageView,
} from "@/types/course-page.types";

type CourseLessonVideoEngagementProps = {
  view: CoursePageView;
  lesson: CoursePageLesson;
  mode: CoursePageMode;
  lessonComments?: CoursePageLessonComment[];
  currentUserId?: string | null;
};

export function CourseLessonVideoEngagement({
  view,
  lesson,
  mode,
  lessonComments,
  currentUserId,
}: CourseLessonVideoEngagementProps) {
  const comments = lessonComments ?? lesson.comments;
  const isDemo = isPublicDemoMode(mode);
  const canComment =
    isDemo || (!isAdminPreviewMode(mode) && view.hasFullAccess);

  return (
    <div className="space-y-6">
      <CourseLessonVideoAiPanel insight={lesson.videoAiInsight} mode={mode} />
      <CourseLessonVideoComments
        courseSlug={view.slug}
        lessonId={lesson.id}
        comments={comments}
        canComment={canComment}
        isDemo={isDemo}
        currentUserId={currentUserId}
      />
    </div>
  );
}
