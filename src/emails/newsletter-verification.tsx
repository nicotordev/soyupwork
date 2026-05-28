import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

type NewsletterVerificationEmailProps = {
  code: string;
  siteName: string;
  expiresMinutes: number;
};

export function NewsletterVerificationEmail({
  code,
  siteName,
  expiresMinutes,
}: NewsletterVerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirma tu suscripcion al newsletter de {siteName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Confirma tu correo</Heading>
          <Text style={text}>
            Usa este codigo para confirmar tu suscripcion al newsletter de{" "}
            {siteName}:
          </Text>
          <Text style={codeStyle}>{code}</Text>
          <Text style={text}>
            El codigo expira en {expiresMinutes} minutos. Si no solicitaste
            suscribirte, puedes ignorar este mensaje.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "24px",
  borderRadius: "8px",
  maxWidth: "480px",
};

const heading = {
  fontSize: "22px",
  fontWeight: "700" as const,
  color: "#111827",
  margin: "0 0 16px",
};

const text = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#374151",
  margin: "0 0 16px",
};

const codeStyle = {
  fontSize: "32px",
  fontWeight: "800" as const,
  letterSpacing: "0.35em",
  textAlign: "center" as const,
  color: "#111827",
  margin: "24px 0",
  fontFamily: "ui-monospace, monospace",
};
