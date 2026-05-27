"use client";

import { useTransition } from "react";
import { joinWaitlist } from "@/app/actions/settings.actions";
import { PhoneInputField } from "@/components/platform/phone-input-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDefaultPhoneCountry } from "@/lib/phone/countries";
import { formatNationalPhoneToE164 } from "@/lib/phone/validate";
import { phoneCountrySchema } from "@/lib/phone/schema";
import { IconLoader, IconMail } from "@tabler/icons-react";
import { toast } from "@/lib/toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CountryCode } from "libphonenumber-js";

const waitlistSchema = z
  .object({
    email: z.string().email("Escribe un correo válido."),
    name: z.string().optional(),
    phoneCountry: phoneCountrySchema,
    phoneNational: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const trimmed = data.phoneNational?.trim() ?? "";
    if (!trimmed) return;

    const e164 = formatNationalPhoneToE164(data.phoneCountry, trimmed);
    if (!e164) {
      ctx.addIssue({
        code: "custom",
        path: ["phoneNational"],
        message:
          "Ingresa un número de teléfono válido para el país seleccionado.",
      });
    }
  });

type WaitlistFormData = z.infer<typeof waitlistSchema>;

const inputClassName =
  "border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]";

export function WaitlistSignupForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      phoneCountry: getDefaultPhoneCountry(),
      phoneNational: "",
    },
  });

  const onSubmit = (data: WaitlistFormData) => {
    startTransition(async () => {
      const phone = data.phoneNational?.trim()
        ? formatNationalPhoneToE164(
            data.phoneCountry as CountryCode,
            data.phoneNational,
          )
        : undefined;

      const result = await joinWaitlist({
        email: data.email,
        name: data.name?.trim() ? data.name : undefined,
        phone,
      });

      if (result.ok) {
        toast.success("¡Te avisaremos cuando abramos!");
        reset({
          email: "",
          name: "",
          phoneCountry: getDefaultPhoneCountry(),
          phoneNational: "",
        });
        return;
      }

      toast.error(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-left">
      <div className="space-y-2">
        <Label htmlFor="waitlist-email">Correo</Label>
        <Input
          id="waitlist-email"
          type="email"
          placeholder="tu@correo.com"
          {...register("email")}
          className={inputClassName}
          disabled={isPending}
          aria-invalid={!!errors.email}
        />
        {errors.email ? (
          <p className="text-xs font-medium text-red-500">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="waitlist-name">Nombre (opcional)</Label>
        <Input
          id="waitlist-name"
          placeholder="Tu nombre"
          {...register("name")}
          className={inputClassName}
          disabled={isPending}
          aria-invalid={!!errors.name}
        />
        {errors.name ? (
          <p className="text-xs font-medium text-red-500">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <PhoneInputField
        id="waitlist-phone"
        label="Teléfono"
        optional
        disabled={isPending}
        control={control}
        register={register}
        errors={errors}
      />

      <Button
        type="submit"
        disabled={isPending}
        className="w-full border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]"
      >
        {isPending ? (
          <IconLoader className="animate-spin mr-2" stroke={2.25} />
        ) : (
          <IconMail stroke={2.25} className="mr-2" />
        )}
        Unirme a la lista
      </Button>
    </form>
  );
}
