import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/sign-in",
    verifyRequest: "/sign-in/verify",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  providers: [],
} satisfies NextAuthConfig;
