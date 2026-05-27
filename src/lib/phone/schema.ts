import { z } from "zod";
import { getCountries, type CountryCode } from "libphonenumber-js";

const countryCodes = getCountries() as [CountryCode, ...CountryCode[]];

export const phoneCountrySchema = z.enum(countryCodes);
