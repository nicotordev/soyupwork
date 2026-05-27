/**
 * Downloads Apple-style country flag PNGs (Emojipedia CDN) into public/emojis/apple/flags/.
 * Filenames: {ISO}.png (e.g. MX.png) for use in the phone country dropdown.
 *
 * Run: bun run scripts/download-apple-country-flags.ts
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getCountries } from "libphonenumber-js";
import { getCountryFlagEmojiSlug } from "../src/lib/phone/country-flag-slug";

const CDN_BASE = "https://em-content.zobj.net/source/apple/453";
const OUT_DIR = join(process.cwd(), "public/emojis/apple/flags");

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const countries = getCountries();
  let ok = 0;
  let fail = 0;
  const failed: string[] = [];

  for (const code of countries) {
    const slug = getCountryFlagEmojiSlug(code);
    const url = `${CDN_BASE}/${slug}.png`;
    const outPath = join(OUT_DIR, `${code}.png`);

    const res = await fetch(url);
    if (!res.ok) {
      console.error(`FAIL ${code} (${res.status}) ${slug}`);
      fail++;
      failed.push(code);
      continue;
    }

    await writeFile(outPath, Buffer.from(await res.arrayBuffer()));
    console.log(`OK   ${code}`);
    ok++;
  }

  console.log(`\nDone: ${ok} downloaded, ${fail} failed → ${OUT_DIR}`);
  if (failed.length > 0) {
    console.log("Failed:", failed.join(", "));
  }
  if (fail > 0) process.exit(1);
}

main();
