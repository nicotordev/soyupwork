import apiResponse from "@/lib/api/api-response";
import {
  assertLogIngestAllowed,
  parseLogIngestPayload,
  readLogIngestBody,
} from "@/lib/logger/ingest-guard";
import { getServerLogger } from "@/lib/logger/server";
import type { LogLevel } from "@/lib/logger/types";

const ingestLogger = getServerLogger("api.log");

const REJECT_RESPONSES = {
  method: () => apiResponse.methodNotAllowed({ ok: false }),
  "content-type": () =>
    apiResponse.error(415, "Unsupported media type", { ok: false }),
  "body-size": () => apiResponse.error(413, "Payload too large", { ok: false }),
  origin: () => apiResponse.forbidden({ ok: false }),
  "rate-limit": () => apiResponse.tooManyRequests({ ok: false }),
  unauthorized: () => apiResponse.unauthorized({ ok: false }),
} as const;

function writeEvent(
  event: {
    level: LogLevel;
    msg: string;
    bindings: Record<string, unknown>;
    time?: number;
  },
  auth: { userId: string; ip: string },
): void {
  const payload = {
    ...event.bindings,
    clientTime: event.time ?? Date.now(),
    source: "browser",
    userId: auth.userId,
    clientIp: auth.ip,
  };

  switch (event.level) {
    case "trace":
      ingestLogger.debug(payload, event.msg);
      break;
    case "debug":
      ingestLogger.debug(payload, event.msg);
      break;
    case "info":
      ingestLogger.info(payload, event.msg);
      break;
    case "warn":
      ingestLogger.warn(payload, event.msg);
      break;
    case "error":
      ingestLogger.error(payload, event.msg);
      break;
    case "fatal":
      ingestLogger.fatal(payload, event.msg);
      break;
    default:
      ingestLogger.info(payload, event.msg);
  }
}

export async function POST(request: Request) {
  const guard = await assertLogIngestAllowed(request);
  if (!guard.ok) {
    ingestLogger.warn({ reason: guard.reason }, "Rejected client log ingest");
    return REJECT_RESPONSES[guard.reason]();
  }

  try {
    const raw = await readLogIngestBody(request);
    if (raw === null) {
      ingestLogger.warn({ ip: guard.auth.ip }, "Client log body too large");
      return apiResponse.error(413, "Payload too large", { ok: false });
    }

    const parsed = parseLogIngestPayload(raw);
    if (!parsed.ok) {
      ingestLogger.warn(
        { userId: guard.auth.userId, ip: guard.auth.ip },
        "Invalid client log payload",
      );
      return apiResponse.badRequest(
        { ok: false },
        "Invalid client log payload",
      );
    }

    for (const event of parsed.events) {
      writeEvent(event, guard.auth);
    }

    return apiResponse.success({ ok: true });
  } catch (error) {
    ingestLogger.error(
      { error, userId: guard.auth.userId },
      "Failed to ingest client log",
    );
    return apiResponse.internalServerError(
      { ok: false },
      "Failed to ingest client log",
    );
  }
}
