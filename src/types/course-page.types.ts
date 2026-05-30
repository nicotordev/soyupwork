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

export type CoursePageLessonComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  parentId: string | null;
  replies: CoursePageLessonComment[];
};

export type CoursePageVideoAiInsight = {
  summary: string;
  highlights?: string[];
  suggestedPrompts?: string[];
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
  videoPublishedAt: string | null;
  videoAuthorName: string | null;
  content: string;
  quiz: CoursePageQuizSummary | null;
  isAccessible: boolean;
  isCompleted: boolean;
  videoAiInsight: CoursePageVideoAiInsight | null;
  comments: CoursePageLessonComment[];
};

export type CoursePageModule = {
  id: string;
  title: string;
  description: string;
  position: number;
  lessons: CoursePageLesson[];
};

export type CoursePageReview = {
  id: string;
  rating: number;
  headline: string | null;
  comment: string | null;
  displayName: string | null;
  niche: string | null;
  countryCode: string | null;
  metricBefore: string | null;
  metricAfter: string | null;
  createdAt: string;
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
  estimatedDurationHours: number | null;
  enrolledStudentCount: number;
  reviewCount: number;
  averageRating: number | null;
  offersCertificate: boolean;
  hasFullAccess: boolean;
  modules: CoursePageModule[];
  reviews: CoursePageReview[];
  muxConfigured: boolean;
  muxStreamingEnabled: boolean;
  firstLessonSlug: string | null;
};

export type CoursePageData = {
  view: CoursePageView;
  mode: CoursePageMode;
};
