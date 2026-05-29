"use client";

import { CourseLessonVideoAiPanel } from "@/components/course/video-engagement/course-lesson-video-ai-panel";
import { CourseLessonVideoComments } from "@/components/course/video-engagement/course-lesson-video-comments";
import type {
  CoursePageLesson,
  CoursePageMode,
} from "@/types/course-page.types";

type CourseLessonVideoEngagementProps = {
  lesson: CoursePageLesson;
  mode: CoursePageMode;
};

export function CourseLessonVideoEngagement({
  lesson,
  mode,
}: CourseLessonVideoEngagementProps) {
  return (
    <div className="space-y-6">
      <CourseLessonVideoAiPanel insight={lesson.videoAiInsight} mode={mode} />
      <CourseLessonVideoComments comments={lesson.placeholderComments} />
    </div>
  );
}
