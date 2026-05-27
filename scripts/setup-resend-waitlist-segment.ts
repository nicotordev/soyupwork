/**
 * Creates (or finds) the Resend segment for waitlist contacts.
 * Prints RESEND_WAITLIST_SEGMENT_ID for .env
 *
 * Run: bun run resend:waitlist-segment
 */

import { Resend } from "resend";
import { WAITLIST_SEGMENT_NAME } from "../src/lib/resend/waitlist-audience";

async function main() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const configured = process.env.RESEND_WAITLIST_SEGMENT_ID?.trim();

  if (configured) {
    const { data, error } = await resend.segments.get(configured);
    if (error || !data) {
      console.error(`Segment ${configured} not found:`, error?.message);
      process.exit(1);
    }
    console.log(`Segment OK: ${data.name} (${data.id})`);
    return;
  }

  const { data: list, error: listError } = await resend.segments.list();
  if (listError) {
    console.error("Failed to list segments:", listError.message);
    process.exit(1);
  }

  const existing = list?.data.find(
    (segment) => segment.name === WAITLIST_SEGMENT_NAME,
  );
  if (existing) {
    console.log(`Found segment: ${existing.name}`);
    console.log(`\nAdd to .env:\nRESEND_WAITLIST_SEGMENT_ID=${existing.id}\n`);
    return;
  }

  const { data: created, error: createError } = await resend.segments.create({
    name: WAITLIST_SEGMENT_NAME,
  });

  if (createError || !created) {
    console.error("Failed to create segment:", createError?.message);
    process.exit(1);
  }

  console.log(`Created segment: ${created.name}`);
  console.log(`\nAdd to .env:\nRESEND_WAITLIST_SEGMENT_ID=${created.id}\n`);
}

main();
