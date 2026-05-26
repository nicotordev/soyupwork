import { LOG_LEVELS, type LogLevel } from "@/lib/logger/types";

const LEVEL_RANK: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

export function parseLogLevel(
  raw: string | undefined,
  fallback: LogLevel = "info",
): LogLevel {
  if (!raw) return fallback;
  const normalized = raw.toLowerCase() as LogLevel;
  return LOG_LEVELS.includes(normalized) ? normalized : fallback;
}

export function shouldLog(configured: LogLevel, message: LogLevel): boolean {
  return LEVEL_RANK[message] >= LEVEL_RANK[configured];
}

export function getConfiguredLogLevel(): LogLevel {
  return parseLogLevel(
    typeof process !== "undefined" ? process.env.LOG_LEVEL : undefined,
    process.env.NODE_ENV === "production" ? "info" : "debug",
  );
}

export function getClientLogLevel(): LogLevel {
  if (typeof process === "undefined") return "info";
  return parseLogLevel(
    process.env.NEXT_PUBLIC_LOG_LEVEL ?? process.env.LOG_LEVEL,
    process.env.NODE_ENV === "production" ? "warn" : "debug",
  );
}
