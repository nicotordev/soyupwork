export type AdminCohortStatus = "OPEN" | "CLOSED" | "FINISHED";
export type AdminCohortsStatusFilter = AdminCohortStatus | "ALL";

export type AdminCohortRow = {
  id: string;
  name: string;
  startDate: string;
  studentsCount: number;
  maxStudents: number;
  status: AdminCohortStatus;
  instructor: string;
};

export type AdminCohortsPageData = {
  cohorts: AdminCohortRow[];
  filters: {
    q: string;
    status: AdminCohortsStatusFilter;
    page: number;
    pageSize: number;
  };
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};
