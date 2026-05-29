# Database Schema — soyup.work LMS

This document explains the Prisma database schema for **soyup.work**, a custom LMS for selling Upwork/freelancing courses to LATAM students.

Source of truth: [`prisma/schema.prisma`](../prisma/schema.prisma).

The schema is designed around these core domains:

- Users and authentication via Clerk
- Courses, categories, tags, modules, and lessons
- Student enrollments, cohorts, and progress tracking
- Stripe products, orders, subscriptions, coupons, and bundles
- Quizzes and attempts
- Certificates and downloadable lesson assets
- Marketing (leads, blog, waitlist, newsletter)
- Analytics and email delivery
- Community and course discussions
- Gamification and affiliates
- Platform-wide settings (singleton)

---

## 1. Design Principles

### UUID primary keys

All main records use PostgreSQL UUIDs:

```prisma
id String @id @default(uuid()) @db.Uuid
```

This is preferred over `cuid()` when the column is explicitly typed as `@db.Uuid`.

### Timestamps

Most models use `@db.Timestamp(6)` for `createdAt` / `updatedAt` (and other datetimes) for microsecond precision.

### Clerk as the authentication source

The app does **not** store passwords. Clerk owns authentication, sessions, social login, email verification, and account security.

The local `User` model stores app-specific user data and links each user to Clerk through:

```prisma
clerkId String @unique
```

Auth-related UX flags (redirect URLs, OAuth toggles) live in `PlatformSettings`; secrets stay in environment variables.

### Stripe as the payment source

Stripe owns checkout, payment intents, subscriptions, invoices, and customer billing information.

The local database stores only the Stripe identifiers needed to map payment events back into the LMS. Checkout and currency defaults can be toggled via `PlatformSettings`.

### Course access is controlled by enrollments

A user should only access protected course content when they have a valid enrollment:

```prisma
EnrollmentStatus.ACTIVE
```

Also consider `COMPLETED` (usually retains access) and `expiresAt` when access is time-limited.

Enrollments are usually created after successful Stripe payment, bundle purchase, admin grant, or cohort assignment.

### Private assets (R2 / Mux)

Protected downloads use `LessonAsset.storageKey` (not public URLs). Video may use Mux (`videoProvider`, `videoAssetId`, etc.) with signed playback controlled in app settings.

---

## 2. Enum Overview

### Core LMS

| Enum                | Values                                           | Purpose                  |
| ------------------- | ------------------------------------------------ | ------------------------ |
| `UserRole`          | `STUDENT`, `INSTRUCTOR`, `ADMIN`                 | App-level permissions    |
| `CourseStatus`      | `DRAFT`, `PUBLISHED`, `ARCHIVED`                 | Catalog visibility       |
| `CourseLevel`       | `BEGINNER`, `INTERMEDIATE`, `ADVANCED`           | Course difficulty        |
| `LessonType`        | `VIDEO`, `TEXT`, `QUIZ`, `DOWNLOAD`              | Lesson content type      |
| `LessonVideoStatus` | `PENDING`, `READY`, `ERRORED`, `DELETED`         | Video processing state   |
| `EnrollmentStatus`  | `ACTIVE`, `COMPLETED`, `CANCELLED`, `EXPIRED`    | Course access state      |
| `ExperienceLevel`   | `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT` | User profile skill level |

### Commerce

| Enum                 | Values                                                                | Purpose                           |
| -------------------- | --------------------------------------------------------------------- | --------------------------------- |
| `OrderStatus`        | `PENDING`, `PAID`, `FAILED`, `REFUNDED`, `CANCELLED`                  | One-time payment state            |
| `SubscriptionStatus` | `ACTIVE`, `TRIALING`, `PAST_DUE`, `CANCELLED`, `UNPAID`, `INCOMPLETE` | Recurring billing (mirror Stripe) |
| `ProductType`        | `ONE_TIME`, `SUBSCRIPTION`                                            | How the product is sold           |
| `BillingInterval`    | `MONTH`, `YEAR`                                                       | Subscription cadence              |
| `CouponDiscountType` | `PERCENTAGE`, `FIXED`                                                 | Coupon discount shape             |

### Quizzes & assets

| Enum               | Values                                                                     | Purpose                 |
| ------------------ | -------------------------------------------------------------------------- | ----------------------- |
| `QuizQuestionType` | `SINGLE_CHOICE`, `MULTIPLE_CHOICE`                                         | Question scoring rules  |
| `LessonAssetType`  | `PDF`, `TEMPLATE`, `ZIP`, `SOURCE_FILE`, `CHECKLIST`, `WORKSHEET`, `OTHER` | Downloadable asset kind |

