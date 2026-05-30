import "server-only";

import type { EmailProviderSendVerificationRequestParams } from "@auth/core/providers";
import { sendEmail } from "@/lib/resend";
import { getPlatformSettings } from "@/lib/platform/settings/store";

export async function sendAuthMagicLinkEmail(
  params: EmailProviderSendVerificationRequestParams,
): Promise<void> {
  const { identifier: to, url } = params;
  const settings = await getPlatformSettings();
  const siteName = settings.siteName || "SoyUpwork";

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#111;max-width:480px;margin:0 auto;padding:24px">
      <p style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#666">
        ${siteName}
      </p>
      <h1 style="font-size:24px;font-weight:800;margin:0 0 12px">Iniciá sesión</h1>
      <p style="margin:0 0 20px;color:#444">
        Hacé clic en el botón para acceder a tu cuenta. El enlace expira en 1 hora.
      </p>
      <p style="margin:0 0 24px">
        <a href="${url}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:8px;border:2px solid #111">
          Iniciar sesión
        </a>
      </p>
      <p style="margin:0;font-size:13px;color:#666">
        Si no solicitaste este correo, podés ignorarlo.
      </p>
      <p style="margin:16px 0 0;font-size:12px;color:#888;word-break:break-all">
        ${url}
      </p>
    </div>
  `.trim();

  await sendEmail({
    to,
    subject: `${siteName} — Enlace para iniciar sesión`,
    html,
  });
}
