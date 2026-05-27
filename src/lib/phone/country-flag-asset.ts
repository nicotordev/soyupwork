import type { CountryCode } from "libphonenumber-js";

export const PHONE_COUNTRY_FLAG_DIR = "/emojis/apple/flags" as const;

export type PhoneCountryFlagFile = `${CountryCode}.png`;

export function phoneCountryFlagSrc(code: CountryCode): string {
  return `${PHONE_COUNTRY_FLAG_DIR}/${code}.png`;
}

export function toPhoneCountryFlagFile(
  code: CountryCode,
): PhoneCountryFlagFile {
  return `${code}.png`;
}
