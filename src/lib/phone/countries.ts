import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";
import {
  DEFAULT_PHONE_COUNTRY,
  PRIORITY_PHONE_COUNTRIES,
} from "@/lib/phone/constants";

export type PhoneCountryOption = {
  value: CountryCode;
  label: string;
  callingCode: string;
};

const regionNames = new Intl.DisplayNames(["es"], { type: "region" });

function getCountryLabel(code: CountryCode): string {
  return regionNames.of(code) ?? code;
}

function toOption(code: CountryCode): PhoneCountryOption {
  return {
    value: code,
    label: getCountryLabel(code),
    callingCode: getCountryCallingCode(code),
  };
}

let cachedOptions: PhoneCountryOption[] | null = null;

export function getPhoneCountryOptions(): PhoneCountryOption[] {
  if (cachedOptions) return cachedOptions;

  const allCountries = getCountries();
  const prioritySet = new Set<string>(PRIORITY_PHONE_COUNTRIES);

  const priority = PRIORITY_PHONE_COUNTRIES.map((code) => toOption(code));

  const rest = allCountries
    .filter((code) => !prioritySet.has(code))
    .map((code) => toOption(code))
    .sort((a, b) => a.label.localeCompare(b.label, "es"));

  cachedOptions = [...priority, ...rest];
  return cachedOptions;
}

export function isCountryCode(value: string): value is CountryCode {
  return getCountries().includes(value as CountryCode);
}

export function getDefaultPhoneCountry(): CountryCode {
  return DEFAULT_PHONE_COUNTRY;
}
