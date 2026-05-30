import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@/generated/prisma/client";
import authConfig from "@/auth.config";
import prisma from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import {
  applyAdminAllowlistToUser,
  resolveRoleForAllowlistedEmail,
} from "@/lib/auth/admin";
import { getJwtUserId } from "@/lib/auth/jwt-session";
import {
  getPendingOAuthCallbackPath,
  resolveOAuthLinkRedirect,
} from "@/lib/auth/link-account";
import { sendAuthMagicLinkEmail } from "@/lib/auth/send-magic-link-email";
import {
  buildUserDisplayName,
  splitDisplayName,
} from "@/lib/auth/user-profile";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

const sessionUserSelect = {
  id: true,
  email: true,
  name: true,
  firstName: true,
  lastName: true,
  image: true,
  imageUrl: true,
  role: true,
  deletedAt: true,
} as const;

async function loadSessionUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: sessionUserSelect,
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    GitHub,
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY ?? process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
      maxAge: 60 * 60,
      sendVerificationRequest: sendAuthMagicLinkEmail,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            email: { equals: email, mode: "insensitive" },
            deletedAt: null,
          },
          select: {
            id: true,
            email: true,
            name: true,
            firstName: true,
            lastName: true,
            image: true,
            imageUrl: true,
            passwordHash: true,
            role: true,
          },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: buildUserDisplayName(user),
          image: user.image ?? user.imageUrl,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (!user.email) {
        return true;
      }

      const normalizedEmail = user.email.trim().toLowerCase();

      if (account?.provider === "google" || account?.provider === "github") {
        const currentUserId = await getJwtUserId();
        const pendingCallbackUrl = await getPendingOAuthCallbackPath();
        const linkRedirect = await resolveOAuthLinkRedirect(
          account.provider,
          normalizedEmail,
          currentUserId,
          pendingCallbackUrl,
        );

        if (typeof linkRedirect === "string") {
          return linkRedirect;
        }
      }

      const existing = await prisma.user.findFirst({
        where: {
          email: { equals: normalizedEmail, mode: "insensitive" },
          deletedAt: null,
        },
        select: { id: true },
      });

      if (!existing && account?.provider === "resend") {
        const settings = await getPlatformSettings();
        if (!settings.registrationsOpen) {
          return "/sign-in?error=RegistrationDisabled";
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      const userId =
        typeof user?.id === "string"
          ? user.id
          : typeof token.id === "string"
            ? token.id
            : null;

      if (!userId) {
        return token;
      }

      const dbUser = await loadSessionUser(userId);
      if (!dbUser || dbUser.deletedAt) {
        return token;
      }

      const syncedUser = await applyAdminAllowlistToUser(dbUser);

      token.id = syncedUser.id;
      token.email = syncedUser.email;
      token.name = buildUserDisplayName(dbUser);
      token.picture = dbUser.image ?? dbUser.imageUrl;
      token.role = syncedUser.role;
      token.firstName = dbUser.firstName;
      token.lastName = dbUser.lastName;
      token.imageUrl = dbUser.imageUrl;

      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
        session.user.role =
          typeof token.role === "string"
            ? (token.role as UserRole)
            : UserRole.STUDENT;
        session.user.firstName =
          typeof token.firstName === "string" ? token.firstName : null;
        session.user.lastName =
          typeof token.lastName === "string" ? token.lastName : null;
        session.user.imageUrl =
          typeof token.imageUrl === "string" ? token.imageUrl : null;
        session.user.email =
          typeof token.email === "string" ? token.email : session.user.email;
        session.user.name =
          typeof token.name === "string" ? token.name : session.user.name;
        session.user.image =
          typeof token.picture === "string"
            ? token.picture
            : session.user.image;
      }

      return session;
    },
  },
  events: {
    async createUser({ user }) {
      const { firstName, lastName } = splitDisplayName(user.name);
      await prisma.user.update({
        where: { id: user.id! },
        data: {
          firstName,
          lastName,
          name: user.name ?? buildUserDisplayName({ firstName, lastName }),
          image: user.image ?? null,
          imageUrl: user.image ?? null,
          emailVerified: user.email ? new Date() : null,
          role: resolveRoleForAllowlistedEmail(user.email),
        },
      });
    },
    async linkAccount({ user, account }) {
      if (account.provider === "credentials") {
        return;
      }

      await prisma.user.update({
        where: { id: user.id! },
        data: {
          emailVerified: user.email ? new Date() : undefined,
        },
      });
    },
  },
});
