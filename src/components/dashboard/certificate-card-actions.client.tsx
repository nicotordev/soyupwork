"use client";

import { CERTIFICATE_COPY } from "@/constants/certificate.constants";
import { buildCertificateVerificationUrl } from "@/lib/certificates/certificate-urls";
import { adminBrutalButtonClass } from "@/lib/admin/styles";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconCopy, IconDownload } from "@tabler/icons-react";
import Link from "next/link";
import { toast as sonnerToast } from "sonner";

type CertificateCardActionsProps = {
  certificateId: string;
  code: string;
};

export function CertificateCardActions({
  certificateId,
  code,
}: CertificateCardActionsProps) {
  const verifyUrl = buildCertificateVerificationUrl(code);
  const pdfUrl = `/api/certificates/${certificateId}/pdf`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      sonnerToast.success(CERTIFICATE_COPY.linkCopied);
    } catch {
      sonnerToast.error("No se pudo copiar el enlace.");
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 min-[400px]:w-auto min-[400px]:flex-row">
      <Button
        asChild
        variant="outline"
        size="sm"
        className={cn(adminBrutalButtonClass, "w-full min-[400px]:w-auto")}
      >
        <Link
          href={pdfUrl}
          className="inline-flex items-center justify-center gap-1 font-mono text-[10px] font-extrabold uppercase"
        >
          <IconDownload className="size-3.5" stroke={2.5} />
          {CERTIFICATE_COPY.downloadPdf}
        </Link>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(adminBrutalButtonClass, "w-full min-[400px]:w-auto")}
        onClick={() => void handleCopyLink()}
      >
        <IconCopy className="size-3.5" stroke={2.5} />
        <span className="font-mono text-[10px] font-extrabold uppercase">
          {CERTIFICATE_COPY.copyVerifyLink}
        </span>
      </Button>
    </div>
  );
}
