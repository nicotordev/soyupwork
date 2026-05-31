import {
  ResourceAvailability,
  ResourceKind,
  ResourceStatus,
} from "@/generated/prisma/client";
import { z } from "zod";

const tagSlugsSchema = z
  .array(z.string().min(1).max(80))
  .max(20)
  .optional()
  .default([]);

const templateSectionSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(4000),
});

export const createResourceSchema = z.object({
  title: z.string().trim().min(3, "Título demasiado corto.").max(200),
  kind: z.enum(["guide", "template"]),
  slug: z.string().trim().max(200).optional(),
});

export const updateResourceSchema = z.object({
  resourceId: z.string().uuid(),
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(1).max(200),
  subtitle: z.string().max(300).nullable().optional(),
  excerpt: z.string().trim().min(1).max(500),
  kind: z.nativeEnum(ResourceKind),
  availability: z.nativeEnum(ResourceAvailability),
  status: z.nativeEnum(ResourceStatus),
  readingTimeMinutes: z.number().int().min(1).max(999).nullable().optional(),
  fileLabel: z.string().max(120).nullable().optional(),
  featured: z.boolean(),
  categoryId: z.string().uuid().nullable().optional(),
  relatedHref: z.string().max(500).nullable().optional(),
  relatedLabel: z.string().max(200).nullable().optional(),
  content: z.string().nullable().optional(),
  templateSections: z.array(templateSectionSchema).optional().default([]),
  templateIncludes: z.array(z.string().max(200)).optional().default([]),
  tagSlugs: tagSlugsSchema,
});

export const deleteResourceSchema = z.object({
  resourceId: z.string().uuid(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
export type DeleteResourceInput = z.infer<typeof deleteResourceSchema>;
