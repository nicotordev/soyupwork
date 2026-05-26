import {
  resolveCategoryIcon,
  type CategoryIconName,
} from "@/constants/category-icons.constants";
import { cn } from "@/lib/utils";
import { IconCategory } from "@tabler/icons-react";

type CategoryIconProps = {
  icon: string | null;
  className?: string;
  iconClassName?: string;
  fallback?: boolean;
};

export function CategoryIcon({
  icon,
  className,
  iconClassName,
  fallback = true,
}: CategoryIconProps) {
  const ResolvedIcon = resolveCategoryIcon(icon);

  if (!ResolvedIcon) {
    if (!fallback) return null;
    return (
      <IconCategory
        className={cn("size-4 text-muted-foreground", iconClassName, className)}
        stroke={2.25}
        aria-hidden
      />
    );
  }

  return (
    <ResolvedIcon
      className={cn("size-4 text-primary", iconClassName, className)}
      stroke={2.25}
      aria-hidden
    />
  );
}

export type { CategoryIconName };
