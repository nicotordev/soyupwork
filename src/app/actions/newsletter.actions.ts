"use server";

import prisma from "@/lib/prisma";
import { sendNewsletterVerificationEmail } from "@/lib/email/send-newsletter-verification";
import { z } from "zod";
import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import { verifyTurnstileToken } from "@/lib/turnstile/verify";
import { WAITLIST_VERIFICATION } from "@/lib/waitlist/verification.constants";
import {
  generateWaitlistVerificationCode,
  getWaitlistVerificationExpiry,
  hashWaitlistVerificationCode,
  hasExceededWaitlistVerificationAttempts,
  isWaitlistVerificationExpired,
  verifyWaitlistCode,
} from "@/lib/waitlist/verification";

// Validation schema for newsletter subscriber input
const newsletterSubscribeSchema = z.object({
  email: z.string().email({ message: "Correo inválido." }),
  name: z.string().max(100).optional(),
  phone: z.string().max(30).optional(),
  source: z.string().max(100).default("newsletter-page").optional(),
  turnstileToken: z.string().optional(),
});

export type SubscribeNewsletterResult =
  | { ok: true }
  | { ok: false; error: string };

export type ConfirmNewsletterVerificationResult =
  | { ok: true }
  | { ok: false; error: string };

const log = getServerLogger("newsletter.actions");

// Action to subscribe a user to the newsletter
export async function subscribeNewsletter(
  input: unknown,
): Promise<SubscribeNewsletterResult> {
  try {
    const parsed = newsletterSubscribeSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }
    const { email, name, phone, source, turnstileToken } = parsed.data;

    const turnstile = await verifyTurnstileToken(turnstileToken);
    if (!turnstile.ok) {
      return { ok: false, error: turnstile.error };
    }

    const normalizedEmail = email.toLowerCase();

    // Prevent duplicate subscriptions by email (unique)
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return { ok: true }; // silently succeed for idempotency
    }

    const code = generateWaitlistVerificationCode();
    const codeHash = hashWaitlistVerificationCode(normalizedEmail, code);
    const expiresAt = getWaitlistVerificationExpiry();

    await prisma.newsletterVerification.upsert({
      where: { email: normalizedEmail },
      create: {
        email: normalizedEmail,
        codeHash,
        name: name?.trim() || null,
        phone: phone?.trim() || null,
        source,
        expiresAt,
        attempts: 0,
      },
      update: {
        codeHash,
        name: name?.trim() || null,
        phone: phone?.trim() || null,
        source,
        expiresAt,
        attempts: 0,
      },
    });

    await sendNewsletterVerificationEmail({ to: normalizedEmail, code });

    log.info(
      { email: normalizedEmail, name, phone, source },
      "Newsletter verification requested",
    );

    return { ok: true };
  } catch (error) {
    log.error(
      serializeError(error),
      "Failed to request newsletter verification",
    );
    return {
      ok: false,
      error: "No se pudo enviar el correo de verificación. Intenta nuevamente.",
    };
  }
}

// Action to confirm newsletter verification and finalize subscription
export async function confirmNewsletterVerification(input: {
  email: string;
  code: string;
}): Promise<ConfirmNewsletterVerificationResult> {
  const email = input.email.trim().toLowerCase();
  const code = input.code.replace(/\D/g, "");

  if (code.length !== WAITLIST_VERIFICATION.codeLength) {
    return {
      ok: false,
      error: `El código debe tener ${WAITLIST_VERIFICATION.codeLength} dígitos.`,
    };
  }

  try {
    const pending = await prisma.newsletterVerification.findUnique({
      where: { email },
    });

    if (!pending) {
      return {
        ok: false,
        error: "No hay una verificación pendiente. Solicita un código nuevo.",
      };
    }

    if (isWaitlistVerificationExpired(pending.expiresAt)) {
      await prisma.newsletterVerification.delete({ where: { email } });
      return {
        ok: false,
        error: "El código expiró. Solicita uno nuevo.",
      };
    }

    if (hasExceededWaitlistVerificationAttempts(pending.attempts)) {
      await prisma.newsletterVerification.delete({ where: { email } });
      return {
        ok: false,
        error: "Demasiados intentos. Solicita un código nuevo.",
      };
    }

    const valid = verifyWaitlistCode(email, code, pending.codeHash);
    if (!valid) {
      const attempts = pending.attempts + 1;
      if (attempts >= WAITLIST_VERIFICATION.maxAttempts) {
        await prisma.newsletterVerification.delete({ where: { email } });
        return {
          ok: false,
          error: "Demasiados intentos. Solicita un código nuevo.",
        };
      }

      await prisma.newsletterVerification.update({
        where: { email },
        data: { attempts },
      });

      return { ok: false, error: "Código incorrecto." };
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: {
        email,
        name: pending.name,
        phone: pending.phone,
        source: pending.source,
      },
      update: {
        name: pending.name,
        phone: pending.phone,
        source: pending.source,
      },
    });

    await prisma.newsletterVerification
      .delete({ where: { email } })
      .catch((error: unknown) => {
        log.warn(
          { error, email },
          "Newsletter subscribed but pending verification cleanup failed",
        );
      });

    return { ok: true };
  } catch (error) {
    log.error(
      serializeError(error),
      "Failed to confirm newsletter verification",
    );
    return { ok: false, error: "No se pudo confirmar la suscripción." };
  }
}

// Action to remove a newsletter subscriber by email
export async function unsubscribeNewsletter(
  email: string,
): Promise<{ ok: boolean; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    await prisma.$transaction([
      prisma.newsletterSubscriber.deleteMany({
        where: { email: normalizedEmail },
      }),
      prisma.newsletterVerification.deleteMany({
        where: { email: normalizedEmail },
      }),
    ]);

    log.info({ email: normalizedEmail }, "Newsletter subscription removed");

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "Failed to unsubscribe from newsletter");
    return { ok: false, error: "No se pudo cancelar la suscripción." };
  }
}
