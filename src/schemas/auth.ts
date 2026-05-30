import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio.")
    .email("Ingresá un correo válido."),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria.")
    .max(72, "La contraseña es demasiado larga."),
});

export const registerUserSchema = z.object({
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
});

export type SignInInput = z.infer<typeof signInSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
