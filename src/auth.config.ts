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
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      const userId =
        typeof token.id === "string"
          ? token.id
          : typeof token.sub === "string"
            ? token.sub
            : null;

      if (session.user && userId) {
        session.user.id = userId;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
