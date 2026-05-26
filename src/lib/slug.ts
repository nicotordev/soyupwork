import slugify from "slugify";

const SLUGIFY_OPTIONS = {
  lower: true,
  strict: true,
  trim: true,
  locale: "es",
} as const;

/** URL-safe slug from display text (names, titles). */
export function toSlug(value: string): string {
  return slugify(value, SLUGIFY_OPTIONS);
}

export { slugify };
