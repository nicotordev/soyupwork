import type { Metadata } from "next";
import { CertificateVerifyView } from "@/components/certificates/certificate-verify-view";
import { CERTIFICATE_COPY } from "@/constants/certificate.constants";
import prisma from "@/lib/db/prisma";

type PageProps = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { code } = await params;

  return {
    title: `${CERTIFICATE_COPY.verifyPageTitle} · ${code}`,
    description: CERTIFICATE_COPY.verifyValidDescription,
    robots: { index: false, follow: false },
  };
}

export default async function CertificateVerifyPage({ params }: PageProps) {
  const { code } = await params;
  const normalizedCode = decodeURIComponent(code).trim();

  const certificate = await prisma.certificate.findUnique({
    where: { code: normalizedCode },
    select: {
      code: true,
      issuedAt: true,
      revokedAt: true,
      user: {
        select: {
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

  return <CertificateVerifyView certificate={certificate} />;
}
