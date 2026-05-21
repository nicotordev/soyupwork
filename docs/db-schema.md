# Database Schema — soyup.work LMS

This document explains the Prisma database schema for **soyup.work**, a custom LMS for selling Upwork/freelancing courses to LATAM students.

The schema is designed around these core domains:

- Users and authentication via Clerk
- Courses, modules, and lessons
- Student enrollments and progress tracking
- Stripe products, orders, and subscriptions
- Quizzes and attempts
- Certificates

---

## 1. Design Principles

### UUID primary keys

All main records use PostgreSQL UUIDs:

```prisma
id String @id @default(uuid()) @db.Uuid
```

This is preferred over `cuid()` when the column is explicitly typed as `@db.Uuid`.

### Clerk as the authentication source

The app does **not** store passwords. Clerk owns authentication, sessions, social login, email verification, and account security.

The local `User` model stores app-specific user data and links each user to Clerk through:

```prisma
clerkId String @unique
```

### Stripe as the payment source

Stripe owns checkout, payment intents, subscriptions, invoices, and customer billing information.

The local database stores only the Stripe identifiers needed to map payment events back into the LMS.

### Course access is controlled by enrollments

A user should only access protected course content when they have an active enrollment:

```prisma
EnrollmentStatus.ACTIVE
```

Enrollments are usually created after successful Stripe payment or manually by an admin.

---

## 2. Enum Overview

### `UserRole`

Defines app-level permissions.

```prisma
STUDENT
INSTRUCTOR
ADMIN
```

Recommended usage:

- `STUDENT`: normal course buyer
- `INSTRUCTOR`: can manage their own educational content later
- `ADMIN`: can manage the whole platform

---

### `CourseStatus`

Controls course visibility.

```prisma
DRAFT
PUBLISHED
ARCHIVED
```

Recommended usage:

- `DRAFT`: hidden from public catalog
- `PUBLISHED`: visible and purchasable
- `ARCHIVED`: no longer sold, but may remain accessible to enrolled users

---

### `LessonType`

Defines the content type of a lesson.

```prisma
VIDEO
TEXT
QUIZ
DOWNLOAD
```

Recommended usage:

- `VIDEO`: main video lesson
- `TEXT`: written lesson
- `QUIZ`: lesson connected to a quiz
- `DOWNLOAD`: resource or file-based lesson

---

### `EnrollmentStatus`

Tracks course access state.

```prisma
ACTIVE
COMPLETED
CANCELLED
EXPIRED
```

Recommended usage:

- `ACTIVE`: user can access the course
- `COMPLETED`: user finished the course
- `CANCELLED`: access was manually cancelled or revoked
- `EXPIRED`: access ended after a limited access period

---

### `OrderStatus`

Tracks one-time payment state.

```prisma
PENDING
PAID
FAILED
REFUNDED
CANCELLED
```

Recommended usage:

- `PENDING`: checkout was created but payment is not confirmed
- `PAID`: payment succeeded
- `FAILED`: payment failed
- `REFUNDED`: payment was refunded
- `CANCELLED`: checkout was cancelled

---

### `SubscriptionStatus`

Tracks recurring billing state.

```prisma
ACTIVE
TRIALING
PAST_DUE
CANCELLED
UNPAID
INCOMPLETE
```

This should mirror Stripe subscription statuses as closely as possible.

---

## 3. Main Models

## `User`

Represents a platform user synced from Clerk.

### Important fields

```prisma
clerkId String @unique
email String? @unique
role UserRole @default(STUDENT)
stripeCustomerId String? @unique
```

### Why it exists

Clerk handles identity, but the app still needs a local user record to connect users to:

- Enrollments
- Lesson progress
- Orders
- Subscriptions
- Quiz attempts
- Certificates

### Relations

```prisma
enrollments    Enrollment[]
lessonProgress LessonProgress[]
orders         Order[]
subscriptions  Subscription[]
quizAttempts   QuizAttempt[]
certificates   Certificate[]
```

