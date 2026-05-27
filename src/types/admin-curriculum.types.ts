import type {
  CourseStatus,
  LessonType,
  LessonVideoStatus,
} from "@/generated/prisma/client";

export type AdminCurriculumQuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  position: number;
};

export type AdminCurriculumQuizQuestion = {
  id: string;
  question: string;
  position: number;
  options: AdminCurriculumQuizOption[];
};

export type AdminCurriculumQuiz = {
  id: string;
  title: string;
  description: string;
  passingScore: number;
  questions: AdminCurriculumQuizQuestion[];
};

export type AdminCurriculumLesson = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: LessonType;
  position: number;
  isPreview: boolean;
  content: string;
  videoStatus: LessonVideoStatus | null;
  videoPlaybackId: string | null;
  durationSec: number | null;
  quiz: AdminCurriculumQuiz | null;
};

export type AdminCurriculumModule = {
  id: string;
  title: string;
  description: string;
  position: number;
  lessons: AdminCurriculumLesson[];
};

export type AdminCurriculumCourse = {
  id: string;
  title: string;
  slug: string;
  status: CourseStatus;
  moduleCount: number;
  lessonCount: number;
};

export type AdminCourseCurriculumData = {
  course: AdminCurriculumCourse;
  modules: AdminCurriculumModule[];
  muxConfigured: boolean;
  muxStreamingEnabled: boolean;
  maxVideoSizeMb: number;
};

export type CurriculumActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type InitLessonVideoUploadData = {
  uploadId: string;
  uploadUrl: string;
};

export type LessonVideoStatusData = {
  videoStatus: LessonVideoStatus | null;
  videoPlaybackId: string | null;
};
