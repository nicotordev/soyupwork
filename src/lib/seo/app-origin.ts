export function getAppOrigin(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!url) return "https://soyup.work";
  return url.replace(/\/$/, "");
}

export function getMetadataBase(): URL {
  return new URL(`${getAppOrigin()}/`);
}