### Typical lifecycle

1. User signs up with Clerk.
2. Clerk webhook creates or updates the local `User`.
3. User buys a course.
4. Stripe webhook attaches `stripeCustomerId`, creates an `Order`, and creates an `Enrollment`.

---

## `Course`

Represents a sellable LMS course.

### Important fields

```prisma
slug String @unique
title String
description String?
thumbnailUrl String?
status CourseStatus @default(DRAFT)
priceCents Int
currency String @default("usd")
```

### Why price is stored here

`Course.priceCents` is useful for display and internal logic, but Stripe should remain the payment source of truth through the `Product` model.

### Relations

```prisma
modules CourseModule[]
enrollments Enrollment[]
products Product[]
certificates Certificate[]
```

A course can be attached to multiple Stripe products/prices over time. For example:

- One-time purchase
- Monthly subscription
- Lifetime deal
- Discounted launch product

---

## `CourseModule`

Groups lessons inside a course.

### Important fields

```prisma
courseId String @db.Uuid
title String
position Int
```

### Ordering

Modules are ordered by `position`.

```prisma
@@unique([courseId, position])
```

This prevents two modules from having the same position inside the same course.

### Relations

```prisma
course Course
lessons Lesson[]
```

---

## `Lesson`

Represents one learning unit inside a module.

### Important fields

```prisma
moduleId String @db.Uuid
slug String
title String
type LessonType @default(VIDEO)
content String?
durationSec Int?
isPreview Boolean @default(false)
position Int
```

### Video fields

```prisma
videoProvider String?
videoAssetId String?
videoPlaybackId String?
videoUrl String?
```

These fields allow flexibility for video providers such as:

- Bunny Stream
- Mux
- Cloudflare Stream
- Private R2-hosted HLS assets

For the current soyup.work direction, Cloudflare R2 can be used for protected assets, while HLS-compatible playback can be handled at the application layer.

### Ordering

```prisma
@@unique([moduleId, slug])
@@unique([moduleId, position])
```

This means each lesson slug and lesson position must be unique within a module.

### Relations

```prisma
module CourseModule
progress LessonProgress[]
quiz Quiz?
```

A lesson can optionally have one quiz.

---

## `Enrollment`

Represents a user having access to a course.

### Important fields

```prisma
userId String @db.Uuid
courseId String @db.Uuid
status EnrollmentStatus @default(ACTIVE)
completedAt DateTime?
```

### Uniqueness

```prisma
@@unique([userId, courseId])
```

A user can only have one enrollment per course.

### Access control

Most protected course pages should check:

```ts
user has Enrollment where courseId = currentCourse.id and status = ACTIVE or COMPLETED
```

`COMPLETED` should usually keep access unless the business model says otherwise.

---

## `LessonProgress`

Tracks whether a user completed a lesson.

### Important fields

```prisma
userId String @db.Uuid
lessonId String @db.Uuid
completed Boolean @default(false)
completedAt DateTime?
lastSeenAt DateTime @default(now())
```

### Uniqueness

```prisma
@@unique([userId, lessonId])
```

A user can only have one progress record per lesson.

### Recommended usage

- Create or update this record when a user opens a lesson.
- Set `lastSeenAt` whenever the lesson page is viewed.
- Set `completed = true` when the user finishes the lesson.
- Set `completedAt` only once, when completed for the first time.

---

## 4. Commerce Models

## `Product`

Maps a Stripe product/price to an internal course offer.

### Important fields

```prisma
courseId String? @db.Uuid
stripeProductId String @unique
stripePriceId String @unique
name String
priceCents Int
currency String @default("usd")
active Boolean @default(true)
```

### Why this exists

A course is educational content. A product is a commercial offer.

Examples:

- Course: `Upwork desde cero`
- Product 1: Lifetime access — `$99`
- Product 2: Monthly membership — `$19/month`
- Product 3: Launch discount — `$49`

