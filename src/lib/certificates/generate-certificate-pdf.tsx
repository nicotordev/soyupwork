import { renderToBuffer } from "@react-pdf/renderer";
import { CertificatePdfDocument } from "@/lib/certificates/certificate-pdf-document";

export type CertificatePdfInput = {
  studentName: string;
  courseTitle: string;
  code: string;
  issuedAt: Date;
};

export async function generateCertificatePdfBuffer(
  input: CertificatePdfInput,
): Promise<Buffer> {
  const element = (
    <CertificatePdfDocument
      studentName={input.studentName}
      courseTitle={input.courseTitle}
      code={input.code}
      issuedAt={input.issuedAt}
    />
  );

  const buffer = await renderToBuffer(element);
  return Buffer.from(buffer);
}
