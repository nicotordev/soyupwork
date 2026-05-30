import "server-only";

import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getJwtUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = await getToken({
    req: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
    secret: process.env.AUTH_SECRET,
  });

  if (typeof token?.id === "string") {
    return token.id;
  }

  if (typeof token?.sub === "string") {
    return token.sub;
  }

  return null;
}
