import { z } from "zod";

const relativePath = z
  .string()
  .trim()
  .min(1, "La ruta es obligatoria.")
  .max(200)
  .refine(
    (value) => value.startsWith("/"),
    "Debe ser una ruta relativa (ej. /dashboard).",
  );

const optionalEmail = z
  .string()
  .trim()
  .max(120)
  .refine(
    (value) => value === "" || z.email().safeParse(value).success,
    "Correo inválido.",
  );

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => value === "" || z.url().safeParse(value).success,
    "URL inválida.",
  );

export const generalSettingsSchema = z
  .object({
    siteName: z
      .string()
      .trim()
      .min(1, "El nombre del sitio es obligatorio.")
      .max(80),
    siteTagline: z.string().trim().max(160),
    supportEmail: optionalEmail,
    maintenanceMode: z.boolean(),
    maintenanceMessage: z.string().trim().max(500),
    maintenanceAllowAdmins: z.boolean(),
    waitlistMode: z.boolean(),
    waitlistMessage: z.string().trim().max(500),
    waitlistAllowCatalog: z.boolean(),
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
        message:
          "Desactiva mantenimiento o waitlist; no pueden estar activos a la vez.",
      });
    }
  });

export const authSettingsSchema = z.object({
  registrationsOpen: z.boolean(),
  afterSignInUrl: relativePath,
  afterSignUpUrl: relativePath,
  requireVerifiedEmail: z.boolean(),
  allowOAuthSignIn: z.boolean(),
});

export const paymentsSettingsSchema = z.object({
  stripeCurrency: z
    .string()
    .trim()
    .toLowerCase()
    .length(3, "Usa un código ISO de 3 letras (ej. usd)."),
  enableStripeCheckout: z.boolean(),
  showTaxBreakdown: z.boolean(),
  refundPolicyDays: z.coerce
    .number()
    .int()
    .min(0, "Mínimo 0 días.")
    .max(90, "Máximo 90 días."),
});

export const emailSettingsSchema = z.object({
  emailFrom: z.string().trim().max(120),
  emailSupport: optionalEmail,
  sendPurchaseConfirmation: z.boolean(),
  sendEnrollmentEmail: z.boolean(),
});

export const storageSettingsSchema = z.object({
  maxFileSizeMb: z.coerce
    .number()
    .int()
    .min(1, "Mínimo 1 MB.")
    .max(10_000, "Máximo 10000 MB."),
  maxVideoSizeMb: z.coerce
    .number()
    .int()
    .min(1, "Mínimo 1 MB.")
    .max(50_000, "Máximo 50000 MB."),
  storagePublicUrl: optionalUrl,
});

export const videoSettingsSchema = z.object({
  enableMuxStreaming: z.boolean(),
  videoSignedPlayback: z.boolean(),
  defaultVideoQuality: z.enum(["auto", "1080p", "720p", "480p"]),
});

export const notificationsSettingsSchema = z.object({
  notifyAdminOnPurchase: z.boolean(),
  notifyAdminOnRefund: z.boolean(),
  notifyStudentOnEnrollment: z.boolean(),
  notifyStudentOnCertificate: z.boolean(),
  enableInAppNotifications: z.boolean(),
  rateLimitMaxRequests: z.coerce
    .number()
    .int()
    .min(10, "Mínimo 10 solicitudes.")
    .max(10_000, "Máximo 10000 solicitudes."),
  rateLimitWindowMs: z.coerce
    .number()
    .int()
    .min(1000, "Mínimo 1000 ms.")
    .max(3_600_000, "Máximo 3600000 ms."),
  logLevel: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]),
  analyticsRetentionDays: z.coerce
    .number()
    .int()
    .min(7, "Mínimo 7 días.")
    .max(3650, "Máximo 3650 días."),
});
