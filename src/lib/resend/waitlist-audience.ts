import "server-only";

import { getResendClient } from "@/lib/resend";
import { getServerLogger } from "@/lib/logger/server";

const log = getServerLogger("resend.waitlist-audience");

const WAITLIST_SEGMENT_NAME = "SoyUpwork Waitlist";

export function getWaitlistSegmentId(): string | undefined {
  return process.env.RESEND_WAITLIST_SEGMENT_ID?.trim() || undefined;
}

function splitName(fullName?: string | null): {
  firstName?: string;
  lastName?: string;
} {
  const trimmed = fullName?.trim();
  if (!trimmed) return {};

  const parts = trimmed.split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : undefined;

  return { firstName, lastName };
}

/**
 * Adds a verified email to the Resend waitlist segment (Contacts API).
 * Requires RESEND_WAITLIST_SEGMENT_ID — create via `bun run resend:waitlist-segment`.
 */
export async function addEmailToResendWaitlistAudience(input: {
  email: string;
  name?: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const segmentId = getWaitlistSegmentId();
  if (!segmentId) {
    log.warn(
      "RESEND_WAITLIST_SEGMENT_ID is not set; skipping Resend contact sync",
    );
    return { ok: true };
  }

  if (!process.env.RESEND_API_KEY?.trim()) {
    return { ok: false, error: "RESEND_API_KEY no está configurada." };
  }

  const email = input.email.trim().toLowerCase();
  const { firstName, lastName } = splitName(input.name);

  try {
    const { data, error } = await getResendClient().contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      segments: [{ id: segmentId }],
    });

    if (!error && data) {
      return { ok: true };
    }

    const message = error?.message?.toLowerCase() ?? "";
    const alreadyExists =
      message.includes("already") ||
      message.includes("exist") ||
      message.includes("duplicate");

    if (!alreadyExists) {
      log.error({ error, email }, "Failed to create Resend waitlist contact");
      return {
        ok: false,
        error: error?.message ?? "No se pudo agregar el contacto en Resend.",
      };
    }

    const { data: existing, error: getError } =
      await getResendClient().contacts.get({
        email,
      });

    if (getError || !existing) {
      log.error(
        { getError, email },
        "Resend contact exists but could not be loaded",
      );
      return { ok: true };
    }

    const { error: segmentError } =
      await getResendClient().contacts.segments.add({
        email,
        segmentId,
      });

    if (segmentError) {
      log.warn(
        { segmentError, email },
        "Could not add existing contact to waitlist segment",
      );
    }

    if (firstName || lastName) {
      await getResendClient().contacts.update({
        email,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
      });
    }

    return { ok: true };
  } catch (error) {
    log.error({ error, email }, "Unexpected Resend waitlist audience error");
    return {
      ok: false,
      error: "No se pudo sincronizar el contacto con Resend.",
    };
  }
}

export { WAITLIST_SEGMENT_NAME };