### Relations

```prisma
course Course?
orders Order[]
subscriptions Subscription[]
```

---

## `Order`

Represents a one-time purchase.

### Important fields

```prisma
userId String @db.Uuid
productId String @db.Uuid
stripeCheckoutSessionId String? @unique
stripePaymentIntentId String? @unique
status OrderStatus @default(PENDING)
amountCents Int
currency String @default("usd")
```

### Recommended Stripe flow

1. User clicks buy.
2. App creates Stripe Checkout Session.
3. App creates local `Order` with `PENDING` status.
4. Stripe sends `checkout.session.completed` webhook.
5. App marks order as `PAID`.
6. App creates or activates an `Enrollment`.

---

## `Subscription`

Represents recurring billing.

### Important fields

```prisma
userId String @db.Uuid
productId String @db.Uuid
stripeSubscriptionId String @unique
status SubscriptionStatus
currentPeriodStart DateTime?
currentPeriodEnd DateTime?
cancelAtPeriodEnd Boolean @default(false)
```

### Recommended usage

Use this model for:

- Membership access
- Cohort subscriptions
- Community access
- Monthly content library access

Stripe webhooks should update this table when subscription state changes.

Relevant Stripe events usually include:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## 5. Quiz Models

## `Quiz`

Represents a quiz attached to a lesson.

### Important fields

```prisma
lessonId String @unique @db.Uuid
title String
passingScore Int @default(70)
```

### Relation to lesson

```prisma
lesson Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)
```

Each lesson can have one quiz.

---

## `QuizQuestion`

Represents a question inside a quiz.

### Important fields

```prisma
quizId String @db.Uuid
question String
position Int
```

### Ordering

```prisma
@@unique([quizId, position])
```

Questions are ordered by position inside each quiz.

---

## `QuizOption`

Represents a possible answer for a quiz question.

### Important fields

```prisma
questionId String @db.Uuid
text String
isCorrect Boolean @default(false)
position Int
```

### Important note

This schema supports single-choice and multi-choice questions, because more than one option can have `isCorrect = true`.

If the app only supports single-choice quizzes, enforce that rule in application logic.

---

## `QuizAttempt`

Stores a user's quiz attempt.

### Important fields

```prisma
userId String @db.Uuid
quizId String @db.Uuid
score Int
passed Boolean
answers Json
```

### Why `answers` is JSON

The `answers` field keeps the attempt flexible.

Example structure:

```json
{
  "questions": [
    {
      "questionId": "uuid",
      "selectedOptionIds": ["uuid"],
      "isCorrect": true
    }
  ]
}
```

For stronger analytics later, this can be normalized into a `QuizAttemptAnswer` table.

---

## 6. Certificate Model

## `Certificate`

Represents proof that a user completed a course.

### Important fields

```prisma
userId String @db.Uuid
courseId String @db.Uuid
code String @unique
issuedAt DateTime @default(now())
```

### Uniqueness

```prisma
@@unique([userId, courseId])
```

A user can only receive one certificate per course.

### Recommended usage

The `code` field should be public-verifiable.

Example certificate URL:

```txt
https://soyup.work/certificates/SOYUP-2026-000001
```

---

## 7. Main Business Flows

## User signup flow

```txt
Clerk signup
→ Clerk webhook
→ Create User in Prisma
→ User can browse courses
```

---

## One-time course purchase flow

```txt
User clicks Buy
→ Create Stripe Checkout Session
→ Create Order as PENDING
→ Stripe payment succeeds
→ Stripe webhook marks Order as PAID
→ Create Enrollment as ACTIVE
→ User can access course
```

---

## Subscription flow

```txt
User starts subscription
→ Stripe Checkout Session
→ Stripe creates subscription
→ Webhook creates Subscription
→ App grants Enrollment or membership access
→ Stripe webhooks keep status synced
```

---

## Lesson progress flow

