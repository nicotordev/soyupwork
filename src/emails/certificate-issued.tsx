import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import {
  buildCertificatePdfDownloadUrl,
  buildCertificateVerificationUrl,
} from "@/lib/certificates/certificate-urls";

type CertificateIssuedEmailProps = {
  courseTitle: string;
  certificateCode: string;
  certificateId: string;
};

export function CertificateIssuedEmail({
  courseTitle,
  certificateCode,
  certificateId,
}: CertificateIssuedEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://soyup.work";
  const verifyUrl = buildCertificateVerificationUrl(certificateCode);
  const pdfUrl = buildCertificatePdfDownloadUrl(certificateId);

  return (
    <Html>
      <Head />
      <Preview>Tu certificado de {courseTitle} ya está disponible</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>¡Certificado emitido!</Heading>
          <Text style={text}>
            Completaste el curso <strong>{courseTitle}</strong>. Tu certificado
            oficial ya está disponible en tu panel.
          </Text>
          <Text style={text}>
            Código de verificación: <strong>{certificateCode}</strong>
          </Text>
          <Text style={text}>
            <a href={verifyUrl} style={link}>
              Verificar certificado públicamente
            </a>
          </Text>
          <Text style={text}>
            <a href={pdfUrl} style={link}>
              Descargar PDF
            </a>
          </Text>
          <Text style={text}>
            <a href={`${appUrl}/dashboard/certificates`} style={link}>
              Ver todos mis certificados
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

export default CertificateIssuedEmail;
