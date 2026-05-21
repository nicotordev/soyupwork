# Environment Variables — soyup.work LMS

This document explains all the variables in the `.env` file used by the **soyup.work** platform.
The architecture is based on:

* Next.js App Router
* Prisma + PostgreSQL
* Clerk
* Stripe
* Resend
* Cloudflare R2
* Mux
* Inngest

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

* redirects
* callbacks
* emails
* webhooks
* absolute URL generation

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

# 3. CLERK

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=

NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
```

Clerk handles:

* authentication
* sessions
* OAuth
* email verification
* social login

The app does not store passwords.

---

## `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

Frontend public key.

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

* checkout
* subscriptions
* payments
* invoices
* refunds

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
```

Resend is used for:

* transactional emails
* onboarding
* receipts
* password/access recovery
* LMS system emails

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

* PDFs
* templates
* private assets
* thumbnails
* downloadable resources

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

* uploads
* encoding
* HLS streaming
* protected playback
* video processing

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

* background jobs
* workflows
* retries
* cron jobs
* async emails
* analytics processing

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

* distributed rate limiting
* caching
* locks
* queues
* temporary sessions

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

* PostgreSQL as the source of truth
* Stripe as the payment provider
* Clerk as the auth provider
* R2 for assets
* Mux for video
* Resend for emails
* Simple internal analytics
* Simple internal logging

Avoid:

* microservices
* Kafka
* complex observability
* analytical warehouses
* full event sourcing

The priority must be shipping fast, driving sales, and validating educational content.
