import { NewsletterVerificationEmail } from "@/emails/newsletter-verification";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import { sendEmail } from "@/lib/resend";
import { WAITLIST_VERIFICATION } from "@/lib/waitlist/verification.constants";
import { render } from "@react-email/components";

export async function sendNewsletterVerificationEmail(params: {
  to: string;
  code: string;
}) {
  const settings = await getPlatformSettings();
  const siteName = settings.siteName || "SoyUpwork";

  const html = await render(
    NewsletterVerificationEmail({
      code: params.code,
      siteName,
      expiresMinutes: WAITLIST_VERIFICATION.ttlMinutes,
    }),
  );

  await sendEmail({
    to: params.to,
    subject: `${siteName} - Confirma tu suscripcion al newsletter`,
    html,
  });
}
