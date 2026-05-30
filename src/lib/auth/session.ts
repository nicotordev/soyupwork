import { auth } from "@/auth";

export async function getAuthSession() {
  const session = await auth();

  return {
    userId: session?.user?.id ?? null,
    isSignedIn: session?.user?.id != null,
  };
}
