import type { ADMIN_COURSES_FILTER_ALL } from "@/constants/courses.constants";
import type { CourseLevel, CourseStatus } from "@/generated/prisma/client";

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
  slug: string;
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
};
