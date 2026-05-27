/**
 * Downloads Kenney "UI Audio" (CC0) and copies a curated subset to public/sounds/.
 * Source: https://github.com/Calinou/kenney-ui-audio
 * Credit: Kenney.nl (optional)
 *
 * Run: bun run sounds:fetch
 */

import { spawnSync } from "node:child_process";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ZIP_URL = "https://github.com/Calinou/kenney-ui-audio/archive/master.zip";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "public", "sounds");
const TMP_ZIP = join(ROOT, ".tmp", "kenney_ui_audio.zip");
const TMP_EXTRACT = join(ROOT, ".tmp", "kenney_ui_audio");

/** Kenney path inside zip → public filename */
const SOUNDS: Record<string, string> = {
  "kenney-ui-audio-master/addons/kenney_ui_audio/click4.wav": "click.wav",
  "kenney-ui-audio-master/addons/kenney_ui_audio/switch14.wav": "success.wav",
  "kenney-ui-audio-master/addons/kenney_ui_audio/switch13.wav": "error.wav",
  "kenney-ui-audio-master/addons/kenney_ui_audio/switch15.wav": "warning.wav",
  "kenney-ui-audio-master/addons/kenney_ui_audio/switch12.wav": "toggle.wav",
  "kenney-ui-audio-master/addons/kenney_ui_audio/rollover2.wav": "select.wav",
  "kenney-ui-audio-master/addons/kenney_ui_audio/switch2.wav": "open.wav",
  "kenney-ui-audio-master/addons/kenney_ui_audio/switch11.wav": "close.wav",
  "kenney-ui-audio-master/addons/kenney_ui_audio/mouseclick1.wav":
    "navigate.wav",
};

async function downloadZip(): Promise<void> {
  await mkdir(join(ROOT, ".tmp"), { recursive: true });
  const response = await fetch(ZIP_URL);
  if (!response.ok) {
    throw new Error(`Failed to download sounds (${response.status})`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(TMP_ZIP, buffer);
}

function extractZip(): void {
  const result = spawnSync("unzip", ["-o", TMP_ZIP, "-d", TMP_EXTRACT], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error("unzip failed — install unzip and retry");
  }
}

async function copySounds(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });

  for (const [srcRelative, destName] of Object.entries(SOUNDS)) {
    const src = join(TMP_EXTRACT, srcRelative);
    const dest = join(OUT_DIR, destName);
    await copyFile(src, dest);
    console.log(`  ${destName}`);
  }

  await writeFile(
    join(OUT_DIR, "ATTRIBUTION.txt"),
    [
      "UI sounds from Kenney.nl — UI Audio pack (CC0 1.0)",
      "https://kenney.nl/assets/ui-audio",
      "https://github.com/Calinou/kenney-ui-audio",
      "",
      "Fetched via: bun run sounds:fetch",
    ].join("\n"),
  );
}

async function main() {
  console.log("Downloading Kenney UI Audio…");
  await downloadZip();
  console.log("Extracting…");
  extractZip();
  console.log("Copying to public/sounds/:");
  await copySounds();
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
