import type {
  AdminWaitlistInviteStatusFilter,
  AppWaitlistInviteStatus,
} from "@/constants/waitlist-admin.constants";

export type AdminWaitlistEntryRow = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string | null;
  createdAt: string;
  hasUserAccount: boolean;
  latestInvite: {
    id: string;
    status: AppWaitlistInviteStatus;
    expiresAt: string;
    createdAt: string;
  } | null;
};

export type AdminWaitlistStats = {
  totalEntries: number;
  pendingInvites: number;
  acceptedInvites: number;
  withUserAccount: number;
};

export type ParsedAdminWaitlistParams = {
  page: number;
  pageSize: number;
  q: string;
  inviteStatus: AdminWaitlistInviteStatusFilter;
};

export type AdminWaitlistPagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type AdminWaitlistPageData = {
  entries: AdminWaitlistEntryRow[];
  stats: AdminWaitlistStats;
  filters: ParsedAdminWaitlistParams;
  pagination: AdminWaitlistPagination;
};

export type SendWaitlistInviteResult =
  | { ok: true }
  | { ok: false; error: string };

export type RevokeWaitlistInviteResult =
  | { ok: true }
  | { ok: false; error: string };

export type AcceptWaitlistInviteTokenResult =
  | { ok: true; email: string }
  | { ok: false; error: string };

export type WaitlistInviteSignUpContext = {
  hasValidInvite: boolean;
  email: string | null;
};
