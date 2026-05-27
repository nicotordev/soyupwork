import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/shared/error";
import { getServerLogger } from "@/lib/logger/server";

const log = getServerLogger("clerk.waitlist");

const DUPLICATE_WAITLIST_ERROR_CODES = new Set([
  "form_identifier_exists",
  "form_identifier_exists__email_address",
  "duplicate_record",
]);

function isDuplicateWaitlistError(error: unknown): boolean {
  if (!isClerkAPIResponseError(error)) return false;
  return error.errors.some((entry) =>
    DUPLICATE_WAITLIST_ERROR_CODES.has(entry.code ?? ""),
  );
}

/**
 * Registers an email in Clerk Waitlist (Dashboard → User & authentication → Waitlist).
 * Clerk only stores the email; name/phone remain in our database.
 */
export async function syncEmailToClerkWaitlist(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const emailAddress = email.trim().toLowerCase();

  try {
    const client = await clerkClient();

    const existing = await client.waitlistEntries.list({
      query: emailAddress,
      limit: 1,
    });

    if (existing.data.length > 0) {
      return { ok: true };
    }

    await client.waitlistEntries.create({
      emailAddress,
      notify: false,
    });

    return { ok: true };
  } catch (error) {
    if (isDuplicateWaitlistError(error)) {
      return { ok: true };
    }

    log.error(
      { error, email: emailAddress },
      "Failed to sync waitlist entry to Clerk",
    );

    if (isClerkAPIResponseError(error)) {
      const first = error.errors[0];
      if (first?.longMessage) return { ok: false, error: first.longMessage };
      if (first?.message) return { ok: false, error: first.message };
    }

    return {
      ok: false,
      error:
        "No se pudo registrar en la lista de espera de Clerk. Revisa que el modo waitlist esté activo en el dashboard.",
    };
  }
}
