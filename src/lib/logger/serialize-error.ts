import type { LogBindings } from "@/lib/logger/types";

export function serializeError(error: unknown): LogBindings {
  if (error instanceof Error) {
    return {
      err: {
        type: error.name,
        message: error.message,
        stack: error.stack,
      },
    };
  }

  return { err: error };
}
