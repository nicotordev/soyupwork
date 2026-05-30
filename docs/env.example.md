# Environment Variables — soyup.work LMS

This document explains all the variables in the `.env` file used by the **soyup.work** platform.
The architecture is based on:

- Next.js App Router
- Prisma + PostgreSQL
- Auth.js (NextAuth v5)
- Stripe
- Resend
- Cloudflare R2
- Mux
- Inngest

The project aims to maintain complete ownership of the LMS and minimize unnecessary external dependencies.

---

# 1. APP

```env
NODE_ENV=
NEXT_PUBLIC_APP_URL=
```

## `NODE_ENV`

Defines the execution environment.

Typical values:

```env
NODE_ENV=development
```

```env
NODE_ENV=production
```

---

## `NEXT_PUBLIC_APP_URL`

Main public URL of the application.

Examples:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

or:

```env
NEXT_PUBLIC_APP_URL=https://soyupwork.nicotordev.com
```

Used for:

- redirects
- callbacks
- emails
- webhooks
- absolute URL generation

---

# 2. DATABASE

```env
DATABASE_URL=
```

PostgreSQL connection for Prisma.

Local example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/soyupwork?schema=public
```

Neon example:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

---

# 3. AUTH.JS

```env
AUTH_SECRET=
AUTH_URL=

AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

NEXT_PUBLIC_AUTH_SIGN_OUT_URL=
AUTH_SIGN_OUT_URL=
```

Auth.js handles:

- authentication
- sessions (JWT)
- OAuth (Google, GitHub)
- credentials (email + password)

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

Post-login redirects are configured in **Admin → Settings → Auth** (`afterSignInUrl`, `afterSignUpUrl`).

---

## `AUTH_SECRET`

Required in production. Used to sign session tokens.

---

## `AUTH_URL`

Canonical app URL for Auth.js callbacks (usually same as `NEXT_PUBLIC_APP_URL`).

---

## OAuth providers

```env
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

Register callback URLs:

- `{AUTH_URL}/api/auth/callback/google`
- `{AUTH_URL}/api/auth/callback/github`

---

## Sign-out redirect

```env
NEXT_PUBLIC_AUTH_SIGN_OUT_URL=/
AUTH_SIGN_OUT_URL=/
```

---

# 4. STRIPE (was section 4 — renumber below as needed)

Starts with:

```txt
pk_test_
```

---

## `CLERK_SECRET_KEY`

Backend private key.

Starts with:

```txt
sk_test_
```

Never expose to the client.

---

## `CLERK_WEBHOOK_SECRET`

Secret used to verify Clerk Svix webhooks.

Recommended events:

```txt
user.created
user.updated
user.deleted
```

---

## Clerk URLs

Example:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

---

# 4. STRIPE

```env
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

STRIPE_WEBHOOK_SECRET=

STRIPE_CURRENCY=
```

Stripe handles:

- checkout
- subscriptions
- payments
- invoices
- refunds

The database only synchronizes IDs and statuses.

---

## `STRIPE_SECRET_KEY`

Backend private key.

Starts with:

```txt
sk_test_
```

---

## `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Frontend public key.

Starts with:

```txt
pk_test_
```

---

## `STRIPE_WEBHOOK_SECRET`

Secret of the Stripe webhook endpoint.

Example:

```txt
whsec_xxxxxxxxx
```

Recommended events:

```txt
checkout.session.completed
checkout.session.expired
payment_intent.succeeded
payment_intent.payment_failed
charge.refunded
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.payment_succeeded
invoice.payment_failed
```

---

## `STRIPE_CURRENCY`

Main currency.

Example:

```env
STRIPE_CURRENCY=usd
```

---

# 5. RESEND

```env
RESEND_API_KEY=

EMAIL_FROM=
EMAIL_SUPPORT=

# Waitlist (verified signups only)
RESEND_WAITLIST_SEGMENT_ID=
WAITLIST_VERIFICATION_SECRET=

# Cloudflare Turnstile (waitlist form)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

Resend is used for:

- transactional emails
- onboarding
- receipts
- password/access recovery
- LMS system emails
- waitlist email verification (OTP)
- waitlist contact list (segment)

---

## `RESEND_API_KEY`

Private API key.

Starts with:

```txt
re_
```

---

## `EMAIL_FROM`

Sender email address.

Example:

```env
EMAIL_FROM="soyup.work <noreply@soyup.work>"
```

---

## `EMAIL_SUPPORT`

Support email address.

Example:

```env
EMAIL_SUPPORT=support@soyup.work
```

---

## Waitlist (verification + audience)

Used when `waitlistMode` is enabled in platform settings (`/waitlist` page).

Flow:

1. User submits email → app sends a 6-digit code via Resend (`EMAIL_FROM`).
2. User confirms the code → entry is saved in the database, synced to Clerk waitlist, and added to the Resend segment.

### `RESEND_WAITLIST_SEGMENT_ID`

Resend **Segment** ID for verified waitlist contacts (not the legacy Audience ID).

Create the segment and print the ID:

```bash
bun run resend:waitlist-segment
```

Example:

```env
RESEND_WAITLIST_SEGMENT_ID=seg_xxxxxxxx
```

Optional: if unset, waitlist signups still work in the database and Clerk; contacts are not added to Resend.

Requires `RESEND_API_KEY` and a verified sending domain for `EMAIL_FROM`.

### `WAITLIST_VERIFICATION_SECRET`

Secret for HMAC hashing of waitlist OTP codes stored in `WaitlistVerification`.

Example (generate once):

```bash
openssl rand -hex 32
```

```env
WAITLIST_VERIFICATION_SECRET=your_random_64_char_hex_string
```

If unset, the app falls back to `CLERK_SECRET_KEY` (convenient for local dev; prefer a dedicated secret in production).

---

## Cloudflare Turnstile

Bot protection on the public waitlist form (`/waitlist`). The server validates the token before sending verification emails.

### `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