### Marketing & ops

| Enum                 | Values                                                                                                                                                           | Purpose              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `BlogPostStatus`     | `DRAFT`, `PUBLISHED`, `ARCHIVED`                                                                                                                                 | Blog visibility      |
| `LeadStatus`         | `NEW`, `CONTACTED`, `QUALIFIED`, `CONVERTED`, `UNSUBSCRIBED`                                                                                                     | Lead pipeline        |
| `AnalyticsEventType` | `PAGE_VIEW`, `COURSE_VIEW`, `LESSON_START`, `LESSON_COMPLETE`, `CHECKOUT_START`, `CHECKOUT_COMPLETE`, `VIDEO_PLAY`, `VIDEO_PROGRESS`, `VIDEO_COMPLETE`, `SIGNUP` | Event taxonomy       |
| `EmailLogStatus`     | `PENDING`, `SENT`, `FAILED`, `BOUNCED`                                                                                                                           | Outbound email state |
| `EmailLogType`       | `TRANSACTIONAL`, `MARKETING`                                                                                                                                     | Email category       |

### Community & cohorts

| Enum                  | Values                                                   | Purpose          |
| --------------------- | -------------------------------------------------------- | ---------------- |
| `CommunityPostStatus` | `PUBLISHED`, `HIDDEN`, `DELETED`                         | Moderation state |
| `CohortStatus`        | `DRAFT`, `OPEN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` | Cohort lifecycle |

---

## 3. User & Profile

## `User`

Represents a platform user synced from Clerk.

### Important fields

```prisma
clerkId          String   @unique
email            String?  @unique
username         String?  @unique
role             UserRole @default(STUDENT)
stripeCustomerId String?  @unique

countryCode     String?
timezone        String?
locale          String?          @default("es")
socialLinks     Json?
skills          String[]         @default([])
experienceLevel ExperienceLevel?
freelanceGoals  String?

deletedAt        DateTime?
suspendedAt      DateTime?
bannedAt         DateTime?
onboardingDoneAt DateTime?
```

### Relations

```prisma
enrollments       Enrollment[]
lessonProgress    LessonProgress[]
orders            Order[]
subscriptions     Subscription[]
quizAttempts      QuizAttempt[]
certificates      Certificate[]
instructedCourses Course[]           @relation("CourseInstructor")
courseReviews     CourseReview[]
blogPosts         BlogPost[]
analyticsEvents   AnalyticsEvent[]
communityPosts    CommunityPost[]
communityComments CommunityComment[]
communityLikes    CommunityLike[]
userGamification  UserGamification?
userBadges        UserBadge[]
affiliate         Affiliate?
emailLogs         EmailLog[]
auditLogs         AuditLog[]         @relation("AuditActor")
courseDiscussions CourseDiscussion[]
```

### Typical lifecycle

1. User signs up with Clerk.
2. Clerk webhook creates or updates the local `User`.
3. Optional onboarding sets `onboardingDoneAt`.
4. User purchases via Stripe → `Order` / `Subscription` → `Enrollment`.

### Account moderation

- `deletedAt`: soft delete (prefer anonymization over hard delete for audit/tax).
- `suspendedAt` / `bannedAt`: block access without deleting financial records.

---

## 4. Course Catalog

## `CourseCategory`

Groups courses in the public catalog.

```prisma
slug     String @unique
name     String
icon     String?
position Int    @default(0)
```

## `Tag` / `CourseTag`

Many-to-many tags on courses via composite key `@@id([courseId, tagId])`.

## `Course`

Represents a sellable LMS course.

### Important fields

```prisma
slug         String       @unique
title        String
status       CourseStatus @default(DRAFT)
priceCents   Int
currency     String       @default("usd")

categoryId   String?
instructorId String?
level        CourseLevel  @default(BEGINNER)

isFeatured             Boolean @default(false)
offersCertificate      Boolean @default(false)
estimatedDurationHours Int?
isFree                 Boolean @default(false)
publishedAt            DateTime?
dripEnabled            Boolean @default(false)
minCompletionPercent   Int     @default(100)
seoTitle               String?
seoDescription         String?
previewVideoUrl        String?
```

`Course.priceCents` is useful for display; Stripe remains the payment source of truth through `Product`.

### Relations

