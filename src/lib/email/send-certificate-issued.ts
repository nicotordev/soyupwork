import { CertificateIssuedEmail } from "@/emails/certificate-issued";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import { shouldNotifyStudentOnCertificate } from "@/lib/platform/settings/resolve";
import { sendEmail } from "@/lib/resend";
import { render } from "@react-email/components";

export async function sendCertificateIssuedEmail(params: {
  to: string;
  courseTitle: string;
  certificateCode: string;
  certificateId: string;
}) {
  const settings = await getPlatformSettings();
  if (!shouldNotifyStudentOnCertificate(settings)) {
    return null;
  }

  const html = await render(
    CertificateIssuedEmail({
      courseTitle: params.courseTitle,
      certificateCode: params.certificateCode,
      certificateId: params.certificateId,
    }),
  );

  await sendEmail({
    to: params.to,
    subject: `Certificado emitido: ${params.courseTitle}`,
    html,
  });
}