Public site key from [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile).

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...
```

### `TURNSTILE_SECRET_KEY`

Secret key for server-side `siteverify` (never expose to the client).

```env
TURNSTILE_SECRET_KEY=0x4AAAAAAA...
```

In **production**, both keys are required when the waitlist is enabled. In **development**, if they are missing, verification is skipped (logged as a warning).

---

# 6. CLOUDFLARE R2

```env
R2_ACCOUNT_ID=

R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=

R2_BUCKET=
R2_PUBLIC_URL=

R2_ENDPOINT=

R2_REGION=auto
```

R2 stores:

- PDFs
- templates
- private assets
- thumbnails
- downloadable resources

The recommendation is to use a private bucket + signed URLs.

---

## `R2_ACCOUNT_ID`

Cloudflare account ID.

---

## `R2_ACCESS_KEY_ID`

S3-compatible access key.

---

## `R2_SECRET_ACCESS_KEY`

S3-compatible secret key.

---

## `R2_BUCKET`

Main bucket name.

Example:

```env
R2_BUCKET=soyupwork-assets
```

---

## `R2_PUBLIC_URL`

Public CDN domain.

Example:

```env
R2_PUBLIC_URL=https://cdn.soyup.work
```

---

## `R2_ENDPOINT`

S3-compatible endpoint.

Example:

```env
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

---

## `R2_REGION`

Always:

```env
R2_REGION=auto
```

---

# 7. VIDEO / MUX

```env
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_WEBHOOK_SECRET=
```

Mux handles:

- uploads
- encoding
- HLS streaming
- protected playback
- video processing

---

## `MUX_TOKEN_ID`

Public backend token.

---

## `MUX_TOKEN_SECRET`

Private backend secret.

---

## `MUX_WEBHOOK_SECRET`

Secret used to validate Mux events.

Recommended events:

```txt
video.asset.ready
video.asset.errored
video.asset.deleted
video.upload.asset_created
```

---

# 8. ANALYTICS & LOGGING

```env
ANALYTICS_RETENTION_DAYS=
LOG_RETENTION_DAYS=

LOG_LEVEL=
```

The project uses internal analytics and logging stored in PostgreSQL, avoiding external dependencies like PostHog or Sentry.

---

## `ANALYTICS_RETENTION_DAYS`

How many days to retain analytical events.

Example:

```env
ANALYTICS_RETENTION_DAYS=365
```

---

## `LOG_RETENTION_DAYS`

Retention period for internal logs.

Example:

```env
LOG_RETENTION_DAYS=30
```

---

## `LOG_LEVEL`

Minimum log level.

Valid values:

```txt
debug
info
warn
error
```

Example:

```env
LOG_LEVEL=info
```

---

# 9. INNGEST

```env
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

Inngest handles:

- background jobs
- workflows
- retries
- cron jobs
- async emails
- analytics processing

---

## `INNGEST_EVENT_KEY`

Events API key.

---

## `INNGEST_SIGNING_KEY`

Internal request validation.

---

# 10. SECURITY

```env
CRON_SECRET=
INTERNAL_API_SECRET=
```

Internal secrets for protected endpoints.

---

## `CRON_SECRET`

Protects cron jobs.

Example:

```txt
x-cron-secret: ...
```

---

## `INTERNAL_API_SECRET`

Protects server-to-server internal APIs.

---

# 11. UPLOAD LIMITS

```env
MAX_VIDEO_SIZE_MB=
MAX_FILE_SIZE_MB=
```

Maximum file size limits.

Example:

```env
MAX_VIDEO_SIZE_MB=5000
MAX_FILE_SIZE_MB=100
```

---

# 12. RATE LIMITING

```env
RATE_LIMIT_MAX_REQUESTS=
RATE_LIMIT_WINDOW_MS=
```

Abuse control mechanism.

Example:

```env
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

This represents:

```txt
100 requests per minute
```

---

# 13. OPTIONAL REDIS

```env
REDIS_URL=
```

Redis is optional and can be used for:

- distributed rate limiting
- caching
- locks
- queues
- temporary sessions

Local example:

```env
REDIS_URL=redis://localhost:6379
```

Production example:

```env
REDIS_URL=redis://default:password@host:6379
```

---

# 14. MVP Recommendations

For the MVP, it is recommended to use:

- PostgreSQL as the source of truth
- Stripe as the payment provider
- Clerk as the auth provider
- R2 for assets
- Mux for video
- Resend for emails
- Simple internal analytics
- Simple internal logging

Avoid:

- microservices
- Kafka
- complex observability
- analytical warehouses
- full event sourcing

The priority must be shipping fast, driving sales, and validating educational content.
