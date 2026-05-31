import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalMarketingShell } from "@/components/legal/legal-marketing-shell";
import { BlogPostArticle } from "@/components/blog/blog-post-article";
import { getPublishedBlogPostBySlug } from "@/lib/blog/get-public-blog";
import { getPublishedBlogPostSeoMetadata } from "@/lib/seo/fetch-public-seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const metadata = await getPublishedBlogPostSeoMetadata(slug);

  if (metadata) return metadata;

  return {
    title: "Artículo no encontrado",
    robots: { index: false, follow: false },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <LegalMarketingShell seed={319} shapeCount={3}>
      <div className="relative z-10 pt-8 sm:pt-10">
        <BlogPostArticle post={post} />
      </div>
    </LegalMarketingShell>
  );
}
