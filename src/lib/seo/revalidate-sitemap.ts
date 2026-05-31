import { revalidatePath } from "next/cache";

export const SITEMAP_PATH = "/sitemap.xml" as const;

export function revalidateSitemap(): void {
  revalidatePath(SITEMAP_PATH);
}
