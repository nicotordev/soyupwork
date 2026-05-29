export function buildSignInRedirectUrl(returnPath: string): string {
  return `/sign-in?redirect_url=${encodeURIComponent(returnPath)}`;
}
