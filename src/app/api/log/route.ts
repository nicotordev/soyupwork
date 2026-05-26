import {
  assertLogIngestAllowed,
  parseLogIngestPayload,
  readLogIngestBody,
} from "@/lib/logger/ingest-guard";
import { getServerLogger } from "@/lib/logger/server";
import type { LogLevel } from "@/lib/logger/types";
import { NextResponse } from "next/server";

const ingestLogger = getServerLogger("api.log");

const REJECT_STATUS: Record<string, { status: number; message: string }> = {
  method: { status: 405, message: "Method not allowed" },
  "content-type": { status: 415, message: "Unsupported media type" },
  "body-size": { status: 413, message: "Payload too large" },
  origin: { status: 403, message: "Forbidden" },
  "rate-limit": { status: 429, message: "Too many requests" },
  unauthorized: { status: 401, message: "Unauthorized" },
};

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
    const { status, message } = REJECT_STATUS[guard.reason];
    ingestLogger.warn({ reason: guard.reason }, "Rejected client log ingest");
    return NextResponse.json({ ok: false, error: message }, { status });
  }

  try {
    const raw = await readLogIngestBody(request);
    if (raw === null) {
      ingestLogger.warn({ ip: guard.auth.ip }, "Client log body too large");
      return NextResponse.json({ ok: false }, { status: 413 });
    }

    const parsed = parseLogIngestPayload(raw);
    if (!parsed.ok) {
      ingestLogger.warn(
        { userId: guard.auth.userId, ip: guard.auth.ip },
        "Invalid client log payload",
      );
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    for (const event of parsed.events) {
      writeEvent(event, guard.auth);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    ingestLogger.error(
      { error, userId: guard.auth.userId },
      "Failed to ingest client log",
    );
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
