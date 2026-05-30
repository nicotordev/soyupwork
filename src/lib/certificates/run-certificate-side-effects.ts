import { sendCertificateIssuedEmail } from "@/lib/email/send-certificate-issued";
import { storeCertificatePdf } from "@/lib/certificates/store-certificate-pdf";
import { getServerLogger } from "@/lib/logger/server";
import prisma from "@/lib/db/prisma";

const log = getServerLogger("certificate-side-effects");

export async function runCertificateSideEffects(input: {
  certificateId: string;
  sendEmail: boolean;
}): Promise<void> {
  const certificate = await prisma.certificate.findUnique({
    where: { id: input.certificateId },
    select: {
      id: true,
      code: true,
      pdfUrl: true,
      issuedAt: true,
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          name: true,
        },
      },
      course: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });

  if (!certificate) {
    return;
  }

  if (!certificate.pdfUrl) {
    try {
      await storeCertificatePdf(certificate.id);
    } catch (error) {
      log.warn(
        { err: error, certificateId: certificate.id },
        "certificate_pdf_generation_failed",
      );
    }
  }

  if (!input.sendEmail) {
    return;
  }

  const email = certificate.user.email?.trim();
  if (!email) {
    return;
  }

  try {
    await sendCertificateIssuedEmail({
      to: email,
      courseTitle: certificate.course.title,
      certificateCode: certificate.code,
      certificateId: certificate.id,
    });
  } catch (error) {
    log.warn(
      { err: error, certificateId: certificate.id },
      "certificate_email_failed",
    );
  }
}
