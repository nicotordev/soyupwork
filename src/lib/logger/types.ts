export const LOG_LEVELS = [
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

export type LogBindings = Record<string, unknown>;

export type LogPayload = LogBindings & {
  msg?: string;
  err?: unknown;
};

export type LogMethod = {
  (msg: string): void;
  (bindings: LogBindings, msg?: string): void;
};

export type AppLogger = {
  trace: LogMethod;
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  fatal: LogMethod;
  child: (bindings: LogBindings) => AppLogger;
};

/** Serializable log event sent from the browser to `/api/log`. */
export type ClientLogEvent = {
  level: LogLevel;
  msg: string;
  bindings: LogBindings;
  time: number;
};
