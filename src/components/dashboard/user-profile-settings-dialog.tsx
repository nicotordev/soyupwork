"use client";

import {
  getStudentProfile,
  updateStudentProfile,
} from "@/app/actions/profile.actions";
import { UserAvatarUploader } from "@/components/dashboard/user-avatar-uploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const PROFILE_QUERY_KEY = ["student-profile"] as const;

type UserProfileSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserProfileSettingsDialog({
  open,
  onOpenChange,
}: UserProfileSettingsDialogProps) {
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
    enabled: open,
  });

  const profile = profileQuery.data?.profile;
  const storageConfigured = profileQuery.data?.storageConfigured ?? false;
  const maxAvatarSizeMb = profileQuery.data?.maxAvatarSizeMb ?? 5;

  useEffect(() => {
    if (!open || !profile) return;
    setFirstName(profile.firstName ?? "");
    setLastName(profile.lastName ?? "");
    setBio(profile.bio ?? "");
    setAvatarUrl(profile.imageUrl);
    setFieldError(null);
  }, [open, profile]);

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

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen && !isPending) {
      onOpenChange(false);
    }
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
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-2 border-foreground bg-card shadow-[6px_6px_0px_0px_var(--foreground)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-base font-extrabold">
            Configuración de perfil
          </DialogTitle>
          <DialogDescription>
            Actualiza tu nombre, biografía y foto. El correo se gestiona desde
            tu cuenta de acceso.
          </DialogDescription>
        </DialogHeader>

        {profileQuery.isLoading ? (
          <div className="flex items-center justify-center py-10">
            <IconLoader className="size-8 animate-spin text-primary" />
          </div>
        ) : profileQuery.isError ? (
          <p className="text-sm font-medium text-destructive">
            {profileQuery.error instanceof Error
              ? profileQuery.error.message
              : "No se pudo cargar tu perfil."}
          </p>
        ) : profile ? (
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <p className="text-xs font-medium text-destructive">
                {fieldError}
              </p>
            ) : null}

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className={adminBrutalButtonClass}
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
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
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export { PROFILE_QUERY_KEY };
