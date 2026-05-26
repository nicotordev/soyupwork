import { getResolvedEmailFrom } from "@/lib/platform-settings/resolve-settings";
import { Resend } from "resend";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(key);
}

declare global {
  // eslint-disable-next-line no-var
  var resend: Resend | undefined;
}

const resend = global.resend ?? getResend();

if (process.env.NODE_ENV !== "production") {
  global.resend = resend;
}

export default resend;

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

  const { data, error } = await resend.emails.send({
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
