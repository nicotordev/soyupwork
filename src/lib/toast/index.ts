"use client";

import { playUiSound } from "@/lib/ui-sounds/player";
import type { UiSoundId } from "@/lib/ui-sounds/types";
import { toast as sonnerToast, type ExternalToast } from "sonner";

function withSound<T extends (...args: never[]) => unknown>(
  fn: T,
  sound: UiSoundId,
): T {
  return ((...args: Parameters<T>) => {
    playUiSound(sound);
    return fn(...args);
  }) as T;
}

export const toast = Object.assign(withSound(sonnerToast, "click"), {
  success: withSound(sonnerToast.success, "success"),
  error: withSound(sonnerToast.error, "error"),
  warning: withSound(sonnerToast.warning, "warning"),
  info: withSound(sonnerToast.info, "select"),
  loading: sonnerToast.loading,
  promise: sonnerToast.promise,
  custom: sonnerToast.custom,
  message: sonnerToast.message,
  dismiss: sonnerToast.dismiss,
}) as typeof sonnerToast;

export type { ExternalToast };
