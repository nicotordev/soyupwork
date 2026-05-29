"use client";

import { useEffect, useState } from "react";
import { getStudentProfile } from "@/app/actions/profile.actions";
import { PROFILE_QUERY_KEY } from "@/components/dashboard/user-profile-settings-form";
import {
  STUDENT_ACCOUNT_NAV,
  STUDENT_EXPLORE_NAV,
  STUDENT_LEARNING_NAV,
  type StudentNavItem,
} from "@/constants/student-nav.constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { IconLogout, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

type UserProfileDropdownProps = {
  className?: string;
  role?: "student" | "admin" | "instructor";
};

const menuLinkClassName =
  "flex items-center gap-2 p-1.5 font-mono text-[10px] font-bold uppercase text-foreground hover:bg-secondary/15 hover:underline rounded border border-transparent hover:border-foreground/10 transition-colors focus:bg-secondary/15 focus:text-foreground";

function DropdownNavLink({ item }: { item: StudentNavItem }) {
  const Icon = item.icon;

  return (
    <DropdownMenuItem asChild>
      <Link href={item.href} className={menuLinkClassName}>
        <Icon className="size-3.5 text-primary" stroke={2.5} />
        {item.label}
      </Link>
    </DropdownMenuItem>
  );
}

function DropdownNavSection({
  label,
  items,
}: {
  label: string;
  items: StudentNavItem[];
}) {
  if (items.length === 0) return null;

  return (
    <>
      <DropdownMenuLabel className="px-1.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </DropdownMenuLabel>
      {items.map((item) => (
        <DropdownNavLink key={item.href} item={item} />
      ))}
    </>
  );
}

function ProfileDropdownPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "size-8 shrink-0 animate-pulse rounded-full border-2 border-foreground bg-muted",
        className,
      )}
      aria-hidden
    />
  );
}

export function UserProfileDropdown({
  className,
  role = "student",
}: UserProfileDropdownProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const result = await getStudentProfile();
      if (!result.ok) {
        throw new Error(result.error);
      }
      return {
        profile: result.profile,
        storageConfigured: result.storageConfigured,
        maxAvatarSizeMb: result.maxAvatarSizeMb,
      };
    },
    enabled: isLoaded && Boolean(isSignedIn),
    staleTime: 60_000,
  });

  if (!hasMounted || !isLoaded || !isSignedIn) {
    return <ProfileDropdownPlaceholder className={className} />;
  }

  const profile = profileQuery.data?.profile;

  const userDisplayName =
    profile?.firstName || profile?.lastName
      ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
      : user.firstName || user.lastName
        ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
        : (user.primaryEmailAddress?.emailAddress.split("@")[0] ??
          "Estudiante");

  const userEmail =
    profile?.email ?? user.primaryEmailAddress?.emailAddress ?? "";

  const avatarUrl = profile?.imageUrl ?? user.imageUrl ?? null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-foreground bg-secondary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary",
            adminBrutalButtonClass,
            className,
          )}
          aria-label="Menú de usuario"
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={32}
              height={32}
              className="object-cover size-full"
              unoptimized
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-primary/20 font-mono text-sm font-bold">
              {userDisplayName.charAt(0).toUpperCase()}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="max-h-[min(32rem,85vh)] w-64 overflow-y-auto p-3 bg-card border-2 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] text-left space-y-1 rounded-lg focus:outline-hidden"
      >
        <div className="flex items-center gap-3 pb-2 border-b border-foreground/15">
          {avatarUrl ? (
            <div className="relative size-10 overflow-hidden rounded-full border border-foreground bg-muted shrink-0">
              <Image
                src={avatarUrl}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground bg-primary/20 font-mono text-sm font-bold">
              {userDisplayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 text-left">
            <p className="truncate text-xs font-extrabold leading-none text-foreground">
              {userDisplayName}
            </p>
            <p className="truncate font-mono text-[9px] text-muted-foreground mt-0.5">
              {userEmail}
            </p>
            <BadgeRole role={role} />
          </div>
        </div>

        {role === "admin" ? (
          <>
            <DropdownMenuLabel className="px-1.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              Administración
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/admin" className={menuLinkClassName}>
                <IconUser className="size-3.5 text-primary" stroke={2.5} />
                Panel de Admin
              </Link>
            </DropdownMenuItem>
          </>
        ) : null}

        <DropdownNavSection
          label="Mi Aprendizaje"
          items={STUDENT_LEARNING_NAV}
        />
        <DropdownNavSection label="Explorar" items={STUDENT_EXPLORE_NAV} />
        <DropdownNavSection label="Cuenta" items={STUDENT_ACCOUNT_NAV} />

        <DropdownMenuSeparator className="bg-foreground/15 my-1" />
        <SignOutButton redirectUrl="/">
          <DropdownMenuItem asChild>
            <button
              type="button"
              className={cn(
                menuLinkClassName,
                "w-full text-destructive hover:bg-destructive/10 hover:border-destructive/20 focus:bg-destructive/10 focus:text-destructive",
              )}
            >
              <IconLogout className="size-3.5" stroke={2.5} />
              Cerrar sesión
            </button>
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BadgeRole({ role }: { role: "student" | "admin" | "instructor" }) {
  const labels = {
    student: "Estudiante",
    admin: "Administrador",
    instructor: "Instructor",
  };

  return (
    <span className="inline-block mt-1 px-1.5 py-0.5 rounded border border-foreground/30 bg-secondary/10 font-mono text-[8px] font-bold uppercase text-muted-foreground leading-none">
      {labels[role]}
    </span>
  );
}