```prisma
modules           CourseModule[]
enrollments       Enrollment[]
products          Product[]
certificates      Certificate[]
tags              CourseTag[]
reviews           CourseReview[]
leads             Lead[]
bundleItems       ProductBundleItem[]
communityPosts    CommunityPost[]
cohorts           Cohort[]
courseDiscussions CourseDiscussion[]
```

## `CourseReview`

Student or marketing testimonials linked to a course.

```prisma
@@unique([userId, courseId])
rating      Int
isPublished Boolean @default(false)
```

Optional display fields: `headline`, `comment`, `displayName`, `niche`, `metricBefore`, `metricAfter`.

---

## 5. Curriculum

## `CourseModule`

Groups lessons inside a course.

```prisma
courseId        String @db.Uuid
title           String
position        Int
description     String?
unlockAfterDays Int?   // drip: days after enrollment
@@unique([courseId, position])
```

## `Lesson`

One learning unit inside a module.

### Important fields

```prisma
moduleId        String @db.Uuid
slug            String
type            LessonType @default(VIDEO)
isPreview       Boolean    @default(false)
position        Int
unlockAfterDays Int?
unlockAt        DateTime?

videoProvider   String?
videoAssetId    String?
videoPlaybackId String?
videoUrl        String?
videoStatus     LessonVideoStatus?
```

```prisma
@@unique([moduleId, slug])
@@unique([moduleId, position])
```

### Relations

```prisma
module      CourseModule
progress    LessonProgress[]
quiz        Quiz?
assets      LessonAsset[]
discussions CourseDiscussion[]
```

## `LessonAsset`

Downloadable files for a lesson (R2 `storageKey`, not a public URL).

```prisma
type       LessonAssetType @default(OTHER)
storageKey String
fileName   String
position   Int @default(0)
```

---

## 6. Enrollments & Progress

## `Enrollment`

```prisma
userId      String @db.Uuid
courseId    String @db.Uuid
status      EnrollmentStatus @default(ACTIVE)
completedAt DateTime?
expiresAt   DateTime?   // limited-time access
source      String?     // e.g. stripe, admin, bundle
@@unique([userId, courseId])
```

Optional link: `cohortEnrollment CohortEnrollment?`

### Access control

```ts
// Typical check
enrollment.status in (ACTIVE, COMPLETED)
&& (expiresAt is null || expiresAt > now)
```

## `LessonProgress`

```prisma
completed       Boolean   @default(false)
completedAt     DateTime?
lastSeenAt      DateTime  @default(now())
watchedSeconds  Int       @default(0)
lastPositionSec Int       @default(0)
@@unique([userId, lessonId])
```

Use `watchedSeconds` / `lastPositionSec` for video resume and completion heuristics.

---

## 7. Commerce

## `Product`

Maps a Stripe product/price to an internal offer.

```prisma
stripeProductId String @unique
stripePriceId   String @unique
courseId        String?
type            ProductType      @default(ONE_TIME)
billingInterval BillingInterval?
isLifetime      Boolean          @default(false)
trialDays       Int?
isBundle        Boolean          @default(false)
```

Bundles use `ProductBundleItem` to attach multiple courses to one `Product`.

## `ProductBundleItem`

```prisma
@@id([productId, courseId])
position Int @default(0)
```

## `Order`

```prisma
status        OrderStatus @default(PENDING)
amountCents   Int
discountCents Int         @default(0)
couponId      String?
refundedAt    DateTime?
stripeCheckoutSessionId String? @unique
stripePaymentIntentId   String? @unique
```

`product` uses `onDelete: Restrict` to preserve purchase history.

## `Subscription`

```prisma
stripeSubscriptionId String @unique
status               SubscriptionStatus
currentPeriodStart   DateTime?
currentPeriodEnd     DateTime?
cancelAtPeriodEnd    Boolean @default(false)
```

## `Coupon`

Internal coupons (can complement Stripe promotion codes).

```prisma
code           String @unique
discountType   CouponDiscountType
percentOff     Int?
amountOffCents Int?
maxRedemptions Int?
redemptionCount Int @default(0)
expiresAt      DateTime?
active         Boolean @default(true)
```

### Recommended Stripe flow (one-time)

1. User clicks buy → Stripe Checkout Session.
2. Create local `Order` as `PENDING` (optional `couponId`).
3. Webhook `checkout.session.completed` → `PAID`, increment coupon redemption.
4. Create or activate `Enrollment` (set `source`, `expiresAt` if applicable).

Never grant course access only from the client success page.

---

## 8. Quizzes

## `Quiz`

```prisma
lessonId     String @unique @db.Uuid
passingScore Int    @default(70)
```

## `QuizQuestion`

