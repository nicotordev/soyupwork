import type {
  CourseLevel,
  CourseStatus,
  LessonType,
  LessonVideoStatus,
} from "@/generated/prisma/client";

export type CoursePageMode = "student" | "adminPreview" | "publicDemo";

export type CoursePageQuizSummary = {
  id: string;
  title: string;
  passingScore: number;
  questionCount: number;
};

export type CoursePageLesson = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: LessonType;
  position: number;
  isPreview: boolean;
  durationSec: number | null;
  videoPlaybackId: string | null;
  videoStatus: LessonVideoStatus | null;
  content: string;
  quiz: CoursePageQuizSummary | null;
  isAccessible: boolean;
};

export type CoursePageModule = {
  id: string;
  title: string;
  description: string;
  position: number;
  lessons: CoursePageLesson[];
};

export type CoursePageView = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  status: CourseStatus;
  level: CourseLevel;
  levelLabel: string;
  priceLabel: string;
  priceCents: number;
  isFree: boolean;
  categoryName: string | null;
  instructorName: string;
  moduleCount: number;
  lessonCount: number;
  offersCertificate: boolean;
  hasFullAccess: boolean;
  modules: CoursePageModule[];
  muxConfigured: boolean;
  muxStreamingEnabled: boolean;
  firstLessonSlug: string | null;
};

export type CoursePageData = {
  view: CoursePageView;
  mode: CoursePageMode;
};
