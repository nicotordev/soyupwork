import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

type PurchaseConfirmationEmailProps = {
  userName: string;
  courseTitle: string;
};

export function PurchaseConfirmationEmail({
  userName,
  courseTitle,
}: PurchaseConfirmationEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://soyup.work";

  return (
    <Html>
      <Head />
      <Preview>Acceso confirmado: {courseTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>¡Compra confirmada!</Heading>
          <Text style={text}>Hola {userName},</Text>
          <Text style={text}>
            Tu pago fue procesado correctamente. Ya tienes acceso al curso{" "}
            <strong>{courseTitle}</strong>.
          </Text>
          <Text style={text}>
            <a href={`${appUrl}/dashboard`} style={link}>
              Ir al dashboard
            </a>
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
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600" as const,
  color: "#111",
};

const text = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#444",
};

const link = {
  color: "#2563eb",
};

export default PurchaseConfirmationEmail;
