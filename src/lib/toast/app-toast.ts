import { toast } from "@/lib/toast";

const COPY_SUCCESS_DURATION_MS = 2600;

export function toastCopySuccess(
  copiedValue: string,
  title = "Copiado al portapapeles",
) {
  toast.success(title, {
    description: copiedValue,
    duration: COPY_SUCCESS_DURATION_MS,
  });
}

export function toastCopyError(message = "No se pudo copiar al portapapeles.") {
  toast.error(message, {
    description: "Probá de nuevo o copiá manualmente.",
  });
}

export function toastCopyUnavailable(message = "No hay nada para copiar.") {
  toast.warning(message);
}
