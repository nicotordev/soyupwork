/**
 * Downloads Apple-style emoji PNGs from Emojipedia CDN (zobj) into public/emojis/apple/.
 * Source: https://emojipedia.org/es/apple/ios-26.4
 *
 * Run: bun run scripts/download-apple-emojis.ts
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { APPLE_EMOJI_SLUGS } from "../src/constants/apple-emoji-slugs";

const CDN_BASE = "https://em-content.zobj.net/source/apple/453";
const OUT_DIR = join(process.cwd(), "public/emojis/apple");

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  let ok = 0;
  let fail = 0;

  for (const slug of APPLE_EMOJI_SLUGS) {
    const url = `${CDN_BASE}/${slug}.png`;
    const outPath = join(OUT_DIR, `${slug}.png`);

    const res = await fetch(url);
    if (!res.ok) {
      console.error(`FAIL ${slug} (${res.status})`);
      fail++;
      continue;
    }

    await writeFile(outPath, Buffer.from(await res.arrayBuffer()));
    console.log(`OK   ${slug}`);
    ok++;
  }

  console.log(`\nDone: ${ok} downloaded, ${fail} failed → ${OUT_DIR}`);
  if (fail > 0) process.exit(1);
}

main();
