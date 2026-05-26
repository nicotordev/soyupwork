import { CATEGORY_ICON_NAMES } from "@/constants/category-icons.constants";
import { z } from "zod";

export const categorySlugField = z
  .string()
  .trim()
  .min(1, "El slug es obligatorio.")
  .max(80)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Usa solo minúsculas, números y guiones.",
  );

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio.").max(80),
  slug: categorySlugField,
  icon: z.union([z.literal(""), z.enum(CATEGORY_ICON_NAMES)]),
  position: z.number().int().min(0).nullable(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
