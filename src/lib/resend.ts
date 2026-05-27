import { getResolvedEmailFrom } from "@/lib/platform/settings/resolve";
import { Resend } from "resend";

let resendClient: Resend | undefined;

export function getResendClient(): Resend {
  if (resendClient) {
    return resendClient;
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }

  resendClient = new Resend(key);
  return resendClient;
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  const from = params.from ?? (await getResolvedEmailFrom());
  if (!from) {
    throw new Error("EMAIL_FROM is not set");
  }

  const { data, error } = await getResendClient().emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
