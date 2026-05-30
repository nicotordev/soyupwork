export const WAITLIST_INVITE = {
  tokenBytes: 32,
  ttlDays: 7,
  sessionCookieName: "waitlist_invite",
  sessionMaxAgeSeconds: 60 * 60 * 24,
} as const;
