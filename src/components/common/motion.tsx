"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ElementType, ReactNode } from "react";

type MotionAs = "div" | "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type MotionComponentProps<T extends MotionAs = "div"> = {
  as?: T;
} & HTMLMotionProps<T>;

export function Motion<T extends MotionAs = "div">({
  children,
  as = "div" as T,
  ...props
}: MotionComponentProps<T>) {
  const Component = motion[as] as ElementType;
  return <Component {...props}>{children}</Component>;
}
