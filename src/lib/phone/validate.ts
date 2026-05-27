import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { INVALID_PHONE_MESSAGE } from "@/lib/phone/constants";

export function formatNationalPhoneToE164(
  country: CountryCode,
  nationalNumber: string,
): string | undefined {
  const trimmed = nationalNumber.trim();
  if (!trimmed) return undefined;

  const parsed = parsePhoneNumberFromString(trimmed, country);
  if (!parsed?.isValid()) return undefined;

  return parsed.format("E.164");
}

export function validateOptionalNationalPhone(
  country: CountryCode,
  nationalNumber: string | undefined,
): { ok: true; e164: string | undefined } | { ok: false; error: string } {
  const trimmed = nationalNumber?.trim() ?? "";
  if (!trimmed) {
    return { ok: true, e164: undefined };
  }

  if (!isValidPhoneNumber(trimmed, country)) {
    return { ok: false, error: INVALID_PHONE_MESSAGE };
  }

  const e164 = formatNationalPhoneToE164(country, trimmed);
  if (!e164) {
    return { ok: false, error: INVALID_PHONE_MESSAGE };
  }

  return { ok: true, e164 };
}

export function validateOptionalE164Phone(
  phone: string | undefined,
): { ok: true; e164: string | undefined } | { ok: false; error: string } {
  const trimmed = phone?.trim() ?? "";
  if (!trimmed) {
    return { ok: true, e164: undefined };
  }

  if (!isValidPhoneNumber(trimmed)) {
    return { ok: false, error: INVALID_PHONE_MESSAGE };
  }

  const parsed = parsePhoneNumberFromString(trimmed);
  if (!parsed?.isValid()) {
    return { ok: false, error: INVALID_PHONE_MESSAGE };
  }

  return { ok: true, e164: parsed.format("E.164") };
}