```prisma
type     QuizQuestionType @default(SINGLE_CHOICE)
position Int
@@unique([quizId, position])
```

## `QuizOption`

```prisma
@@unique([questionId, position])
isCorrect Boolean @default(false)
```

For `SINGLE_CHOICE`, enforce exactly one `isCorrect` in application logic. For `MULTIPLE_CHOICE`, multiple options may be correct.

## `QuizAttempt`

```prisma
score   Int
passed  Boolean
answers Json
```

Example `answers` JSON:

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

---

## 9. Certificates

## `Certificate`

```prisma
code      String   @unique
issuedAt  DateTime @default(now())
pdfUrl    String?
revokedAt DateTime?
@@unique([userId, courseId])
```

Public verification example:

```txt
https://soyup.work/certificates/SOYUP-2026-000001
```

Issue when `Course.offersCertificate` is true and completion rules pass (`minCompletionPercent`, required lessons/quizzes).

---

## 10. Marketing & Content

## `Lead`

Pre-purchase interest capture.

```prisma
email    String
status   LeadStatus @default(NEW)
courseId String?
metadata Json?
```

## `BlogPost`

```prisma
slug    String @unique
status  BlogPostStatus @default(DRAFT)
author  User?  @relation("BlogAuthor")
```

## `WaitlistEntry` / `WaitlistVerification`

Waitlist signups with OTP verification (`codeHash`, `expiresAt`, `attempts`) before promoting to `WaitlistEntry`.

## `NewsletterSubscriber` / `NewsletterVerification`

Same OTP pattern for newsletter opt-in.

Controlled in part by `PlatformSettings.waitlistMode` and related flags.

---

## 11. Analytics & Email

## `AnalyticsEvent`

Lightweight product analytics (not a full warehouse).

```prisma
type       AnalyticsEventType
userId     String?
sessionId  String?
courseId   String?
lessonId   String?
properties Json?
```

Retention hint: `PlatformSettings.analyticsRetentionDays` (default 365).

## `EmailLog`

Outbound email audit trail per send attempt.

## `EmailSequence` / `EmailSequenceStep`

Drip campaigns with ordered steps (`delayHours`, `template`, `subject`).

```prisma
@@unique([sequenceId, position])
```

Transactional toggles (purchase, enrollment, certificate) live in `PlatformSettings`.

---

## 12. Community & Discussions

## `CommunityPost`

Course-scoped or global posts with moderation status.

## `CommunityComment`

Threaded comments via `parentId` (`CommentThread` self-relation).

## `CommunityLike`

Like a post or comment; unique per user per target.

## `CourseDiscussion`

Q&A tied to a course and optionally a specific `lessonId` (lighter than full community posts).

---

## 13. Cohorts

## `Cohort`

Time-bounded runs of a course.

```prisma
courseId    String
slug        String
status      CohortStatus @default(DRAFT)
startsAt    DateTime
endsAt      DateTime?
maxStudents Int?
@@unique([courseId, slug])
```

## `CohortEnrollment`

Links a `Cohort` to an existing `Enrollment` (`enrollmentId` is `@unique`).

---

## 14. Gamification

## `UserGamification`

One row per user (`userId` as PK): `xp`, `level`, streak fields.

## `Badge` / `UserBadge`

Achievement definitions and earned badges (`@@id([userId, badgeId])`).

---

## 15. Affiliates

## `Affiliate`

```prisma
userId            String @unique
code              String @unique
commissionRateBps Int    @default(1000)  // basis points (1000 = 10%)
```

## `AffiliateReferral`

Tracks referred email / optional `orderId` and conversion commission.

---

## 16. Platform Configuration

## `PlatformSettings`

Singleton row (`id = "default"`) for runtime feature flags and non-secret defaults:

- Site branding, maintenance mode, waitlist mode
- Clerk redirect URLs and registration gates
- Stripe currency, refund policy days
- Email from/support and send toggles
- R2/Mux limits and video playback defaults
- Admin notification and rate-limit settings

Secrets (Clerk, Stripe, Resend, R2, Mux API keys) remain in environment variables only.

## `AuditLog`

Admin/security actions with `actorUserId`, `action`, `entityType`, `entityId`, `metadata`.

---

## 17. Main Business Flows

### User signup

```txt
Clerk signup → webhook → User
→ optional onboarding (onboardingDoneAt)
→ browse catalog
```

### One-time purchase

```txt
Buy → Checkout Session → Order PENDING
→ webhook PAID → Enrollment ACTIVE
→ optional Coupon redemption
→ EmailLog / AnalyticsEvent
```

