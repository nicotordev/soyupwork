import "server-only";

import { createAppLogger } from "@/lib/logger/create-app-logger";
import { getConfiguredLogLevel } from "@/lib/logger/levels";
import type { AppLogger, LogBindings, LogLevel } from "@/lib/logger/types";
import pino, { type Logger as PinoLogger } from "pino";

let rootLogger: PinoLogger | undefined;

function createRootLogger(): PinoLogger {
  const level = getConfiguredLogLevel();
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    return pino({
      level,
      base: { runtime: "server" },
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    });
  }

  return pino({
    level,
    base: {
      runtime: "server",
      env: process.env.NODE_ENV,
    },
  });
}

function getRootLogger(): PinoLogger {
  rootLogger ??= createRootLogger();
  return rootLogger;
}

function writeWithPino(
  pinoLogger: PinoLogger,
  level: LogLevel,
  bindings: LogBindings,
  msg: string,
): void {
  const hasBindings = Object.keys(bindings).length > 0;

  switch (level) {
    case "trace":
      hasBindings ? pinoLogger.trace(bindings, msg) : pinoLogger.trace(msg);
      break;
    case "debug":
      hasBindings ? pinoLogger.debug(bindings, msg) : pinoLogger.debug(msg);
      break;
    case "info":
      hasBindings ? pinoLogger.info(bindings, msg) : pinoLogger.info(msg);
      break;
    case "warn":
      hasBindings ? pinoLogger.warn(bindings, msg) : pinoLogger.warn(msg);
      break;
    case "error":
      hasBindings ? pinoLogger.error(bindings, msg) : pinoLogger.error(msg);
      break;
    case "fatal":
      hasBindings ? pinoLogger.fatal(bindings, msg) : pinoLogger.fatal(msg);
      break;
    default:
      hasBindings ? pinoLogger.info(bindings, msg) : pinoLogger.info(msg);
  }
}

/**
 * Server-only logger backed by Pino.
 * @example
 * const log = getServerLogger("courses.actions");
 * log.info({ courseId }, "Course created");
 */
export function getServerLogger(
  module: string,
  bindings: LogBindings = {},
): AppLogger {
  const pinoLogger = getRootLogger().child({ module, ...bindings });
  return createAppLogger(
    (level, childBindings, msg) =>
      writeWithPino(pinoLogger, level, childBindings, msg),
    {},
  );
}

/** Root Pino instance for advanced use (middleware, custom streams). */
export function getPinoRootLogger(): PinoLogger {
  return getRootLogger();
}
