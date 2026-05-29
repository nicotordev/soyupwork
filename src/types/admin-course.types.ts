import type { ADMIN_COURSES_FILTER_ALL } from "@/constants/courses.constants";
import type {
  BillingInterval,
  CourseLevel,
  CourseStatus,
  ProductType,
} from "@/generated/prisma/client";

export type AdminCoursesFilterAll = typeof ADMIN_COURSES_FILTER_ALL;

export type AdminCourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  status: CourseStatus;
  level: CourseLevel;
  levelLabel: string;
  categoryName: string | null;
  categorySlug: string | null;
  priceLabel: string;
  priceCents: number;
  isFree: boolean;
  isFeatured: boolean;
  offersCertificate: boolean;
  enrollmentCount: number;
  moduleCount: number;
  lessonCount: number;
  instructorName: string;
  updatedAt: string;
};

export type AdminCoursesStats = {
  total: number;
  published: number;
  draft: number;
  archived: number;
};

export type AdminCourseCategoryOption = {
  id: string;
  slug: string;
  name: string;
};

export type AdminCourseForEdit = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string | null;
  status: CourseStatus;
  level: CourseLevel;
  priceCents: number;
  categoryId: string | null;
  isFeatured: boolean;
  offersCertificate: boolean;
  productType: ProductType;
  billingInterval: BillingInterval | null;
  trialDays: number | null;
};

export type InitCourseThumbnailUploadData = {
  uploadUrl: string;
  thumbnailUrl: string;
};

export type AdminCourseCategorySelectOption = {
  id: string;
  name: string;
};

export type ParsedAdminCoursesParams = {
  q: string;
  status: CourseStatus | AdminCoursesFilterAll;
  level: CourseLevel | AdminCoursesFilterAll;
  categorySlug: string | AdminCoursesFilterAll;
  page: number;
  pageSize: number;
};

export type AdminCoursesPagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type AdminCoursesPageData = {
  courses: AdminCourseRow[];
  stats: AdminCoursesStats;
  categories: AdminCourseCategoryOption[];
  filters: ParsedAdminCoursesParams;
  pagination: AdminCoursesPagination;
  storageConfigured: boolean;
  maxThumbnailSizeMb: number;
};

export type GenerateCourseSyllabusResult =
  | {
      ok: true;
      syllabus: {
        description: string;
        modules: { title: string; lessons: string[] }[];
      };
    }
  | { ok: false; error: string };

export type CreateAiDraftCourseResult =
  | { ok: true; course: { id: string; slug: string; title: string } }
  | { ok: false; error: string };

export type GetAdminCourseForEditResult =
  | {
      ok: true;
      course: AdminCourseForEdit;
      categories: AdminCourseCategorySelectOption[];
      storageConfigured: boolean;
      maxThumbnailSizeMb: number;
    }
  | { ok: false; error: string };

export type InitCourseThumbnailUploadResult =
  | ({ ok: true } & InitCourseThumbnailUploadData)
  | { ok: false; error: string };

export type SetCourseThumbnailResult =
  | { ok: true }
  | { ok: false; error: string };

export type UpdateCourseResult =
  | { ok: true; course: { id: string; slug: string; title: string } }
  | { ok: false; error: string };

export type DeleteCourseResult =
  | { ok: true; course: { id: string; slug: string; title: string } }
  | { ok: false; error: string };
