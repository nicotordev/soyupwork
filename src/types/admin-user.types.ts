import type {
  ADMIN_USERS_FILTER_ALL,
  AdminUsersStatusFilter,
  AppUserRole,
} from "@/constants/users.constants";

export type AdminUserRow = {
  id: string;
  displayName: string;
  email: string | null;
  imageUrl: string | null;
  role: AppUserRole;
  isActive: boolean;
  enrollmentCount: number;
  instructedCourseCount: number;
  createdAt: string;
};

export type AdminUsersStats = {
  total: number;
  students: number;
  instructors: number;
  admins: number;
};

export type ParsedAdminUsersParams = {
  q: string;
  page: number;
  pageSize: number;
  role: AppUserRole | typeof ADMIN_USERS_FILTER_ALL;
  status: AdminUsersStatusFilter;
};

export type AdminUsersPagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type AdminUsersPageData = {
  users: AdminUserRow[];
  stats: AdminUsersStats;
  filters: ParsedAdminUsersParams;
  pagination: AdminUsersPagination;
  currentAdminUserId: string;
};

export type UpdateUserRoleResult = { ok: true } | { ok: false; error: string };

export type SetUserActiveResult = { ok: true } | { ok: false; error: string };
