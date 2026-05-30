"use client";

import type {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { CountryFlagEmoji } from "@/components/platform/country-flag-emoji";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getPhoneCountryOptions } from "@/lib/phone/countries";
import type { CountryCode } from "libphonenumber-js";

const phoneInputClassName =
  "border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]";

const countryOptions = getPhoneCountryOptions();
const priorityCount = 20;
const priorityOptions = countryOptions.slice(0, priorityCount);
const otherOptions = countryOptions.slice(priorityCount);

const nativeSelectClassName = cn(
  "h-7 w-[5.25rem] min-w-0 shrink-0 cursor-pointer appearance-none truncate rounded-md border border-input bg-input/20 py-0.5 pr-6 pl-8 text-xs font-mono text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
  phoneInputClassName,
);

type PhoneFieldValues = FieldValues & {
  phoneCountry: CountryCode;
  phoneNational?: string;
};

type PhoneInputFieldProps<T extends PhoneFieldValues> = {
  id: string;
  label: string;
  optional?: boolean;
  disabled?: boolean;
  control: Control<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
};

function CountryOptions({ options }: { options: typeof countryOptions }) {
  return (
    <>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label} (+{option.callingCode})
        </option>
      ))}
    </>
  );
}

export function PhoneInputField<T extends PhoneFieldValues>({
  id,
  label,
  optional = false,
  disabled = false,
  control,
  register,
  errors,
}: PhoneInputFieldProps<T>) {
  const nationalId = `${id}-national`;
  const countryId = `${id}-country`;

  return (
    <div className="space-y-2">
      <Label htmlFor={nationalId}>
        {label}
        {optional ? (
          <span className="font-normal text-muted-foreground"> (opcional)</span>
        ) : null}
      </Label>

      <div className="flex items-center min-w-0 gap-2">
        <Controller
          name={"phoneCountry" as Path<T>}
          control={control}
          render={({ field }) => (
            <div className="flex relative shrink-0 h-full">
              <CountryFlagEmoji
                country={field.value as CountryCode}
                size={16}
                alt=""
                className="pointer-events-none absolute top-1/2 left-2 z-10 -translate-y-1/2"
              />
              <select
                id={countryId}
                aria-label="País del teléfono"
                value={field.value}
                disabled={disabled}
                onChange={(event) =>
                  field.onChange(event.target.value as CountryCode)
                }
                onBlur={field.onBlur}
                ref={field.ref}
                className={nativeSelectClassName}
              >
                <optgroup label="Países frecuentes">
                  <CountryOptions options={priorityOptions} />
                </optgroup>
                <optgroup label="Todos los países">
                  <CountryOptions options={otherOptions} />
                </optgroup>
              </select>
              <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
              >
                ▾
              </span>
            </div>
          )}
        />

        <Input
          id={nationalId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="55 1234 5678"
          disabled={disabled}
          aria-invalid={!!errors?.phoneNational}
          className={cn("min-w-0 flex-1", phoneInputClassName)}
          {...register("phoneNational" as Path<T>)}
        />
      </div>

      {errors?.phoneNational ? (
        <p className="text-xs font-medium text-red-500">
          {String(errors.phoneNational.message)}
        </p>
      ) : null}
    </div>
  );
}
