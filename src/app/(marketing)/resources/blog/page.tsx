import type { Metadata } from "next";
import { LegalMarketingShell } from "@/components/legal/legal-marketing-shell";
import { BlogIndexContent } from "@/components/blog/blog-index-content";
import { buildBlogIndexMetadata } from "@/constants/blog.constants";
import { getBlogIndexPageData } from "@/lib/blog/get-public-blog";

export const metadata: Metadata = buildBlogIndexMetadata();

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const data = await getBlogIndexPageData(resolved);

  return (
    <LegalMarketingShell seed={318} shapeCount={4}>
      <BlogIndexContent data={data} />
    </LegalMarketingShell>
  );
}
