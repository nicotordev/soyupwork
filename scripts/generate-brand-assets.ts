/**
 * Generates favicons, PWA icons, and apple-touch assets from public/soyupwork.png.
 *
 * Run: bun run brand:assets
 */

import { mkdir, access } from "node:fs/promises";
import { join } from "node:path";

import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE_PNG = join(ROOT, "public", "soyupwork.png");
const SOURCE_SVG = join(ROOT, "public", "soyupwork.svg");
const PUBLIC_ICONS = join(ROOT, "public", "icons");
const APP_DIR = join(ROOT, "src", "app");

const BRAND_BG = "#000000";

type OutputSpec = {
  path: string;
  size: number;
  maskable?: boolean;
};

const OUTPUTS: OutputSpec[] = [
  { path: join(APP_DIR, "icon.png"), size: 32 },
  { path: join(APP_DIR, "apple-icon.png"), size: 180 },
  { path: join(PUBLIC_ICONS, "favicon-16x16.png"), size: 16 },
  { path: join(PUBLIC_ICONS, "favicon-32x32.png"), size: 32 },
  { path: join(PUBLIC_ICONS, "icon-192.png"), size: 192 },
  { path: join(PUBLIC_ICONS, "icon-512.png"), size: 512 },
  {
    path: join(PUBLIC_ICONS, "icon-512-maskable.png"),
    size: 512,
    maskable: true,
  },
];

async function resolveSource(): Promise<string> {
  try {
    await access(SOURCE_PNG);
    return SOURCE_PNG;
  } catch {
    await access(SOURCE_SVG);
    return SOURCE_SVG;
  }
}

async function renderIcon(
  source: string,
  size: number,
  maskable: boolean,
): Promise<Buffer> {
  const innerSize = maskable ? Math.round(size * 0.8) : size;

  const resized = await sharp(source)
    .resize(innerSize, innerSize, {
      fit: "contain",
      background: BRAND_BG,
    })
    .png()
    .toBuffer();

  if (!maskable) {
    return sharp(resized)
      .resize(size, size, {
        fit: "contain",
        background: BRAND_BG,
      })
      .png()
      .toBuffer();
  }

  const offset = Math.round((size - innerSize) / 2);
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BRAND_BG,
    },
  })
    .composite([{ input: resized, top: offset, left: offset }])
    .png()
    .toBuffer();
}

async function writeFaviconIco(source: string): Promise<void> {
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((size) => renderIcon(source, size, false)),
  );

  // Minimal ICO writer: one PNG per entry (supported by modern browsers).
  const entries = pngBuffers.map((buffer, index) => ({
    size: sizes[index]!,
    buffer,
  }));

  const headerSize = 6;
  const dirEntrySize = 16;
  const dataOffset = headerSize + dirEntrySize * entries.length;

  let offset = dataOffset;
  const directory = Buffer.alloc(dirEntrySize * entries.length);
  const imageData: Buffer[] = [];

  entries.forEach((entry, index) => {
    const dirOffset = index * dirEntrySize;
    directory.writeUInt8(entry.size === 256 ? 0 : entry.size, dirOffset);
    directory.writeUInt8(entry.size === 256 ? 0 : entry.size, dirOffset + 1);
    directory.writeUInt8(0, dirOffset + 2);
    directory.writeUInt8(0, dirOffset + 3);
    directory.writeUInt16LE(1, dirOffset + 4);
    directory.writeUInt16LE(32, dirOffset + 6);
    directory.writeUInt32LE(entry.buffer.length, dirOffset + 8);
    directory.writeUInt32LE(offset, dirOffset + 12);
    imageData.push(entry.buffer);
    offset += entry.buffer.length;
  });

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  const ico = Buffer.concat([header, directory, ...imageData]);
  await Bun.write(join(APP_DIR, "favicon.ico"), ico);
  await Bun.write(join(PUBLIC_ICONS, "favicon.ico"), ico);
}

async function main(): Promise<void> {
  const source = await resolveSource();
  await mkdir(PUBLIC_ICONS, { recursive: true });

  console.log(`Source: ${source.replace(`${ROOT}/`, "")}`);

  for (const output of OUTPUTS) {
    const buffer = await renderIcon(
      source,
      output.size,
      output.maskable ?? false,
    );
    await Bun.write(output.path, buffer);
    console.log(`  wrote ${output.path.replace(`${ROOT}/`, "")}`);
  }

  await writeFaviconIco(source);
  console.log("  wrote src/app/favicon.ico");
  console.log("  wrote public/icons/favicon.ico");

  console.log("\nDone.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
