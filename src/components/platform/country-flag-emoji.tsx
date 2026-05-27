"use client";

import Image from "next/image";
import { phoneCountryFlagSrc } from "@/lib/phone/country-flag-asset";
import { cn } from "@/lib/utils";
import type { CountryCode } from "libphonenumber-js";

type CountryFlagEmojiProps = {
  country: CountryCode;
  size?: number;
  className?: string;
  alt?: string;
};

export function CountryFlagEmoji({
  country,
  size = 20,
  className,
  alt = "",
}: CountryFlagEmojiProps) {
  return (
    <Image
      src={phoneCountryFlagSrc(country)}
      alt={alt}
      width={size}
      height={size}
      className={cn("inline-block shrink-0 object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}
