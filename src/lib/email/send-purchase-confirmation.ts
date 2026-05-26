import { PurchaseConfirmationEmail } from "@/emails/purchase-confirmation";
import { getPlatformSettings } from "@/lib/platform/settings/store";
import { shouldSendPurchaseConfirmation } from "@/lib/platform/settings/resolve";
import { sendEmail } from "@/lib/resend";
import { render } from "@react-email/components";

export async function sendPurchaseConfirmationEmail(params: {
  to: string;
  userName: string;
  courseTitle: string;
  orderId: string;
}) {
  const settings = await getPlatformSettings();
  if (!shouldSendPurchaseConfirmation(settings)) {
    return null;
  }

  const html = await render(
    PurchaseConfirmationEmail({
      userName: params.userName,
      courseTitle: params.courseTitle,
    }),
  );

  await sendEmail({
    to: params.to,
    subject: `Acceso confirmado: ${params.courseTitle}`,
    html,
  });
}
