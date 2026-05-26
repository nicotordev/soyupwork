"use client";

import {
  createAppLogger,
  toClientLogEvent,
} from "@/lib/logger/create-app-logger";
import { getClientLogLevel, shouldLog } from "@/lib/logger/levels";
import type { AppLogger, LogBindings, LogLevel } from "@/lib/logger/types";

const CONSOLE_METHOD: Record<LogLevel, "debug" | "info" | "warn" | "error"> = {
  trace: "debug",
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
  fatal: "error",
};

const REMOTE_LEVELS = new Set<LogLevel>(["warn", "error", "fatal"]);

function isRemoteLoggingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_LOG_REMOTE !== "false";
}

function writeToConsole(
  level: LogLevel,
  bindings: LogBindings,
  msg: string,
): void {
  const method = CONSOLE_METHOD[level];
  const prefix = `[${level.toUpperCase()}]`;
  const payload = Object.keys(bindings).length > 0 ? bindings : undefined;

  if (payload && msg) {
    console[method](prefix, msg, payload);
  } else if (msg) {
    console[method](prefix, msg);
  } else if (payload) {
    console[method](prefix, payload);
  }
}

function sendToServer(event: ReturnType<typeof toClientLogEvent>): void {
  if (!isRemoteLoggingEnabled() || typeof window === "undefined") return;

  const body = JSON.stringify(event);
  const url = "/api/log";

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
    return;
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    credentials: "same-origin",
    keepalive: true,
  }).catch(() => {
    // Avoid recursive logging if the ingest endpoint fails.
  });
}

/**
 * Browser logger with console output and optional forwarding to `/api/log`.
 * @example
 * const log = getClientLogger("CourseCreationDialog");
 * log.warn({ slug }, "Slug already exists");
 */
export function getClientLogger(
  module: string,
  bindings: LogBindings = {},
): AppLogger {
  const configuredLevel = getClientLogLevel();

  return createAppLogger((level, childBindings, msg) => {
    if (!shouldLog(configuredLevel, level)) return;

    const merged = {
      module,
      runtime: "browser",
      ...bindings,
      ...childBindings,
    };
    writeToConsole(level, merged, msg);

    if (REMOTE_LEVELS.has(level)) {
      sendToServer(toClientLogEvent(level, merged, msg));
    }
  }, {});
}
