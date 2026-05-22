import { auth } from "@clerk/nextjs/server";

/** Lee la sesión de Clerk en el servidor (RSC, Route Handlers, Server Actions). */
export async function getClerkSession() {
  const { userId, sessionId } = await auth();
  return {
    userId,
    sessionId,
    isSignedIn: userId != null,
  };
}
