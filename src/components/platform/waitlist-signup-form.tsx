"use client";

import { useState, useTransition } from "react";
import { joinWaitlist } from "@/app/actions/settings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLoader, IconMail } from "@tabler/icons-react";
import { toast } from "sonner";

export function WaitlistSignupForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await joinWaitlist({ email, name: name || undefined });

      if (result.ok) {
        toast.success("¡Te avisaremos cuando abramos!");
        setEmail("");
        setName("");
        return;
      }

      toast.error(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      <div className="space-y-2">
        <Label htmlFor="waitlist-email">Correo</Label>
        <Input
          id="waitlist-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className="border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="waitlist-name">Nombre (opcional)</Label>
        <Input
          id="waitlist-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          className="border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]"
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
        {isPending ? (
          <IconLoader className="animate-spin" stroke={2.25} />
        ) : (
          <IconMail stroke={2.25} />
        )}
        Unirme a la lista
      </Button>
    </form>
  );
}
