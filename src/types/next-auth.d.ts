import type { UserRole } from "@/generated/prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      firstName: string | null;
      lastName: string | null;
      imageUrl: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string | null;
  }
}

export {};
