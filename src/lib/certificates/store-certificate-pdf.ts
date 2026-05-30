import "server-only";

import { buildUserDisplayName } from "@/lib/auth/user-profile";
import { generateCertificatePdfBuffer } from "@/lib/certificates/generate-certificate-pdf";
import prisma from "@/lib/db/prisma";
import {
  buildCertificatePdfObjectKey,
  getObjectBuffer,
  putObjectBuffer,
} from "@/lib/storage/r2";

export async function storeCertificatePdf(
  certificateId: string,
): Promise<string | null> {
  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    select: {
      id: true,
      code: true,
      issuedAt: true,
      pdfUrl: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          name: true,
          email: true,
        },
      },
      course: { select: { title: true } },
    },
  });

  if (!certificate) {
    return null;
  }

  if (certificate.pdfUrl) {
    return certificate.pdfUrl;
  }

  const studentName = buildUserDisplayName(certificate.user);
  const pdfBuffer = await generateCertificatePdfBuffer({
    studentName,
    courseTitle: certificate.course.title,
    code: certificate.code,
    issuedAt: certificate.issuedAt,
  });

  const objectKey = buildCertificatePdfObjectKey(certificate.id);
  const { publicUrl } = await putObjectBuffer({
    objectKey,
    body: pdfBuffer,
    contentType: "application/pdf",
  });

  if (publicUrl) {
    await prisma.certificate.update({
      where: { id: certificate.id },
      data: { pdfUrl: publicUrl },
    });
    return publicUrl;
  }

  return null;
}

export async function loadCertificatePdfBuffer(
  certificateId: string,
): Promise<Buffer | null> {
  const stored = await prisma.certificate.findUnique({
    where: { id: certificateId },
    select: {
      id: true,
      code: true,
      issuedAt: true,
      pdfUrl: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          name: true,
          email: true,
        },
      },
      course: { select: { title: true } },
    },
  });

  if (!stored) {
    return null;
  }

  const objectKey = buildCertificatePdfObjectKey(stored.id);
  const fromStorage = await getObjectBuffer(objectKey);
  if (fromStorage) {
    return fromStorage;
  }

  return generateCertificatePdfBuffer({
    studentName: buildUserDisplayName(stored.user),
    courseTitle: stored.course.title,
    code: stored.code,
    issuedAt: stored.issuedAt,
  });
}
