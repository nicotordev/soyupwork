"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconCheck, IconSend } from "@tabler/icons-react";
import { submitContactMessage } from "@/app/actions/contact.actions";
import {
  CONTACT_TOPICS,
  type ContactTopicValue,
} from "@/constants/contact.constants";
import {
  isTurnstileEnabled,
  TurnstileField,
} from "@/components/platform/turnstile-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const contactTopicValues = CONTACT_TOPICS.map((t) => t.value) as [
  ContactTopicValue,
  ...ContactTopicValue[],
];

const contactFormSchema = z.object({
  name: z.string().min(2, "Indica tu nombre.").max(100),
  email: z.string().email("Correo inválido."),
  topic: z.enum(contactTopicValues, { message: "Selecciona un tema." }),
  message: z.string().min(20, "Mínimo 20 caracteres.").max(5000),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const selectClass = cn(
  "h-9 w-full rounded-md border-2 border-foreground bg-card px-3 text-xs font-semibold shadow-[2px_2px_0px_0px_var(--foreground)]",
  "outline-none transition-all focus-visible:translate-x-[-1px] focus-visible:translate-y-[-1px] focus-visible:shadow-[3px_3px_0px_0px_var(--foreground)]",
);

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const turnstileRequired = isTurnstileEnabled();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { topic: "access" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitError(null);
    if (turnstileRequired && !turnstileToken) {
      setSubmitError("Completa la verificación de seguridad.");
      return;
    }

    const result = await submitContactMessage({
      ...data,
      turnstileToken: turnstileToken ?? undefined,
    });

    setTurnstileToken(null);
    setTurnstileKey((k) => k + 1);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    setIsSubmitted(true);
    reset();
  };

  if (isSubmitted) {
    return (
      <div
        className="flex items-start gap-3 rounded-2xl border-2 border-foreground bg-primary/10 p-5 shadow-[3px_3px_0px_0px_var(--foreground)]"
        role="status"
      >
        <IconCheck className="mt-0.5 size-5 shrink-0 text-primary stroke-[3]" />
        <div className="space-y-1">
          <p className="font-mono text-xs font-extrabold uppercase tracking-wider text-foreground">
            Mensaje enviado
          </p>
          <p className="text-sm font-medium text-foreground/90">
            Recibimos tu solicitud. Te responderemos al correo indicado en un
            plazo habitual de 2–5 días hábiles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border-2 border-foreground bg-card p-4 shadow-[4px_4px_0px_0px_var(--foreground)] sm:p-6"
      noValidate
    >
      <div className="space-y-1">
        <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          Formulario
        </p>
        <h2 className="font-heading text-lg font-black tracking-tight text-foreground sm:text-xl">
          Envíanos tu mensaje
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="contact-name"
            className="font-mono text-[10px] uppercase"
          >
            Nombre
          </Label>
          <Input
            id="contact-name"
            autoComplete="name"
            disabled={isSubmitting}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-xs font-mono font-bold text-destructive">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="contact-email"
            className="font-mono text-[10px] uppercase"
          >
            Correo
          </Label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs font-mono font-bold text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="contact-topic"
          className="font-mono text-[10px] uppercase"
        >
          Tema
        </Label>
        <select
          id="contact-topic"
          className={selectClass}
          disabled={isSubmitting}
          aria-invalid={!!errors.topic}
          {...register("topic")}
        >
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
        {errors.topic ? (
          <p className="text-xs font-mono font-bold text-destructive">
            {errors.topic.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="contact-message"
          className="font-mono text-[10px] uppercase"
        >
          Mensaje
        </Label>
        <Textarea
          id="contact-message"
          rows={5}
          placeholder="Describe tu situación con el mayor detalle posible (curso, fecha de compra, error que ves…)"
          disabled={isSubmitting}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message ? (
          <p className="text-xs font-mono font-bold text-destructive">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <TurnstileField
        action="contact-form"
        resetKey={turnstileKey}
        onToken={setTurnstileToken}
        onExpire={() => setTurnstileToken(null)}
        onError={(message) => {
          setTurnstileToken(null);
          setSubmitError(
            message ?? "La verificación de seguridad falló. Intenta de nuevo.",
          );
        }}
      />

      {submitError ? (
        <p className="text-xs font-mono font-bold text-destructive">
          {submitError}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting || (turnstileRequired && !turnstileToken)}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Enviando…" : "Enviar mensaje"}
        <IconSend className="size-4" />
      </Button>
    </form>
  );
}
