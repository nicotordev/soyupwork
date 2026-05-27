import type { CountryCode } from "libphonenumber-js";

/** Default country for phone inputs (LATAM-first product). */
export const DEFAULT_PHONE_COUNTRY: CountryCode = "MX";

/** Shown first in the country dropdown. */
export const PRIORITY_PHONE_COUNTRIES = [
  "MX",
  "AR",
  "CO",
  "CL",
  "PE",
  "EC",
  "VE",
  "BO",
  "PY",
  "UY",
  "CR",
  "PA",
  "DO",
  "GT",
  "HN",
  "NI",
  "SV",
  "BR",
  "US",
  "ES",
] as const satisfies readonly CountryCode[];

export const INVALID_PHONE_MESSAGE =
  "Ingresa un número de teléfono válido para el país seleccionado.";
