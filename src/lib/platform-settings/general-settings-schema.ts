import { z } from "zod";

export const generalSettingsSchema = z
  .object({
    siteName: z.string().trim().min(1, "El nombre del sitio es obligatorio.").max(80),
    siteTagline: z.string().trim().max(160),
    supportEmail: z
      .string()
      .trim()
      .max(120)
      .refine(
        (value) => value === "" || z.email().safeParse(value).success,
        "Correo de soporte inválido.",
      ),
    maintenanceMode: z.boolean(),
    maintenanceMessage: z.string().trim().max(500),
    maintenanceAllowAdmins: z.boolean(),
    waitlistMode: z.boolean(),
    waitlistMessage: z.string().trim().max(500),
    waitlistAllowCatalog: z.boolean(),
    registrationsOpen: z.boolean(),
    showAnnouncementBanner: z.boolean(),
    announcementMessage: z.string().trim().max(280),
  })
  .superRefine((data, ctx) => {
    if (data.showAnnouncementBanner && !data.announcementMessage.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["announcementMessage"],
        message: "Agrega el texto del anuncio.",
      });
    }

    if (data.maintenanceMode && data.waitlistMode) {
      ctx.addIssue({
        code: "custom",
        path: ["waitlistMode"],
        message: "Desactiva mantenimiento o waitlist; no pueden estar activos a la vez.",
      });
    }
  });
