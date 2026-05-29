"use client";

import { createCourseCheckout } from "@/app/actions/checkout.actions";
import { Button } from "@/components/ui/button";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { ArrowRight, Loader2 } from "lucide-react";
import { useTransition } from "react";

type RetryCheckoutButtonProps = {
  courseSlug: string;
  className?: string;
};

export function RetryCheckoutButton({
  courseSlug,
  className,
}: RetryCheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleRetry = () => {
    startTransition(async () => {
      const result = await createCourseCheckout(courseSlug);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      if ("checkoutUrl" in result) {
        window.location.href = result.checkoutUrl;
      }
    });
  };

  return (
    <Button
      type="button"
      size="lg"
      className={cn(adminBrutalButtonClass, "w-full gap-2", className)}
      disabled={isPending}
      onClick={handleRetry}
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Preparando checkout…
        </>
      ) : (
        <>
          Intentar de nuevo
          <ArrowRight className="size-4 stroke-[2.5]" />
        </>
      )}
    </Button>
  );
}
