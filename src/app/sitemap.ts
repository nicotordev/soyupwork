import { getSitemapEntries } from "@/lib/seo/get-sitemap-entries";

/** Skip build-time prerender — Docker build has no database. */
export const dynamic = "force-dynamic";

export default getSitemapEntries;
