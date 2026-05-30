import { WaitlistInviteEmail } from "@/emails/waitlist-invite";
import { WAITLIST_INVITE } from "@/lib/waitlist/invite.constants";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import { sendEmail } from "@/lib/resend";
import { render } from "@react-email/components";

export async function sendWaitlistInviteEmail(params: {
  to: string;
  inviteUrl: string;
}) {
  const settings = await getPlatformSettings();
  const siteName = settings.siteName || "SoyUpwork";

  const html = await render(
    WaitlistInviteEmail({
      siteName,
      inviteUrl: params.inviteUrl,
      expiresDays: WAITLIST_INVITE.ttlDays,
    }),
  );

  await sendEmail({
    to: params.to,
    subject: `${siteName} — Invitación para crear tu cuenta`,
    html,
  });
}
