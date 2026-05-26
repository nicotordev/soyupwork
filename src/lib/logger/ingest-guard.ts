import "server-only";

import { LOG_LEVELS } from "@/lib/logger/types";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const MAX_BODY_BYTES = Number(process.env.LOG_INGEST_MAX_BODY_BYTES ?? 16_384);
const RATE_LIMIT_PER_MINUTE = Number(
  process.env.LOG_INGEST_RATE_LIMIT_PER_MINUTE ?? 60,
);
const REQUIRE_AUTH = process.env.LOG_INGEST_REQUIRE_AUTH !== "false";

const bindingValueSchema = z.union([
  z.string().max(500),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

export const clientLogEventSchema = z.object({
  level: z.enum(LOG_LEVELS),
  msg: z.string().min(1).max(2_000),
  bindings: z
    .record(z.string().max(64), bindingValueSchema)
    .default({})
    .refine((record) => Object.keys(record).length <= 20, {
      message: "Too many binding keys",
    }),
  time: z
    .number()
    .int()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        (value > Date.now() - 3_600_000 && value < Date.now() + 60_000),
      { message: "Invalid client timestamp" },
    ),
});

export const clientLogBatchSchema = z.union([
  clientLogEventSchema,
  z.object({
    events: z.array(clientLogEventSchema).min(1).max(25),
  }),
]);

type RateBucket = { count: number; resetAt: number };

const rateBuckets = new Map<string, RateBucket>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  bucket.count += 1;
  if (bucket.count > RATE_LIMIT_PER_MINUTE) return true;
  return false;
}

function isAllowedOrigin(request: Request): boolean {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return process.env.NODE_ENV !== "production";
  }

  let allowedOrigin: string;
  try {
    allowedOrigin = new URL(appUrl).origin;
  } catch {
    return false;
  }

  const origin = request.headers.get("origin");
  if (origin === allowedOrigin) return true;

  const referer = request.headers.get("referer");
  if (referer?.startsWith(allowedOrigin)) return true;

  // sendBeacon from same tab may omit Origin; allow matching Host.
  if (!origin) {
    const host = request.headers.get("host");
    if (host) {
      try {
        const allowedHost = new URL(allowedOrigin).host;
        return host === allowedHost;
      } catch {
        return false;
      }
    }
  }

  return false;
}

export type LogIngestAuth = {
  userId: string;
  ip: string;
};

export type LogIngestRejectReason =
  | "method"
  | "content-type"
  | "body-size"
  | "origin"
  | "rate-limit"
  | "unauthorized";

export async function assertLogIngestAllowed(
  request: Request,
): Promise<
  | { ok: true; auth: LogIngestAuth }
  | { ok: false; reason: LogIngestRejectReason }
> {
  if (request.method !== "POST") {
    return { ok: false, reason: "method" };
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return { ok: false, reason: "content-type" };
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return { ok: false, reason: "body-size" };
  }

  if (!isAllowedOrigin(request)) {
    return { ok: false, reason: "origin" };
  }

  const ip = getClientIp(request);
  const rateKey = `${ip}`;
  if (isRateLimited(rateKey)) {
    return { ok: false, reason: "rate-limit" };
  }

  if (REQUIRE_AUTH) {
    const { userId } = await auth();
    if (!userId) {
      return { ok: false, reason: "unauthorized" };
    }
    return { ok: true, auth: { userId, ip } };
  }

  return { ok: true, auth: { userId: "anonymous", ip } };
}

export async function readLogIngestBody(
  request: Request,
): Promise<string | null> {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return null;
  return raw;
}

export function parseLogIngestPayload(
  raw: string,
):
  | { ok: true; events: z.infer<typeof clientLogEventSchema>[] }
  | { ok: false } {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { ok: false };
  }

  const parsed = clientLogBatchSchema.safeParse(json);
  if (!parsed.success) return { ok: false };

  const events = "events" in parsed.data ? parsed.data.events : [parsed.data];

  return { ok: true, events };
}