### Subscription

```txt
Checkout → Subscription row
→ webhooks sync status
→ grant Enrollment while ACTIVE / TRIALING
→ revoke or EXPIRED on cancel / unpaid per business rules
```

### Bundle purchase

```txt
Product.isBundle = true
→ ProductBundleItem lists courses
→ one Order → multiple Enrollments
```

### Lesson progress

```txt
Open lesson → upsert LessonProgress (lastSeenAt)
→ video events update watchedSeconds / lastPositionSec
→ complete → completed + completedAt
```

### Course completion & certificate

```txt
Required lessons done (minCompletionPercent)
→ Enrollment COMPLETED + completedAt
→ Certificate if offersCertificate
```

### Drip content

```txt
Enrollment createdAt + module.unlockAfterDays / lesson.unlockAfterDays
→ gate access in app layer
```

### Waitlist / newsletter OTP

```txt
Submit email → *Verification row with codeHash
→ verify OTP → promote to WaitlistEntry / NewsletterSubscriber
```

---

## 18. Recommended Access Rules

### Public

- Landing, blog (`PUBLISHED`), catalog (`CourseStatus.PUBLISHED`)
- Preview lessons (`Lesson.isPreview`)
- Respect `PlatformSettings.maintenanceMode` and `waitlistMode`

### Students

- Active/non-expired enrollments
- Own progress, certificates, quiz attempts
- Community/discussions per course enrollment

### Instructors

- `Course.instructorId` matches user (future authoring UI)
- Own instructed courses

### Admins

- Full platform access; bypass maintenance when `maintenanceAllowAdmins`
- Orders, subscriptions, coupons, audit logs, settings

---

## 19. Integration Notes

### Clerk webhooks

Recommended: `user.created`, `user.updated`, `user.deleted`.

Sync `email`, `firstName`, `lastName`, `imageUrl`, `username`. On delete, prefer soft delete (`deletedAt`) or anonymization.

### Stripe webhooks

Recommended: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`, `customer.subscription.*`, `invoice.payment_*`.

Always grant access from verified webhooks, not the success page alone.

### Cloudflare R2

- Store private keys in `LessonAsset.storageKey`
- Check enrollment before signed URL generation
- Public thumbnails / marketing assets may use `PlatformSettings.storagePublicUrl` or a public bucket

### Mux (optional)

When `PlatformSettings.enableMuxStreaming` is true, use lesson video fields and `videoSignedPlayback` for protected playback.

---

## 20. Indexing Strategy

The schema indexes common LMS and ops queries, including:

| Area         | Indexed fields                                                                      |
| ------------ | ----------------------------------------------------------------------------------- |
| Users        | `deletedAt`, `role`, `suspendedAt`, `bannedAt`                                      |
| Courses      | `slug`, `status`, `categoryId`, `instructorId`, `isFeatured`, `level`               |
| Curriculum   | `courseId` on modules; `moduleId` on lessons                                        |
| Enrollments  | `userId`, `courseId`, `status`, `expiresAt`                                         |
| Progress     | `userId`, `lessonId`, `completed`                                                   |
| Commerce     | `courseId`, `active`, `type` on products; orders by `userId`, `status`, `createdAt` |
| Certificates | `code`, `issuedAt`                                                                  |
| Leads        | `email`, `status`, `createdAt`                                                      |
| Analytics    | `type + createdAt`, `userId + createdAt`, `sessionId`                               |
| Community    | `status + createdAt` on posts                                                       |
| Cohorts      | `courseId`, `status`, `startsAt`                                                    |

Use these for dashboard queries, webhook idempotency lookups (Stripe IDs are `@unique`), and certificate verification.

---

## 21. Schema Boundaries

### Implemented in schema (beyond original MVP doc)

- Categories, tags, instructors, course reviews
- Drip unlocks, free courses, SEO fields
- Lesson assets, video status, video watch progress
- Coupons, product types, bundles
- Leads, blog, waitlist/newsletter with OTP verification
- Analytics events, email logs, email sequences
- Community, course discussions, cohorts
- Gamification, affiliates (referral tracking)
- Platform settings singleton, audit log

### Still out of scope / application-layer

- Full data warehouse / BI exports (use `AnalyticsEvent` as lightweight trail only)
- Instructor payout ledger
- Multi-tenant organizations
- Tax invoicing system
- Normalized `QuizAttemptAnswer` table (optional future refactor)
- Automated affiliate payout settlement

This keeps operational flexibility while the Prisma schema remains the single structural reference for the LMS.
