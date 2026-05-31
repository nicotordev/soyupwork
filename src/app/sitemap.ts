import {
  getSitemapEntries,
  SITEMAP_REVALIDATE_SECONDS,
} from "@/lib/seo/get-sitemap-entries";

export const revalidate = SITEMAP_REVALIDATE_SECONDS;

export default getSitemapEntries;
