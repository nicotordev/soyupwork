export type LegalTocItem = {
  id: string;
  label: string;
};

export type LegalCalloutVariant = "info" | "warning" | "caution" | "highlight";

export type LegalContentBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: readonly string[] }
  | { type: "ol"; items: readonly string[] }
  | {
      type: "callout";
      variant: LegalCalloutVariant;
      title: string;
      body: string;
    }
  | { type: "quote"; text: string }
  | {
      type: "meta";
      items: readonly { label: string; value: string }[];
    };

export type LegalSection = {
  id: string;
  title: string;
  blocks: readonly LegalContentBlock[];
};

export type LegalFooterLink = {
  title: string;
  href: string;
};
