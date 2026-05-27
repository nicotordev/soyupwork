import { UserRole } from "@/generated/prisma/client";
import { z } from "zod";

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.nativeEnum(UserRole),
});

export const setUserActiveSchema = z.object({
  userId: z.string().uuid(),
  active: z.boolean(),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type SetUserActiveInput = z.infer<typeof setUserActiveSchema>;
