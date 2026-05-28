"use client";

import {
  getStudentProfile,
  updateStudentProfile,
} from "@/app/actions/profile.actions";
import { UserAvatarUploader } from "@/components/dashboard/user-avatar-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminBrutalButtonClass, adminInputClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { updateStudentProfileSchema } from "@/schemas/profile";
import type { StudentProfileQueryData } from "@/types/student-profile.types";
import { useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IconLoader } from "@tabler/icons-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "@/lib/toast";

export const PROFILE_QUERY_KEY = ["student-profile"] as const;

type UserProfileSettingsFormProps = {
  enabled?: boolean;
  variant?: "dialog" | "page";
  onSaved?: () => void;
  onCancel?: () => void;
};

export function UserProfileSettingsForm({
  enabled = true,
  variant = "page",
  onSaved,
  onCancel,
}: UserProfileSettingsFormProps) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async (): Promise<StudentProfileQueryData> => {
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
    enabled,
  });

  const profile = profileQuery.data?.profile;
  const storageConfigured = profileQuery.data?.storageConfigured ?? false;
  const maxAvatarSizeMb = profileQuery.data?.maxAvatarSizeMb ?? 5;

  useEffect(() => {
    if (!enabled || !profile) return;
    setFirstName(profile.firstName ?? "");
    setLastName(profile.lastName ?? "");
    setBio(profile.bio ?? "");
    setAvatarUrl(profile.imageUrl);
    setFieldError(null);
  }, [enabled, profile]);

  const handleAvatarUpdated = (imageUrl: string | null) => {
    setAvatarUrl(imageUrl);
    queryClient.setQueryData(
      PROFILE_QUERY_KEY,
      (current: StudentProfileQueryData | undefined) => {
        if (!current) return current;
        return {
          ...current,
          profile: { ...current.profile, imageUrl },
        };
      },
    );
    void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    void user?.reload();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldError(null);

    const parsed = updateStudentProfileSchema.safeParse({
      firstName,
      lastName,
      bio,
    });

    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Datos inválidos.");
      return;
    }

    startTransition(async () => {
      const result = await updateStudentProfile(parsed.data);

      if (!result.ok) {
        setFieldError(result.error);
        toast.error(result.error);
        return;
      }

      queryClient.setQueryData(
        PROFILE_QUERY_KEY,
        (current: StudentProfileQueryData | undefined) => {
          if (!current) return current;
          return {
            ...current,
            profile: result.profile,
          };
        },
      );

      await user?.reload();
      toast.success("Perfil actualizado");
      onSaved?.();
    });
  };

  if (profileQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <IconLoader className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (profileQuery.isError || !profile) {
    return (
      <p className="text-sm font-medium text-destructive">
        {profileQuery.error instanceof Error
          ? profileQuery.error.message
          : "No se pudo cargar tu perfil."}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-5",
        variant === "page" &&
          "max-w-lg rounded-lg border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--foreground)]",
      )}
    >
      <UserAvatarUploader
        imageUrl={avatarUrl}
        storageConfigured={storageConfigured}
        maxSizeMb={maxAvatarSizeMb}
        onUpdated={handleAvatarUpdated}
      />

      {profile.email ? (
        <div className="space-y-1.5">
          <Label htmlFor="profile-email">Correo</Label>
          <Input
            id="profile-email"
            value={profile.email}
            disabled
            className={cn(adminInputClass, "opacity-70")}
          />
          <p className="font-mono text-[9px] text-muted-foreground">
            Para cambiar el correo, usa la configuración de tu cuenta.
          </p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="profile-first-name">Nombre</Label>
          <Input
            id="profile-first-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            disabled={isPending}
            className={adminInputClass}
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profile-last-name">Apellido</Label>
          <Input
            id="profile-last-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            disabled={isPending}
            className={adminInputClass}
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="profile-bio">Biografía (opcional)</Label>
        <Textarea
          id="profile-bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          disabled={isPending}
          rows={3}
          maxLength={300}
          placeholder="Cuéntanos sobre tu experiencia freelance..."
          className={cn(adminInputClass, "min-h-[88px] resize-y")}
        />
        <p className="text-right font-mono text-[9px] text-muted-foreground">
          {bio.length}/300
        </p>
      </div>

      {fieldError ? (
        <p className="text-xs font-medium text-destructive">{fieldError}</p>
      ) : null}

      <div
        className={cn(
          "flex flex-col-reverse gap-2 sm:flex-row",
          variant === "dialog" ? "sm:justify-end" : "sm:justify-start",
        )}
      >
        {variant === "dialog" && onCancel ? (
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className={adminBrutalButtonClass}
            onClick={onCancel}
          >
            Cancelar
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={isPending}
          className={adminBrutalButtonClass}
        >
          {isPending ? (
            <IconLoader className="mr-2 size-4 animate-spin" />
          ) : null}
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
