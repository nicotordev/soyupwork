"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { PhoneInputField as PhoneInputFieldComponent } from "@/components/platform/phone-input-field";
import {
  confirmWaitlistVerification,
  requestWaitlistVerification,
} from "@/app/actions/settings.actions";
import {
  isTurnstileEnabled,
  TurnstileField,
} from "@/components/platform/turnstile-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDefaultPhoneCountry } from "@/lib/phone/countries";
import { formatNationalPhoneToE164 } from "@/lib/phone/validate";
import { phoneCountrySchema } from "@/lib/phone/schema";
import { WAITLIST_VERIFICATION } from "@/lib/waitlist/verification.constants";
import { IconLoader, IconMail } from "@tabler/icons-react";
import { toast } from "@/lib/toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CountryCode } from "libphonenumber-js";

const turnstileRequired = isTurnstileEnabled();

const PhoneInputField = dynamic(
  () =>
    import("@/components/platform/phone-input-field").then(
      (module) => module.PhoneInputField,
    ),
  { ssr: false },
) as typeof PhoneInputFieldComponent;

const waitlistSchema = z
  .object({
    email: z.string().email("Escribe un correo válido."),
    name: z.string().optional(),
    phoneCountry: phoneCountrySchema,
    phoneNational: z.string().optional(),
    code: z.string().optional(),
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
  const [step, setStep] = useState<"details" | "verify">("details");
  const [isPending, startTransition] = useTransition();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const resetTurnstile = () => {
    setTurnstileToken(null);
    setTurnstileKey((key) => key + 1);
  };

  const {
    register,
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      phoneCountry: getDefaultPhoneCountry(),
      phoneNational: "",
      code: "",
    },
  });

  const needsTurnstile = turnstileRequired && !turnstileToken;

  const requestVerification = (
    data: WaitlistFormData,
    onSuccess: () => void,
  ) => {
    if (turnstileRequired && !turnstileToken) {
      toast.error("Completa la verificación de seguridad.");
      return;
    }

    const phone = data.phoneNational?.trim()
      ? formatNationalPhoneToE164(
          data.phoneCountry as CountryCode,
          data.phoneNational,
        )
      : undefined;

    startTransition(async () => {
      const result = await requestWaitlistVerification({
        email: data.email,
        name: data.name?.trim() ? data.name : undefined,
        phone,
        turnstileToken: turnstileToken ?? undefined,
      });

      if (result.ok) {
        resetTurnstile();
        onSuccess();
        return;
      }

      resetTurnstile();
      toast.error(result.error);
    });
  };

  const onSubmit = (data: WaitlistFormData) => {
    if (step === "details") {
      requestVerification(data, () => {
        toast.success("Te enviamos un código de verificación a tu correo.");
        setStep("verify");
      });
      return;
    }

    const code = data.code?.replace(/\D/g, "") ?? "";
    if (code.length !== WAITLIST_VERIFICATION.codeLength) {
      toast.error(
        `El código debe tener ${WAITLIST_VERIFICATION.codeLength} dígitos.`,
      );
      return;
    }

    startTransition(async () => {
      const result = await confirmWaitlistVerification({
        email: data.email,
        code,
      });

      if (result.ok) {
        toast.success("¡Correo verificado! Te avisaremos cuando abramos.");
        reset({
          email: "",
          name: "",
          phoneCountry: getDefaultPhoneCountry(),
          phoneNational: "",
          code: "",
        });
        resetTurnstile();
        setStep("details");
        return;
      }

      toast.error(result.error);
    });
  };

  const resendCode = () => {
    requestVerification(getValues(), () => {
      toast.success("Enviamos un código nuevo.");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-left">
      {step === "details" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="waitlist-email">Correo</Label>
            <Input
              id="waitlist-email"
              type="email"
              placeholder="tu@correo.com"
              autoComplete="email"
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
              autoComplete="name"
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

          <TurnstileField
            resetKey={turnstileKey}
            onToken={setTurnstileToken}
            onExpire={() => setTurnstileToken(null)}
            onError={(message) => {
              setTurnstileToken(null);
              toast.error(
                message ??
                  "La verificación de seguridad falló. Intenta de nuevo.",
              );
            }}
          />

          <Button
            type="submit"
            disabled={isPending || needsTurnstile}
            className="w-full"
          >
            {isPending ? (
              <IconLoader className="mr-2 animate-spin" stroke={2.25} />
            ) : (
              <IconMail className="mr-2" stroke={2.25} />
            )}
            Enviar código de verificación
          </Button>
        </>
      ) : (
        <>
          <p className="text-xs font-medium text-muted-foreground">
            Enviamos un código de {WAITLIST_VERIFICATION.codeLength} dígitos a{" "}
            <span className="font-semibold text-foreground">
              {getValues("email")}
            </span>
            . Revisa spam si no lo ves en unos minutos.
          </p>

          <div className="space-y-2">
            <Label htmlFor="waitlist-code">Código de verificación</Label>
            <Input
              id="waitlist-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={WAITLIST_VERIFICATION.codeLength}
              {...register("code")}
              className={`${inputClassName} text-center font-mono text-lg tracking-[0.35em]`}
              disabled={isPending}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <IconLoader className="mr-2 animate-spin" stroke={2.25} />
            ) : null}
            Confirmar y unirme
          </Button>

          {turnstileRequired ? (
            <div className="space-y-2 border-t border-dashed border-foreground/20 pt-3">
              <p className="text-[10px] font-mono uppercase text-muted-foreground">
                Para reenviar el código
              </p>
              <TurnstileField
                resetKey={turnstileKey}
                onToken={setTurnstileToken}
                onExpire={() => setTurnstileToken(null)}
                onError={(message) => {
                  setTurnstileToken(null);
                  toast.error(
                    message ??
                      "La verificación de seguridad falló. Intenta de nuevo.",
                  );
                }}
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              disabled={isPending || needsTurnstile}
              className="w-full"
              onClick={resendCode}
            >
              Reenviar código
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              className="w-full"
              onClick={() => {
                resetTurnstile();
                setStep("details");
              }}
            >
              Cambiar correo
            </Button>
          </div>
        </>
      )}

      <Button variant="outline" disabled={isPending} className="w-full" asChild>
        <Link href="/">Volver</Link>
      </Button>
    </form>
  );
}
