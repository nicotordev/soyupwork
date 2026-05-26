"use server";

import { serializeError } from "@/lib/logger/serialize-error";
import { getServerLogger } from "@/lib/logger/server";
import prisma from "@/lib/prisma";

const log = getServerLogger("categories.actions");

export async function getPaginatedCategories(page: number, pageSize: number) {
  log.debug({ page, pageSize }, "Fetching paginated categories");

  try {
    const [categories, total] = await Promise.all([
      prisma.courseCategory.findMany({
        orderBy: { position: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, slug: true, name: true, position: true },
      }),
      prisma.courseCategory.count(),
    ]);

    log.info(
      { page, pageSize, returned: categories.length, total },
      "Paginated categories loaded",
    );

    return { categories, total };
  } catch (error) {
    log.error(serializeError(error), "Failed to fetch paginated categories");
    return { categories: [], total: 0 };
  }
}
