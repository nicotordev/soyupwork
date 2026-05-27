import { USER_ROLES } from "@/constants/users.constants";
import { z } from "zod";

export const createAdminUserSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio.")
    .email("Ingresá un correo válido."),
  firstName: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(80, "El nombre es demasiado largo."),
  lastName: z
    .string()
    .trim()
    .min(1, "El apellido es obligatorio.")
    .max(80, "El apellido es demasiado largo."),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(72, "La contraseña es demasiado larga."),
  role: z.enum(USER_ROLES),
});

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(USER_ROLES),
});

export const setUserActiveSchema = z.object({
  userId: z.string().uuid(),
  active: z.boolean(),
});

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type SetUserActiveInput = z.infer<typeof setUserActiveSchema>;
