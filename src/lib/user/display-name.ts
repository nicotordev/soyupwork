export function displayName(user: {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}): string {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return fullName || user.email || "Usuario";
}
