export type WaitlistInviteSessionPayload = {
  inviteId: string;
  email: string;
};

export function isWaitlistInviteSessionPayload(
  value: unknown,
): value is WaitlistInviteSessionPayload {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.inviteId === "string" &&
    typeof record.email === "string" &&
    record.email.length > 0
  );
}
