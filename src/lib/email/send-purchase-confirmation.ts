import { PurchaseConfirmationEmail } from "@/emails/purchase-confirmation";
import { sendEmail } from "@/lib/resend";
import { render } from "@react-email/components";

export async function sendPurchaseConfirmationEmail(params: {
  to: string;
  userName: string;
  courseTitle: string;
  orderId: string;
}) {
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
