import type { CountryCode } from "libphonenumber-js";

/** Emojipedia slug overrides when English `Intl` name does not match CDN filenames. */
const FLAG_SLUG_NAME_OVERRIDES: Partial<Record<CountryCode, string>> = {
  AG: "antigua-barbuda",
  AX: "aland-islands",
  BA: "bosnia-herzegovina",
  BL: "st-barthelemy",
  CI: "cote-divoire",
  CV: "cape-verde",
  CW: "curacao",
  KN: "st-kitts-nevis",
  MK: "north-macedonia",
  PM: "st-pierre-miquelon",
  RE: "reunion",
  SJ: "svalbard-jan-mayen",
  ST: "sao-tome-principe",
  SZ: "eswatini",
  TC: "turks-caicos-islands",
  TR: "turkey",
  TT: "trinidad-tobago",
  VA: "vatican-city",
  VC: "st-vincent-grenadines",
  WF: "wallis-futuna",
  XK: "kosovo",
};

const englishRegionNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryCodeToRegionalSuffix(code: CountryCode): string {
  return [...code.toUpperCase()]
    .map((char) => (0x1f1e6 + char.charCodeAt(0) - 65).toString(16))
    .join("-");
}

function slugifyCountryName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’.]/g, "")
    .replace(/,/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

/** Builds the Emojipedia CDN slug for an Apple-style country flag PNG. */
export function getCountryFlagEmojiSlug(code: CountryCode): string {
  const suffix = countryCodeToRegionalSuffix(code);
  const override = FLAG_SLUG_NAME_OVERRIDES[code];
  const namePart =
    override ?? slugifyCountryName(englishRegionNames.of(code) ?? code);

  return `flag-${namePart}_${suffix}`;
}
