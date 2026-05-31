import { revalidatePath, revalidateTag } from "next/cache";
import { SITEMAP_CACHE_TAG } from "@/lib/seo/get-sitemap-entries";

export const SITEMAP_PATH = "/sitemap.xml" as const;

export function revalidateSitemap(): void {
  revalidateTag(SITEMAP_CACHE_TAG, "max");
  revalidatePath(SITEMAP_PATH);
}
