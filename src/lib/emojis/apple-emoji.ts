import type { AppleEmojiSlug } from "@/constants/apple-emoji-slugs";
import {
  APPLE_EMOJI_DIR,
  toAppleEmojiFile,
  type AppleEmojiFile,
} from "@/constants/apple-emojis.constants";

export function appleEmojiSrc(file: AppleEmojiFile): string;
export function appleEmojiSrc(slug: AppleEmojiSlug): string;
export function appleEmojiSrc(
  fileOrSlug: AppleEmojiFile | AppleEmojiSlug,
): string {
  const file = fileOrSlug.endsWith(".png")
    ? fileOrSlug
    : toAppleEmojiFile(fileOrSlug as AppleEmojiSlug);
  return `${APPLE_EMOJI_DIR}/${file}`;
}

export function pickFromPool<T>(pool: readonly T[]): T {
  return pool[Math.floor(Math.random() * pool.length)]!;
}
