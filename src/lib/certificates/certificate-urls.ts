import { getAppOrigin } from "@/lib/seo/app-origin";

export function buildCertificateVerificationUrl(code: string): string {
  const origin = getAppOrigin();
  return `${origin}/certificados/verificar/${encodeURIComponent(code)}`;
}

export function buildCertificatePdfDownloadUrl(certificateId: string): string {
  const origin = getAppOrigin();
  return `${origin}/api/certificates/${certificateId}/pdf`;
}
