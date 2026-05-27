import {
  APPLE_EMOJI_SLUGS,
  QUIZ_CHECK_EMOJI_SLUG,
  QUIZ_EMOJI_POOL_SLUGS,
  type AppleEmojiSlug,
} from "@/constants/apple-emoji-slugs";

export { APPLE_EMOJI_SLUGS, QUIZ_CHECK_EMOJI_SLUG, type AppleEmojiSlug };

/** Local Apple-style emoji assets (see scripts/download-apple-emojis.ts) */
export const APPLE_EMOJI_DIR = "/emojis/apple" as const;

export type AppleEmojiFile = `${AppleEmojiSlug}.png`;

export function toAppleEmojiFile(slug: AppleEmojiSlug): AppleEmojiFile {
  return `${slug}.png`;
}

function pool(...slugs: readonly AppleEmojiSlug[]): readonly AppleEmojiFile[] {
  return slugs.map(toAppleEmojiFile);
}

/** Random pools for quiz screens — one pick per screen mount */
export const QUIZ_EMOJI_POOLS = {
  intro: pool(...QUIZ_EMOJI_POOL_SLUGS.intro),
  feedbackCorrect: pool(...QUIZ_EMOJI_POOL_SLUGS.feedbackCorrect),
  feedbackIncorrect: pool(...QUIZ_EMOJI_POOL_SLUGS.feedbackIncorrect),
  resultsSuccess: pool(...QUIZ_EMOJI_POOL_SLUGS.resultsSuccess),
  resultsWarning: pool(...QUIZ_EMOJI_POOL_SLUGS.resultsWarning),
  resultsFail: pool(...QUIZ_EMOJI_POOL_SLUGS.resultsFail),
} as const;

export const QUIZ_CHECK_EMOJI_FILE = toAppleEmojiFile(QUIZ_CHECK_EMOJI_SLUG);
