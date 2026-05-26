import type {
  AppLogger,
  ClientLogEvent,
  LogBindings,
  LogLevel,
  LogMethod,
} from "@/lib/logger/types";

type WriteFn = (level: LogLevel, bindings: LogBindings, msg: string) => void;

function normalizeArgs(
  objOrMsg: LogBindings | string,
  msg?: string,
): { bindings: LogBindings; message: string } {
  if (typeof objOrMsg === "string") {
    return { bindings: {}, message: objOrMsg };
  }
  return { bindings: objOrMsg, message: msg ?? "" };
}

function createMethod(write: WriteFn, level: LogLevel): LogMethod {
  return (objOrMsg: LogBindings | string, msg?: string) => {
    const { bindings, message } = normalizeArgs(objOrMsg, msg);
    write(level, bindings, message);
  };
}

export function createAppLogger(
  write: WriteFn,
  baseBindings: LogBindings = {},
): AppLogger {
  const boundWrite: WriteFn = (level, bindings, msg) => {
    write(level, { ...baseBindings, ...bindings }, msg);
  };

  return {
    trace: createMethod(boundWrite, "trace"),
    debug: createMethod(boundWrite, "debug"),
    info: createMethod(boundWrite, "info"),
    warn: createMethod(boundWrite, "warn"),
    error: createMethod(boundWrite, "error"),
    fatal: createMethod(boundWrite, "fatal"),
    child: (bindings) =>
      createAppLogger(write, { ...baseBindings, ...bindings }),
  };
}

export function toClientLogEvent(
  level: LogLevel,
  bindings: LogBindings,
  msg: string,
): ClientLogEvent {
  return {
    level,
    msg,
    bindings,
    time: Date.now(),
  };
}
