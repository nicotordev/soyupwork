# syntax=docker/dockerfile:1
#
# Production image for soyup.work (Bun + Next.js + Prisma).
#
# Build (pass public env vars — they are inlined into the client bundle):
#
#   docker build \
#     --build-arg NEXT_PUBLIC_APP_URL=https://soyup.work \
#     --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... \
#     --build-arg NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in \
#     --build-arg NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up \
#     --build-arg NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard \
#     --build-arg NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding \
#     --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... \
#     --build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x... \
#     --build-arg NEXT_PUBLIC_LOG_LEVEL=info \
#     --build-arg NEXT_PUBLIC_LOG_REMOTE=true \
#     --build-arg R2_PUBLIC_URL=https://cdn.example.com \
#     -t soyupwork:latest .
#
# Run (runtime secrets — Postgres, Redis, Stripe, Clerk, etc.):
#
#   docker run -p 3000:3000 --env-file .env.production soyupwork:latest
#
# Redis is optional at runtime (REDIS_URL). Postgres is required (DATABASE_URL).

FROM oven/bun:1-debian AS base
WORKDIR /app

# -----------------------------------------------------------------------------
# Dependencies (includes devDependencies for build)
# -----------------------------------------------------------------------------
FROM base AS deps
ENV NODE_ENV=development
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# -----------------------------------------------------------------------------
# Build
# -----------------------------------------------------------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- Public env (embedded at build time) ---
ARG NEXT_PUBLIC_APP_URL=""
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
ARG NEXT_PUBLIC_LOG_LEVEL=""
ARG NEXT_PUBLIC_LOG_REMOTE="true"
# Used by next.config.ts for images.remotePatterns (not NEXT_PUBLIC_*)
ARG R2_PUBLIC_URL=""

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL \
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL \
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL \
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY \
    NEXT_PUBLIC_LOG_LEVEL=$NEXT_PUBLIC_LOG_LEVEL \
    NEXT_PUBLIC_LOG_REMOTE=$NEXT_PUBLIC_LOG_REMOTE \
    R2_PUBLIC_URL=$R2_PUBLIC_URL

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Prisma config reads DATABASE_URL at generate time only (not persisted in the image).
RUN DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public" \
  bunx prisma generate

# No server secrets here — they are injected at runtime via --env-file / orchestrator.
RUN bun run build

# -----------------------------------------------------------------------------
# Runtime
# -----------------------------------------------------------------------------
FROM oven/bun:1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV RUN_MIGRATIONS=true

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# By default, runs `prisma migrate deploy` before app start.
# Set RUN_MIGRATIONS=false to skip it.
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv

COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod 755 /usr/local/bin/docker-entrypoint.sh

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD bun -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["docker-entrypoint.sh"]
