export const ADMIN_USERS_PAGE = {
  eyebrow: "Panel de administración",
  title: "Estudiantes y Permisos",
  description: "Gestión de alumnos, roles y permisos de acceso.",
  createUserTitle: "Crear miembro",
  createUserDescription:
    "Se creará la cuenta con correo y contraseña en la base de datos.",
  createUserSuccess: (name: string) => `${name} fue creado correctamente.`,
  createUserError: "No se pudo crear el usuario.",
  editUserTitle: "Editar miembro",
  editUserDescription:
    "Actualizá nombre y apellido. Los cambios se guardan en la base de datos.",
  editUserSuccess: (name: string) => `${name} fue actualizado correctamente.`,
  editUserError: "No se pudo actualizar el usuario.",
} as const;

export const ADMIN_USERS_FILTER_ALL = "ALL" as const;

/** Mirrors Prisma `UserRole` — safe for client components (no Prisma import). */
export const USER_ROLES = ["STUDENT", "INSTRUCTOR", "ADMIN"] as const;

export type AppUserRole = (typeof USER_ROLES)[number];

export const ADMIN_USERS_DEFAULT_PAGE = 1;
export const ADMIN_USERS_DEFAULT_PAGE_SIZE = 20;
export const ADMIN_USERS_MAX_PAGE_SIZE = 50;

export const ADMIN_USERS_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export const ADMIN_USERS_STATUS_FILTER = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ALL: "all",
} as const;

export type AdminUsersStatusFilter =
  (typeof ADMIN_USERS_STATUS_FILTER)[keyof typeof ADMIN_USERS_STATUS_FILTER];

export const ADMIN_USERS_STATUS_FILTER_OPTIONS = [
  { value: ADMIN_USERS_STATUS_FILTER.ACTIVE, label: "Activos" },
  { value: ADMIN_USERS_STATUS_FILTER.INACTIVE, label: "Inactivos" },
  { value: ADMIN_USERS_STATUS_FILTER.ALL, label: "Todos" },
] as const;

export const ADMIN_USERS_ROLE_FILTER_OPTIONS = [
  { value: ADMIN_USERS_FILTER_ALL, label: "Todos" },
  { value: USER_ROLES[0], label: "Estudiantes" },
  { value: USER_ROLES[1], label: "Instructores" },
  { value: USER_ROLES[2], label: "Administradores" },
] as const;
