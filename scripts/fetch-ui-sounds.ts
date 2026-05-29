/**
 * Verifies UI sound assets referenced by src/lib/ui-sounds/profiles.ts exist.
 * Sound files live in public/sounds/ and are committed to the repo.
 *
 * Run: bun run sounds:fetch
 */

import { access, readdir } from "node:fs/promises";
import { join } from "node:path";

import {
  UI_SOUND_PROFILES,
  type UiSoundProfileId,
} from "../src/lib/ui-sounds/profiles";

const SOUNDS_DIR = join(process.cwd(), "public", "sounds");

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function verifyProfile(profileId: UiSoundProfileId): Promise<boolean> {
  const profile = UI_SOUND_PROFILES[profileId];
  let ok = true;

  for (const [id, publicPath] of Object.entries(profile.paths)) {
    const filePath = join(
      process.cwd(),
      "public",
      publicPath.replace(/^\//, ""),
    );
    if (!(await fileExists(filePath))) {
      console.error(`  missing [${profileId}] ${id}: ${publicPath}`);
      ok = false;
    }
  }

  return ok;
}

async function main() {
  console.log("Verifying UI sound assets in public/sounds/…");

  const defaultOk = await verifyProfile("default");
  const casinoOk = await verifyProfile("casino");

  if (!defaultOk || !casinoOk) {
    console.error("\nSome sound files are missing.");
    process.exit(1);
  }

  const files = await readdir(SOUNDS_DIR);
  console.log(`OK — ${files.length} files in public/sounds/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
