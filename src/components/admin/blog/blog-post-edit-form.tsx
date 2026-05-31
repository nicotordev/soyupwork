"use client";

import {
  getAdminBlogPostForEdit,
  updateBlogPost,
} from "@/app/actions/blog.actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ADMIN_BLOG_STATUS_FILTER_OPTIONS,
  BLOG_CONTENT_FORMAT,
  BLOG_POST_STATUS,
  BLOG_POST_STATUS_LABELS,
} from "@/constants/blog.constants";
import type {
  BlogContentFormatValue,
  BlogPostStatusValue,
} from "@/constants/blog.constants";
import {
  adminInputClass,
  adminPanelClass,
  adminPanelHeaderClass,
  adminPanelTitleClass,
} from "@/lib/admin/styles";
import { toSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { AdminBlogCategoryOption } from "@/types/blog.types";
import { blogPostPath } from "@/lib/seo/blog-paths";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "@/lib/toast";
import { IconDeviceFloppy, IconExternalLink } from "@tabler/icons-react";

const STATUS_OPTIONS = ADMIN_BLOG_STATUS_FILTER_OPTIONS.filter(
  (o) => o.value !== "all",
);

type BlogPostEditFormProps = {
  postId: string;
  categories: AdminBlogCategoryOption[];
};

export function BlogPostEditForm({
  postId,
  categories,
}: BlogPostEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const slugManual = useRef(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [contentFormat, setContentFormat] = useState<BlogContentFormatValue>(
    BLOG_CONTENT_FORMAT.MARKDOWN,
  );
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [status, setStatus] = useState<BlogPostStatusValue>(
    BLOG_POST_STATUS.DRAFT,
  );
  const [isFeatured, setIsFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [tagSlugs, setTagSlugs] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    slugManual.current = false;

    void getAdminBlogPostForEdit(postId).then((result) => {
      if (cancelled) return;
      setIsLoading(false);
      if (!result.ok) {
        toast.error(result.error);
        router.push("/admin/blog");
        return;
      }

      const post = result.post;
      setTitle(post.title);
      setSlug(post.slug);
      setSubtitle(post.subtitle ?? "");
      setExcerpt(post.excerpt ?? "");
      setContent(post.content);
      setContentFormat(post.contentFormat);
      setCoverImageUrl(post.coverImageUrl ?? "");
      setStatus(post.status);
      setIsFeatured(post.isFeatured);
      setCategoryId(post.categoryId ?? "");
      setTagSlugs(post.tagSlugs.join(", "));
      setSeoTitle(post.seoTitle ?? "");
      setSeoDescription(post.seoDescription ?? "");
      setSeoKeywords(post.seoKeywords.join(", "));
      if (post.status === BLOG_POST_STATUS.PUBLISHED) {
        setPublishedSlug(post.slug);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [postId, router]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManual.current) {
      setSlug(toSlug(value));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateBlogPost({
        postId,
        title,
        slug,
        subtitle: subtitle || null,
        excerpt: excerpt || null,
        content,
        contentFormat,
        coverImageUrl: coverImageUrl || null,
        status,
        isFeatured,
        categoryId: categoryId || null,
        authorId: null,
        tagSlugs: tagSlugs
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        seo: {
          title: seoTitle || null,
          description: seoDescription || null,
          keywords: seoKeywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        },
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Artículo guardado");
      router.refresh();
      if (status === BLOG_POST_STATUS.PUBLISHED) {
        setPublishedSlug(slug);
      }
    });
  };

  if (isLoading) {
    return (
      <p className="p-6 font-mono text-xs text-muted-foreground">Cargando…</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/blog">← Volver al listado</Link>
        </Button>
        {publishedSlug ? (
          <Button type="button" variant="outline" asChild>
            <Link href={blogPostPath(publishedSlug)} target="_blank">
              Ver publicado
              <IconExternalLink className="size-4" />
            </Link>
          </Button>
        ) : null}
      </div>

      <section className={adminPanelClass}>
        <div className={adminPanelHeaderClass}>
          <h2 className={adminPanelTitleClass}>Contenido</h2>
        </div>
        <div className="space-y-4 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="blog-title">Título</Label>
              <Input
                id="blog-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={adminInputClass}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-slug">Slug</Label>
              <Input
                id="blog-slug"
                value={slug}
                onChange={(e) => {
                  slugManual.current = true;
                  setSlug(toSlug(e.target.value));
                }}
                className={adminInputClass}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-status">Estado</Label>
              <select
                id="blog-status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as BlogPostStatusValue)
                }
                className={cn(adminInputClass, "h-9 w-full")}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {BLOG_POST_STATUS_LABELS[opt.value as BlogPostStatusValue]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="blog-subtitle">Subtítulo</Label>
              <Input
                id="blog-subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className={adminInputClass}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="blog-excerpt">Extracto</Label>
              <Textarea
                id="blog-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className={adminInputClass}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="blog-cover">URL imagen de portada</Label>
              <Input
                id="blog-cover"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className={adminInputClass}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-category">Categoría</Label>
              <select
                id="blog-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={cn(adminInputClass, "h-9 w-full")}
              >
                <option value="">Sin categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-tags">Tags (slugs separados por coma)</Label>
              <Input
                id="blog-tags"
                value={tagSlugs}
                onChange={(e) => setTagSlugs(e.target.value)}
                className={adminInputClass}
                placeholder="upwork, propuestas"
              />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Checkbox
                id="blog-featured"
                checked={isFeatured}
                onCheckedChange={(v) => setIsFeatured(v === true)}
              />
              <Label htmlFor="blog-featured">Destacado en índice</Label>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="blog-content">Contenido (Markdown)</Label>
              <Textarea
                id="blog-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className={cn(
                  adminInputClass,
                  "min-h-[280px] font-mono text-xs",
                )}
                required
              />
            </div>
          </div>
        </div>
      </section>

      <section className={adminPanelClass}>
        <div className={adminPanelHeaderClass}>
          <h2 className={adminPanelTitleClass}>SEO</h2>
        </div>
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="seo-title">Meta title</Label>
            <Input
              id="seo-title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className={adminInputClass}
              placeholder={title}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-desc">Meta description</Label>
            <Textarea
              id="seo-desc"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={3}
              className={adminInputClass}
              placeholder={excerpt}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-keywords">Keywords (coma)</Label>
            <Input
              id="seo-keywords"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              className={adminInputClass}
            />
          </div>
        </div>
      </section>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        <IconDeviceFloppy className="size-4" />
        {isPending ? "Guardando…" : "Guardar artículo"}
      </Button>
    </form>
  );
}