```txt
User opens lesson
→ Upsert LessonProgress
→ Update lastSeenAt
→ User completes lesson
→ Set completed = true
→ Set completedAt
```

---

## Course completion flow

```txt
User completes all required lessons
→ Enrollment status becomes COMPLETED
→ completedAt is set
→ Certificate is generated
```

---

## Quiz flow

```txt
User submits quiz
→ App calculates score
→ Create QuizAttempt
→ If passed, lesson may be marked as completed
```

---

## 8. Recommended Access Rules

### Public users

Can access:

- Landing pages
- Published course catalog
- Course sales pages
- Preview lessons only

### Students

Can access:

- Purchased courses
- Active enrollments
- Their own progress
- Their own certificates

### Instructors

Can access:

- Course authoring tools later
- Course analytics later

### Admins

Can access:

- All courses
- All users
- Orders
- Subscriptions
- Enrollments
- Platform analytics

---

## 9. Notes for Clerk Integration

Use Clerk webhooks to keep `User` synced.

Recommended webhook events:

- `user.created`
- `user.updated`
- `user.deleted`

Recommended local sync behavior:

- `user.created`: create local `User`
- `user.updated`: update email, name, image
- `user.deleted`: either delete user or anonymize user depending on business/legal needs

For an LMS, soft-delete or anonymization is often safer than hard delete because orders, certificates, and tax records may need to remain auditable.

---

## 10. Notes for Stripe Integration

Use Stripe webhooks as the source of truth for payment state.

Recommended webhook events:

- `checkout.session.completed`
- `checkout.session.expired`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Never grant course access only from the client-side success page. Always grant access from verified Stripe webhooks.

---

## 11. Notes for Cloudflare R2

R2 should be used for private course assets such as:

- Downloadable files
- PDFs
- Templates
- Worksheets
- Source files
- Possibly video/HLS assets if the app handles signed access correctly

Recommended pattern:

```txt
Private R2 bucket
→ App checks enrollment
→ App generates signed URL
→ Student downloads or streams asset
```

Do not expose raw private asset URLs directly in the database for protected content.

For public assets such as course thumbnails, use a public R2 bucket or Cloudflare public domain.

---

## 12. Potential Future Tables

These are not required for MVP, but likely useful later.

### `Coupon`

For internal coupons independent of Stripe promotion codes.

### `Affiliate`

For affiliate/referral tracking.

### `CommunityPost`

For a lightweight community layer.

### `Comment`

For course or community discussions.

### `Lead`

For email capture before purchase.

### `EmailSequence`

For onboarding, abandoned checkout, and post-purchase flows.

### `CourseReview`

For testimonials and ratings.

### `LessonResource`

For multiple downloadable files per lesson.

### `AuditLog`

For admin/security-sensitive actions.

---

## 13. Indexing Strategy

The schema already includes useful indexes for common access patterns:

- Course lookup by `slug`
- Course filtering by `status`
- Module lookup by `courseId`
- Lesson lookup by `moduleId`
- Enrollment lookup by `userId` and `courseId`
- Progress lookup by `userId` and `lessonId`
- Orders by `userId`, `productId`, and `status`
- Subscriptions by `userId`, `productId`, and `status`
- Certificates by `code`

These indexes support the most common LMS queries:

- Get user courses
- Get course curriculum
- Check course access
- Load lesson progress
- Verify certificates
- Process Stripe webhooks idempotently

---

## 14. MVP Boundaries

For the MVP, the schema is intentionally focused.

Included:

- Users
- Courses
- Modules
- Lessons
- Enrollments
- Progress
- Stripe products/orders/subscriptions
- Quizzes
- Certificates

Not included yet:

- Full community system
- Advanced assignments
- Instructor payouts
- Affiliate commissions
- Multi-tenant organizations
- Deep analytics warehouse
- Tax invoice system

This keeps the first version shippable while leaving clean expansion paths.
