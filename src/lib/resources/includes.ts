import type { Prisma } from "@/generated/prisma/client";

export const resourceListInclude = {
  category: {
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  },
} satisfies Prisma.ResourceInclude;

export const resourceDetailInclude = {
  ...resourceListInclude,
} satisfies Prisma.ResourceInclude;

export type DbResourceList = Prisma.ResourceGetPayload<{
  include: typeof resourceListInclude;
}>;

export type DbResourceDetail = Prisma.ResourceGetPayload<{
  include: typeof resourceDetailInclude;
}>;
