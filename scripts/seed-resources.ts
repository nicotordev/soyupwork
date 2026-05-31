/**
 * Seed guides & templates from legacy static catalog.
 * Run: bun run scripts/seed-resources.ts
 */
import { ResourceKind, ResourceStatus } from "../src/generated/prisma/client";
import prisma from "../src/lib/db/prisma";
import {
  SEED_GUIDE_CATEGORIES,
  SEED_GUIDE_CONTENT,
  SEED_GUIDE_ITEMS,
  SEED_TEMPLATE_CATEGORIES,
  SEED_TEMPLATE_DETAILS,
  SEED_TEMPLATE_ITEMS,
} from "../src/lib/resources/legacy-seed-data";
import {
  tsAvailabilityToDb,
  tsKindToDb,
} from "../src/lib/resources/map-resource";

function tagSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

async function upsertCategories(
  categories: typeof SEED_GUIDE_CATEGORIES,
  kind: ResourceKind,
) {
  const map = new Map<string, string>();

  for (const [index, category] of categories.entries()) {
    const row = await prisma.resourceCategory.upsert({
      where: {
        kind_slug: { kind, slug: category.slug },
      },
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        kind,
        position: index,
      },
      update: {
        name: category.name,
        description: category.description,
        position: index,
      },
    });
    map.set(category.slug, row.id);
  }

  return map;
}

async function upsertTags(tagNames: string[]) {
  const map = new Map<string, string>();

  for (const name of tagNames) {
    const slug = tagSlug(name);
    const row = await prisma.resourceTag.upsert({
      where: { slug },
      create: { slug, name },
      update: { name },
    });
    map.set(name, row.id);
  }

  return map;
}

async function seedResources(
  items: typeof SEED_GUIDE_ITEMS,
  categoryMap: Map<string, string>,
  tagMap: Map<string, string>,
  kind: ResourceKind,
) {
  for (const item of items) {
    const categoryId = categoryMap.get(item.categorySlug);
    const content =
      kind === ResourceKind.GUIDE
        ? (SEED_GUIDE_CONTENT[item.slug] ?? null)
        : null;
    const templateDetail =
      kind === ResourceKind.TEMPLATE
        ? SEED_TEMPLATE_DETAILS[item.slug]
        : undefined;

    const hasDetail =
      kind === ResourceKind.GUIDE
        ? Boolean(content?.trim())
        : Boolean(templateDetail?.sections.length);

    const status =
      hasDetail || item.availability === "coming_soon"
        ? ResourceStatus.PUBLISHED
        : ResourceStatus.DRAFT;

    const resource = await prisma.resource.upsert({
      where: { slug: item.slug },
      create: {
        slug: item.slug,
        title: item.title,
        subtitle: item.subtitle,
        excerpt: item.excerpt,
        kind: tsKindToDb(item.kind),
        availability: tsAvailabilityToDb(item.availability),
        status,
        readingTimeMinutes: item.readingTimeMinutes ?? null,
        fileLabel: item.fileLabel ?? null,
        featured: item.featured,
        relatedHref: item.relatedHref ?? null,
        relatedLabel: item.relatedLabel ?? null,
        publishedAt: status === ResourceStatus.PUBLISHED ? new Date() : null,
        content,
        templateSections: templateDetail?.sections ?? undefined,
        templateIncludes: templateDetail?.includes ?? [],
        categoryId,
      },
      update: {
        title: item.title,
        subtitle: item.subtitle,
        excerpt: item.excerpt,
        kind: tsKindToDb(item.kind),
        availability: tsAvailabilityToDb(item.availability),
        status,
        readingTimeMinutes: item.readingTimeMinutes ?? null,
        fileLabel: item.fileLabel ?? null,
        featured: item.featured,
        relatedHref: item.relatedHref ?? null,
        relatedLabel: item.relatedLabel ?? null,
        publishedAt: status === ResourceStatus.PUBLISHED ? new Date() : null,
        content,
        templateSections: templateDetail?.sections ?? undefined,
        templateIncludes: templateDetail?.includes ?? [],
        categoryId,
      },
    });

    await prisma.resourceTagJoin.deleteMany({
      where: { resourceId: resource.id },
    });

    for (const tagName of item.tags) {
      const tagId = tagMap.get(tagName);
      if (!tagId) continue;
      await prisma.resourceTagJoin.create({
        data: { resourceId: resource.id, tagId },
      });
    }

    console.log(`  ✓ ${item.slug} (${status})`);
  }
}

async function main() {
  console.log("Seeding resource categories…");
  const guideCategoryMap = await upsertCategories(
    SEED_GUIDE_CATEGORIES,
    ResourceKind.GUIDE,
  );
  const templateCategoryMap = await upsertCategories(
    SEED_TEMPLATE_CATEGORIES,
    ResourceKind.TEMPLATE,
  );

  const allTags = [
    ...new Set([
      ...SEED_GUIDE_ITEMS.flatMap((item) => [...item.tags]),
      ...SEED_TEMPLATE_ITEMS.flatMap((item) => [...item.tags]),
    ]),
  ];
  console.log("Seeding resource tags…");
  const tagMap = await upsertTags(allTags);

  console.log("Seeding guides…");
  await seedResources(
    SEED_GUIDE_ITEMS,
    guideCategoryMap,
    tagMap,
    ResourceKind.GUIDE,
  );

  console.log("Seeding templates…");
  await seedResources(
    SEED_TEMPLATE_ITEMS,
    templateCategoryMap,
    tagMap,
    ResourceKind.TEMPLATE,
  );

  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
