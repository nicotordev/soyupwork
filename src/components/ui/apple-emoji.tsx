"use client";

import type { AppleEmojiFile } from "@/constants/apple-emojis.constants";
import { appleEmojiSrc } from "@/lib/emojis/apple-emoji";
import { cn } from "@/lib/utils";
import Image from "next/image";

type AppleEmojiProps = {
  file: AppleEmojiFile;
  size?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
};

export function AppleEmoji({
  file,
  size = 72,
  className,
  alt = "",
  priority = false,
}: AppleEmojiProps) {
  return (
    <Image
      src={appleEmojiSrc(file)}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={cn("inline-block h-auto w-auto object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}
