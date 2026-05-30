import { CERTIFICATE_COPY } from "@/constants/certificate.constants";
import { adminBrutalButtonClass, adminPanelClass } from "@/lib/admin/styles";
import { buildUserDisplayName } from "@/lib/auth/user-profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconAward, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import Link from "next/link";

export type CertificateVerifyRecord = {
  code: string;
  issuedAt: Date;
  revokedAt: Date | null;
  user: {
    firstName: string | null;
    lastName: string | null;
    name: string | null;
  };
  course: {
    title: string;
    slug: string;
  };
};

type CertificateVerifyViewProps = {
  certificate: CertificateVerifyRecord | null;
};

export function CertificateVerifyView({
  certificate,
}: CertificateVerifyViewProps) {
  const isRevoked = Boolean(certificate?.revokedAt);
  const isValid = Boolean(certificate) && !isRevoked;

  const title = !certificate
    ? CERTIFICATE_COPY.verifyNotFoundTitle
    : isRevoked
      ? CERTIFICATE_COPY.verifyRevokedTitle
      : CERTIFICATE_COPY.verifyValidTitle;

  const description = !certificate
    ? CERTIFICATE_COPY.verifyNotFoundDescription
    : isRevoked
      ? CERTIFICATE_COPY.verifyRevokedDescription
      : CERTIFICATE_COPY.verifyValidDescription;

  const Icon = isValid ? IconCircleCheck : IconCircleX;
  const iconClass = isValid ? "text-emerald-600" : "text-destructive";

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <div
        className={cn(
          adminPanelClass,
          "border-2 border-foreground bg-card p-6 sm:p-8 shadow-[6px_6px_0px_0px_var(--foreground)]",
        )}
      >
        <div className="mb-6 flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-amber-500/10 shadow-[2px_2px_0px_0px_var(--foreground)]">
            <IconAward className="size-6 text-amber-600" stroke={2.5} />
          </div>
          <div className="space-y-1">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              {CERTIFICATE_COPY.verifyPageTitle}
            </p>
            <h1 className="font-heading text-2xl font-extrabold text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2 rounded-lg border-2 border-foreground bg-muted/20 px-3 py-2">
          <Icon className={cn("size-5 shrink-0", iconClass)} stroke={2.5} />
          <p className="font-mono text-[11px] font-bold uppercase tracking-wide">
            {isValid ? "Verificación exitosa" : "No verificable"}
          </p>
        </div>

        {certificate && isValid ? (
          <dl className="space-y-4 border-t-2 border-foreground/10 pt-4">
            <div>
              <dt className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                {CERTIFICATE_COPY.holderLabel}
              </dt>
              <dd className="mt-1 text-lg font-extrabold text-foreground">
                {buildUserDisplayName(certificate.user)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                {CERTIFICATE_COPY.courseLabel}
              </dt>
              <dd className="mt-1 text-base font-semibold text-foreground">
                {certificate.course.title}
              </dd>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                  {CERTIFICATE_COPY.issuedLabel}
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {certificate.issuedAt.toLocaleDateString("es", {
                    dateStyle: "long",
                  })}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                  {CERTIFICATE_COPY.codeLabel}
                </dt>
                <dd className="mt-1 font-mono text-sm font-bold">
                  {certificate.code}
                </dd>
              </div>
            </div>
          </dl>
        ) : certificate ? (
          <p className="font-mono text-sm font-semibold text-muted-foreground">
            Código consultado: {certificate.code}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-2">
          {certificate && isValid ? (
            <Button asChild className={adminBrutalButtonClass}>
              <Link href={`/courses/${certificate.course.slug}`}>
                {CERTIFICATE_COPY.viewCourseCta}
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="outline" className={adminBrutalButtonClass}>
            <Link href="/dashboard/certificates">
              {CERTIFICATE_COPY.dashboardCta}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
