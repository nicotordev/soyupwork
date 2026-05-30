"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { IconLogout, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

type UserMenuProps = {
  className?: string;
};

export function UserMenu({ className }: UserMenuProps) {
  const { data: session, status } = useSession();

  if (status !== "authenticated" || !session?.user) {
    return (
      <div
        className={cn(
          "size-9 shrink-0 animate-pulse rounded-full border-2 border-foreground bg-muted",
          className,
        )}
        aria-hidden
      />
    );
  }

  const displayName =
    session.user.name ??
    `${session.user.firstName ?? ""} ${session.user.lastName ?? ""}`.trim() ??
    session.user.email?.split("@")[0] ??
    "Usuario";

  const avatarUrl = session.user.imageUrl ?? session.user.image ?? null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-foreground bg-secondary shadow-[2px_2px_0px_0px_var(--foreground)] focus:outline-none focus:ring-2 focus:ring-primary",
            className,
          )}
          aria-label="Menú de usuario"
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={36}
              height={36}
              className="size-full object-cover"
              unoptimized
            />
          ) : (
            <span className="font-mono text-sm font-bold">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="px-2 py-1.5">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          {session.user.email ? (
            <p className="truncate text-xs text-muted-foreground">
              {session.user.email}
            </p>
          ) : null}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="flex items-center gap-2">
            <IconUser className="size-4" aria-hidden />
            Mi perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/sign-out"
            className="flex items-center gap-2 text-destructive"
          >
            <IconLogout className="size-4" aria-hidden />
            Cerrar sesión
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
