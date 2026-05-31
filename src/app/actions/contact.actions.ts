"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/resend";
import { getServerLogger } from "@/lib/logger/server";
import { serializeError } from "@/lib/logger/serialize-error";
import { getResolvedEmailSupport } from "@/lib/platform/settings/resolve";
import { verifyTurnstileToken } from "@/lib/turnstile/verify";
import {
  CONTACT_TOPICS,
  type ContactTopicValue,
} from "@/constants/contact.constants";

const contactTopicValues = CONTACT_TOPICS.map((t) => t.value) as [
  ContactTopicValue,
  ...ContactTopicValue[],
];

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Indica tu nombre.")
    .max(100, "Nombre demasiado largo."),
  email: z.string().email("Correo inválido."),
  topic: z.enum(contactTopicValues, {
    message: "Selecciona un tema.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "El mensaje debe tener al menos 20 caracteres.")
    .max(5000, "Mensaje demasiado largo."),
  turnstileToken: z.string().optional(),
});

export type SubmitContactResult = { ok: true } | { ok: false; error: string };

const log = getServerLogger("contact.actions");

function topicLabel(topic: ContactTopicValue): string {
  return CONTACT_TOPICS.find((t) => t.value === topic)?.label ?? topic;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function submitContactMessage(
  input: unknown,
): Promise<SubmitContactResult> {
  try {
    const parsed = contactSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      };
    }

    const { name, email, topic, message, turnstileToken } = parsed.data;

    const turnstile = await verifyTurnstileToken(turnstileToken);
    if (!turnstile.ok) {
      return { ok: false, error: turnstile.error };
    }

    const supportTo = await getResolvedEmailSupport();
    if (!supportTo) {
      log.warn("contact.submit.missing_support_email");
      return {
        ok: false,
        error:
          "El canal de soporte no está configurado. Intenta más tarde o escríbenos por redes oficiales.",
      };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const subject = `[soyup.work] ${topicLabel(topic)} — ${name}`;
    const html = `
      <p><strong>Tema:</strong> ${escapeHtml(topicLabel(topic))}</p>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Correo:</strong> ${escapeHtml(normalizedEmail)}</p>
      <hr />
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    `;

    await sendEmail({
      to: supportTo,
      subject,
      html,
    });

    return { ok: true };
  } catch (error) {
    log.error(serializeError(error), "contact.submit.failed");
    return {
      ok: false,
      error: "No pudimos enviar tu mensaje. Intenta de nuevo en unos minutos.",
    };
  }
}
