import { getSitemapEntries } from "@/lib/seo/get-sitemap-entries";

/** Must be a literal — Next.js analyzes segment config at build time. */
export const revalidate = 3600;

export default getSitemapEntries;
