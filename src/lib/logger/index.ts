/**
 * Isomorphic logging for SoyUpwork.
 *
 * - **Server** (RSC, Route Handlers, Server Actions): `getServerLogger` from `@/lib/logger/server`
 * - **Client** (Client Components): `getClientLogger` from `@/lib/logger/client`
 *
 * Both expose the same `AppLogger` API (`info`, `warn`, `error`, `child`, …).
 * Server logs use [Pino](https://getpino.io); the browser logs to the console and
 * forwards `warn` / `error` / `fatal` to `POST /api/log` via `sendBeacon`.
 *
 * Env: `LOG_LEVEL` (server), `NEXT_PUBLIC_LOG_LEVEL` (browser, optional),
 * `NEXT_PUBLIC_LOG_REMOTE=false` to disable browser → server forwarding.
 */

export type {
  AppLogger,
  ClientLogEvent,
  LogBindings,
  LogLevel,
  LogMethod,
  LogPayload,
} from "@/lib/logger/types";

export {
  getClientLogLevel,
  getConfiguredLogLevel,
  parseLogLevel,
} from "@/lib/logger/levels";
export { serializeError } from "@/lib/logger/serialize-error";
export { LOG_LEVELS } from "@/lib/logger/types";
