import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/db/prisma";

type PrismaDb = typeof prisma | Prisma.TransactionClient;

export async function upsertLessonProgressComplete(
  userId: string,
  lessonId: string,
  db: PrismaDb = prisma,
  completedAt: Date = new Date(),
): Promise<void> {
  await db.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    create: {
      userId,
      lessonId,
      completed: true,
      completedAt,
      lastSeenAt: completedAt,
    },
    update: {
      completed: true,
      completedAt,
      lastSeenAt: completedAt,
    },
  });
}
