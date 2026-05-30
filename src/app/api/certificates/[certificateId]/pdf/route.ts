import { UserRole } from "@/generated/prisma/client";
import { auth } from "@/auth";
import {
  loadCertificatePdfBuffer,
  storeCertificatePdf,
} from "@/lib/certificates/store-certificate-pdf";
import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ certificateId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { certificateId } = await context.params;

  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    select: {
      id: true,
      code: true,
      pdfUrl: true,
      userId: true,
      course: { select: { title: true } },
      user: { select: { role: true } },
    },
  });

  if (!certificate) {
    return NextResponse.json(
      { error: "Certificado no encontrado." },
      { status: 404 },
    );
  }

  const requester = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const isOwner = certificate.userId === userId;
  const isAdmin = requester?.role === UserRole.ADMIN;

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  if (certificate.pdfUrl) {
    return NextResponse.redirect(certificate.pdfUrl);
  }

  const storedUrl = await storeCertificatePdf(certificate.id);
  if (storedUrl) {
    return NextResponse.redirect(storedUrl);
  }

  const buffer = await loadCertificatePdfBuffer(certificate.id);
  if (!buffer) {
    return NextResponse.json(
      { error: "No se pudo generar el PDF." },
      { status: 500 },
    );
  }

  const filename = `certificado-${certificate.code}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
