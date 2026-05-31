import type { DbBlogPostDetail, DbBlogPostList } from "@/lib/blog/includes";
import type {
  BlogAuthorSummary,
  BlogCategorySummary,
  BlogPostDetail,
  BlogPostSummary,
  BlogTagSummary,
} from "@/types/blog.types";

function mapAuthor(author: DbBlogPostList["author"]): BlogAuthorSummary | null {
  if (!author) return null;
  return {
    id: author.id,
    name: author.name?.trim() || "Equipo soyup.work",
    imageUrl: author.imageUrl ?? author.image ?? null,
  };
}

function mapCategory(
  category: DbBlogPostList["category"],
): BlogCategorySummary | null {
  if (!category) return null;
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    icon: category.icon,
    position: category.position,
  };
}

function mapTags(tags: DbBlogPostList["tags"]): BlogTagSummary[] {
  return tags.map(({ tag }) => ({
    id: tag.id,
    slug: tag.slug,
    name: tag.name,
  }));
}

export function mapDbBlogPostToSummary(post: DbBlogPostList): BlogPostSummary {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle,
    excerpt: post.excerpt,
    coverImageUrl: post.coverImageUrl,
    status: post.status,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    readingTimeMinutes: post.readingTimeMinutes,
    isFeatured: post.isFeatured,
    contentFormat: post.contentFormat,
    category: mapCategory(post.category),
    author: mapAuthor(post.author),
    tags: mapTags(post.tags),
  };
}

export function mapDbBlogPostToDetail(post: DbBlogPostDetail): BlogPostDetail {
  return {
    ...mapDbBlogPostToSummary(post),
    content: post.content,
  };
}
