export const ADMIN_WAITLIST_PAGE = {
  eyebrow: "Panel de administración",
  title: "Lista de espera",
  description:
    "Personas que confirmaron su correo en la lista de espera e invitaciones para registrarse.",
  inviteDialogTitle: "Invitar por correo",
  inviteDialogDescription:
    "Se enviará un enlace con token de un solo uso para crear cuenta en la plataforma.",
  inviteSuccess: (email: string) => `Invitación enviada a ${email}.`,
  inviteError: "No se pudo enviar la invitación.",
  revokeSuccess: "Invitación revocada.",
} as const;

export const ADMIN_WAITLIST_DEFAULT_PAGE = 1;
export const ADMIN_WAITLIST_DEFAULT_PAGE_SIZE = 20;
export const ADMIN_WAITLIST_MAX_PAGE_SIZE = 50;
export const ADMIN_WAITLIST_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export const ADMIN_WAITLIST_INVITE_STATUS_FILTER = {
  ALL: "all",
  NONE: "none",
  PENDING: "pending",
  ACCEPTED: "accepted",
  REVOKED: "revoked",
  EXPIRED: "expired",
} as const;

export type AdminWaitlistInviteStatusFilter =
  (typeof ADMIN_WAITLIST_INVITE_STATUS_FILTER)[keyof typeof ADMIN_WAITLIST_INVITE_STATUS_FILTER];

export const ADMIN_WAITLIST_INVITE_STATUS_FILTER_OPTIONS = [
  { value: ADMIN_WAITLIST_INVITE_STATUS_FILTER.ALL, label: "Todas" },
  { value: ADMIN_WAITLIST_INVITE_STATUS_FILTER.NONE, label: "Sin invitar" },
  { value: ADMIN_WAITLIST_INVITE_STATUS_FILTER.PENDING, label: "Pendiente" },
  { value: ADMIN_WAITLIST_INVITE_STATUS_FILTER.ACCEPTED, label: "Aceptada" },
  { value: ADMIN_WAITLIST_INVITE_STATUS_FILTER.EXPIRED, label: "Expirada" },
  { value: ADMIN_WAITLIST_INVITE_STATUS_FILTER.REVOKED, label: "Revocada" },
] as const;

/** Mirrors Prisma `WaitlistInviteStatus` — safe for client components. */
export const WAITLIST_INVITE_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "EXPIRED",
  "REVOKED",
] as const;

export type AppWaitlistInviteStatus = (typeof WAITLIST_INVITE_STATUSES)[number];

export const WAITLIST_INVITE_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  EXPIRED: "EXPIRED",
  REVOKED: "REVOKED",
} as const satisfies Record<AppWaitlistInviteStatus, AppWaitlistInviteStatus>;

export const WAITLIST_INVITE_STATUS_LABELS: Record<AppWaitlistInviteStatus, string> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptada",
  EXPIRED: "Expirada",
  REVOKED: "Revocada",
};
