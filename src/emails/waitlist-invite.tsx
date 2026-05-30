import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

type WaitlistInviteEmailProps = {
  siteName: string;
  inviteUrl: string;
  expiresDays: number;
};

export function WaitlistInviteEmail({
  siteName,
  inviteUrl,
  expiresDays,
}: WaitlistInviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Te invitamos a unirte a {siteName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Tu invitación está lista</Heading>
          <Text style={text}>
            Un administrador de {siteName} te invitó a crear tu cuenta en la
            plataforma. Usá el enlace siguiente para validar tu invitación y
            registrarte.
          </Text>
          <Button href={inviteUrl} style={button}>
            Aceptar invitación
          </Button>
          <Text style={text}>
            Este enlace expira en {expiresDays} días y solo puede usarse una vez.
            Si no esperabas este correo, podés ignorarlo.
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
  padding: "32px 24px",
  borderRadius: "8px",
  maxWidth: "480px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "700" as const,
  color: "#111827",
  margin: "0 0 16px",
};

const text = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#374151",
  margin: "0 0 16px",
};

const button = {
  backgroundColor: "#111827",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
  margin: "0 0 24px",
};
