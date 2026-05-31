import { BlogContentFormat, BlogPostStatus } from "@/generated/prisma/client";
import { z } from "zod";

const tagSlugsSchema = z
  .array(z.string().min(1).max(80))
  .max(20)
  .optional()
  .default([]);

export const blogSeoSchema = z.object({
  title: z.string().max(120).nullable().optional(),
  description: z.string().max(320).nullable().optional(),
  keywords: z.array(z.string().max(60)).max(20).optional().default([]),
});

export const createBlogPostSchema = z.object({
  title: z.string().trim().min(3, "Título demasiado corto.").max(200),
  slug: z.string().trim().max(200).optional(),
});

export const updateBlogPostSchema = z.object({
  postId: z.string().uuid(),
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(1).max(200),
  subtitle: z.string().max(300).nullable().optional(),
  excerpt: z.string().max(500).nullable().optional(),
  content: z.string().min(1, "El contenido es obligatorio."),
  contentFormat: z.nativeEnum(BlogContentFormat),
  coverImageUrl: z
    .string()
    .max(2048)
    .nullable()
    .optional()
    .transform((v) => {
      const trimmed = v?.trim();
      if (!trimmed) return null;
      return trimmed;
    }),
  status: z.nativeEnum(BlogPostStatus),
  isFeatured: z.boolean(),
  categoryId: z.string().uuid().nullable().optional(),
  authorId: z.string().uuid().nullable().optional(),
  tagSlugs: tagSlugsSchema,
  seo: blogSeoSchema.optional().nullable(),
});

export const deleteBlogPostSchema = z.object({
  postId: z.string().uuid(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type DeleteBlogPostInput = z.infer<typeof deleteBlogPostSchema>;
