import apiResponse from "@/lib/api/api-response";
import prisma from "@/lib/db/prisma";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ clerkId: string }> },
) {
  const { clerkId } = await ctx.params;

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    return apiResponse.notFound(null, "User not found");
  }

  return apiResponse.success(user);
}
