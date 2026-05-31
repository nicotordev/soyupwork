export const BLOG_INDEX_PATH = "/resources/blog";

export function blogPostPath(slug: string): string {
  return `${BLOG_INDEX_PATH}/${slug}`;
}
