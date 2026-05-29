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
import {
  IconLoader,
  IconUser,
  IconMail,
  IconQuote,
  IconStar,
  IconSparkles,
} from "@tabler/icons-react";
import Image from "next/image";
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

  // Live preview dynamic state properties
  const previewName = `${firstName.trim()} ${lastName.trim()}`.trim() || "Tu Nombre";
  const previewBio = bio.trim() || "Aún no has escrito tu biografía. ¡Cuéntanos algo interesante sobre ti en tu perfil!";
  const previewAvatar = avatarUrl || user?.imageUrl || null;
  const previewEmail = profile.email || "correo@ejemplo.com";

  // Reusable Form Element
  const formElement = (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-4 sm:space-y-6",
        variant === "page" &&
          "rounded-lg border-2 border-foreground bg-card p-4 sm:p-7 shadow-[4px_4px_0px_0px_var(--foreground)]",
      )}
    >
      {/* Title inside card (only in page view) */}
      {variant === "page" && (
        <div className="border-b-2 border-foreground pb-4 mb-4 sm:mb-6">
          <h2 className="font-heading text-lg font-black tracking-tight flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-mono border border-foreground shadow-[1px_1px_0px_0px_var(--foreground)] select-none">
              ⚙
            </span>
            Editar información de perfil
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Esta información se mostrará públicamente en la comunidad de SoyUpwork.
          </p>
        </div>
      )}

      {/* Avatar Uploader Section */}
      <div className="space-y-2 border-b-2 border-dashed border-border pb-4 sm:pb-6">
        <Label className="font-mono text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-primary" />
          Foto de perfil
        </Label>
        <UserAvatarUploader
          imageUrl={avatarUrl}
          storageConfigured={storageConfigured}
          maxSizeMb={maxAvatarSizeMb}
          onUpdated={handleAvatarUpdated}
        />
      </div>

      {/* Email Input Field (Disabled) */}
      {profile.email ? (
        <div className="space-y-1.5">
          <Label htmlFor="profile-email" className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-muted-foreground/50" />
            Correo electrónico
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <IconMail className="size-4" />
            </span>
            <Input
              id="profile-email"
              value={profile.email}
              disabled
              className={cn(adminInputClass, "pl-9 opacity-70 cursor-not-allowed bg-muted/20")}
            />
          </div>
          <p className="font-mono text-[9px] text-muted-foreground">
            El correo no se puede cambiar directamente. Se gestiona desde tu cuenta.
          </p>
        </div>
      ) : null}

      {/* First Name & Last Name Input fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="profile-first-name" className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-primary" />
            Nombre
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <IconUser className="size-4" />
            </span>
            <Input
              id="profile-first-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              disabled={isPending}
              className={cn(adminInputClass, "pl-9")}
              autoComplete="given-name"
              placeholder="Ej. Juan"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profile-last-name" className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-primary" />
            Apellido
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <IconUser className="size-4" />
            </span>
            <Input
              id="profile-last-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              disabled={isPending}
              className={cn(adminInputClass, "pl-9")}
              autoComplete="family-name"
              placeholder="Ej. Pérez"
            />
          </div>
        </div>
      </div>

      {/* Biography Input field */}
      <div className="space-y-1.5">
        <Label htmlFor="profile-bio" className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-primary" />
          Biografía o descripción
        </Label>
        <div className="relative">
          <span className="absolute top-3 left-3 text-muted-foreground">
            <IconQuote className="size-4" />
          </span>
          <Textarea
            id="profile-bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            disabled={isPending}
            rows={4}
            maxLength={300}
            placeholder="Cuéntanos sobre tu experiencia freelance, habilidades o qué estás aprendiendo..."
            className={cn(adminInputClass, "pl-9 min-h-[100px] resize-y")}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[10px] text-muted-foreground font-mono">
            Usa este espacio para presentarte ante otros freelancers.
          </span>
          <span className={cn(
            "font-mono text-[10px] px-1.5 py-0.5 rounded border border-foreground/10 bg-muted/40",
            bio.length >= 280 ? "text-destructive font-bold bg-destructive/10" : "text-muted-foreground"
          )}>
            {bio.length}/300
          </span>
        </div>
      </div>

      {fieldError ? (
        <div className="rounded border-2 border-destructive bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive shadow-[2px_2px_0px_0px_var(--destructive)] animate-pulse">
          {fieldError}
        </div>
      ) : null}

      {/* Actions */}
      <div
        className={cn(
          "flex flex-col-reverse gap-2.5 sm:flex-row pt-2",
          variant === "dialog" ? "sm:justify-end" : "sm:justify-start",
        )}
      >
        {variant === "dialog" && onCancel ? (
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className="w-full sm:w-auto"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? (
            <IconLoader className="mr-2 size-4 animate-spin" />
          ) : null}
          Guardar cambios
        </Button>
      </div>
    </form>
  );

  // Live Card Preview Element (only for variant === "page")
  const previewCardElement = (
    <div className="space-y-4 sm:space-y-5 lg:sticky lg:top-8">
      <div>
        <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <IconSparkles className="size-4 text-primary animate-pulse" />
          Vista previa en tiempo real
        </h3>
        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
          Así es como lucirá tu credencial de estudiante en SoyUpwork
        </p>
      </div>

      {/* Neobrutalist Pass Card Container */}
      <div className="group relative select-none rounded-2xl border-4 border-foreground bg-card text-foreground shadow-[8px_8px_0px_0px_var(--foreground)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_var(--foreground)] overflow-hidden">
        
        {/* Floating gradient accent */}
        <div aria-hidden className="absolute -right-6 -bottom-6 size-24 rounded-full bg-primary/10 blur-xl pointer-events-none" />
        
        {/* Header Cover Banner */}
        <div className="relative h-28 w-full bg-gradient-to-r from-primary/70 via-secondary/80 to-primary/45 border-b-4 border-foreground overflow-hidden">
          {/* Brutalist diagonal lines / grid bg */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
              backgroundSize: '12px 12px'
            }}
          />
          {/* Card OS visual decoration */}
          <div className="absolute top-3.5 left-4 flex gap-1 items-center">
            <span className="size-2 rounded-full bg-destructive border border-foreground shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" />
            <span className="size-2 rounded-full bg-secondary border border-foreground shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" />
            <span className="size-2 rounded-full bg-primary border border-foreground shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" />
          </div>

          <div className="font-mono text-[8px] font-black uppercase tracking-widest bg-yellow-300 border-2 border-foreground px-2 py-0.5 rounded shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] absolute top-3.5 right-3 select-none">
            ★ ESTUDIANTE PASS ★
          </div>
        </div>

        {/* Avatar overlapping the banner */}
        <div className="relative px-6">
          <div className="relative -mt-12 size-24 shrink-0 overflow-hidden rounded-full border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--foreground)] z-10 transition-all duration-300 group-hover:scale-105 group-hover:rotate-2">
            {previewAvatar ? (
              <Image
                src={previewAvatar}
                alt="Live Preview"
                fill
                className="object-cover"
                sizes="96px"
                unoptimized
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
                <IconUser className="size-10 text-muted-foreground/60" stroke={1.5} />
              </div>
            )}
          </div>
        </div>

        {/* Card Main Info */}
        <div className="p-6 pt-4 space-y-4">
          {/* Identity details */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 border-2 border-foreground bg-primary px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase text-primary-foreground shadow-[1px_1px_0px_0px_var(--foreground)] select-none">
                FREELANCER
              </span>
              <span className="inline-flex items-center gap-1 border-2 border-foreground bg-secondary px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase text-secondary-foreground shadow-[1px_1px_0px_0px_var(--foreground)] select-none">
                ★ TALENTO ACTIVO
              </span>
            </div>
            
            <h2 className="font-heading text-2xl font-black tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-350">
              {previewName}
            </h2>
            
            <div className="font-mono text-[10px] text-muted-foreground flex items-center gap-1.5 border-b border-dashed border-border pb-3">
              <IconMail className="size-3.5 text-foreground/75" />
              {previewEmail}
            </div>
          </div>

          {/* Biography Quote Box */}
          <div className="space-y-1">
            <span className="font-mono text-[9px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <IconQuote className="size-3 text-primary" />
              Biografía del Freelancer
            </span>
            <div className="relative border-2 border-foreground bg-muted/15 p-3 sm:p-3.5 rounded-lg shadow-[3px_3px_0px_0px_var(--foreground)] group-hover:bg-muted/10 transition-colors duration-300">
              <p className="font-mono text-[10.5px] leading-relaxed text-foreground italic whitespace-pre-wrap break-words min-h-[60px] max-h-[120px] overflow-y-auto">
                "{previewBio}"
              </p>
            </div>
          </div>

          {/* Card Footer with Custom barcode & certified stamp */}
          <div className="flex items-end justify-between pt-2.5 border-t-2 border-foreground/10">
            {/* Simulated custom vector barcode */}
            <div className="space-y-1">
              <div aria-hidden className="flex items-center gap-[2px] h-6 opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="w-[1.5px] h-full bg-foreground" />
                <div className="w-[3px] h-full bg-foreground" />
                <div className="w-[0.5px] h-full bg-foreground" />
                <div className="w-[1.5px] h-full bg-foreground" />
                <div className="w-[4px] h-full bg-foreground" />
                <div className="w-[0.5px] h-full bg-foreground" />
                <div className="w-[2px] h-full bg-foreground" />
                <div className="w-[1.5px] h-full bg-foreground" />
                <div className="w-[3px] h-full bg-foreground" />
                <div className="w-[0.5px] h-full bg-foreground" />
                <div className="w-[2.5px] h-full bg-foreground" />
                <div className="w-[1px] h-full bg-foreground" />
                <div className="w-[4px] h-full bg-foreground" />
              </div>
              <div className="font-mono text-[7px] text-muted-foreground font-black uppercase tracking-widest select-none">
                SOYUP-{profile.id?.slice(0, 8).toUpperCase() || "MEMBER"}
              </div>
            </div>

            {/* Rotated Seal */}
            <div className="relative flex items-center justify-center size-14 rounded-full border-2 border-dashed border-primary/70 bg-primary/5 text-primary text-[8px] font-mono font-black uppercase tracking-widest rotate-[-6deg] group-hover:rotate-6 group-hover:scale-105 transition-all duration-500 shadow-[1px_1px_0px_0px_var(--primary)] select-none">
              <div className="text-center leading-none">
                <div>SOYUP</div>
                <div className="text-[10px] text-foreground font-bold leading-normal">100%</div>
                <div>VERIFIED</div>
              </div>
              <IconStar className="absolute size-3 -top-1.5 -right-1 text-yellow-400 fill-yellow-400 border border-foreground rounded-full p-px bg-card shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] animate-spin-slow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Responsive two-column page render OR basic dialog render
  if (variant === "page") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Side: Configuration Form */}
        <div className="lg:col-span-7">
          {formElement}
        </div>
        
        {/* Right Side: Interactive Live Card Preview */}
        <div className="lg:col-span-5">
          {previewCardElement}
        </div>
      </div>
    );
  }

  // Dialog view returns just the form for compact spaces
  return formElement;
}

