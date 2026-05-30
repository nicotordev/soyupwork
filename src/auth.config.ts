import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  providers: [],
} satisfies NextAuthConfig;
