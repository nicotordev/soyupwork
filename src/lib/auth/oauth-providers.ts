import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";

export const OAUTH_LINK_PROVIDERS = ["google", "github"] as const;

export type OAuthLinkProvider = (typeof OAUTH_LINK_PROVIDERS)[number];

type OAuthProviderMeta = {
  id: OAuthLinkProvider;
  label: string;
  Icon: TablerIcon;
};

const OAUTH_PROVIDER_META: Record<OAuthLinkProvider, OAuthProviderMeta> = {
  google: {
    id: "google",
    label: "Google",
    Icon: IconBrandGoogle,
  },
  github: {
    id: "github",
    label: "GitHub",
    Icon: IconBrandGithub,
  },
};

export function isOAuthLinkProvider(
  value: string | null | undefined,
): value is OAuthLinkProvider {
  return (
    value !== null &&
    value !== undefined &&
    OAUTH_LINK_PROVIDERS.includes(value as OAuthLinkProvider)
  );
}

export function getOAuthProviderMeta(
  provider: OAuthLinkProvider,
): OAuthProviderMeta {
  return OAUTH_PROVIDER_META[provider];
}
