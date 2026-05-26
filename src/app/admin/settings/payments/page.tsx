import { getPaymentsSettingsFormValues } from "@/app/actions/settings.actions";
import { AdminSettingsSubPage } from "@/components/admin/settings/admin-settings-sub-page";
import { PaymentsSettingsForm } from "@/components/admin/settings/payments-settings-form";
import { ADMIN_SETTINGS_PAYMENTS_PAGE } from "@/constants/settings.constants";
import { IconBrandStripe } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagos",
  description: "Moneda, checkout y reembolsos con Stripe.",
};

export default async function AdminPaymentsSettingsPage() {
  const initialValues = await getPaymentsSettingsFormValues();

  return (
    <AdminSettingsSubPage
      eyebrow={ADMIN_SETTINGS_PAYMENTS_PAGE.eyebrow}
      title={ADMIN_SETTINGS_PAYMENTS_PAGE.title}
      description={ADMIN_SETTINGS_PAYMENTS_PAGE.description}
      icon={<IconBrandStripe className="size-4 text-primary" stroke={2.5} />}
    >
      <PaymentsSettingsForm initialValues={initialValues} />
    </AdminSettingsSubPage>
  );
}
