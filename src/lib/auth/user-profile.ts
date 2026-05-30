export function buildUserDisplayName(input: {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
}): string {
  const fromParts = `${input.firstName ?? ""} ${input.lastName ?? ""}`.trim();
  if (fromParts) return fromParts;
  if (input.name?.trim()) return input.name.trim();
  if (input.email?.trim()) return input.email.trim();
  return "Usuario";
}

export function splitDisplayName(name: string | null | undefined): {
  firstName: string | null;
  lastName: string | null;
} {
  const trimmed = name?.trim();
  if (!trimmed) {
    return { firstName: null, lastName: null };
  }

  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] ?? null,
    lastName: parts.slice(1).join(" ") || null,
  };
}
