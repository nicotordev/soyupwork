import { WaitlistVerificationEmail } from "@/emails/waitlist-verification";
import { WAITLIST_VERIFICATION } from "@/lib/waitlist/verification.constants";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import { sendEmail } from "@/lib/resend";
import { render } from "@react-email/components";

export async function sendWaitlistVerificationEmail(params: {
  to: string;
  code: string;
}) {
  const settings = await getPlatformSettings();
  const siteName = settings.siteName || "SoyUpwork";

  const html = await render(
    WaitlistVerificationEmail({
      code: params.code,
      siteName,
      expiresMinutes: WAITLIST_VERIFICATION.ttlMinutes,
    }),
  );

  await sendEmail({
    to: params.to,
    subject: `${siteName} — Código de verificación (${params.code})`,
    html,
  });
}
