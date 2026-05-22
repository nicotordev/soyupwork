import type { EnrollmentStatus, OrderStatus } from "@/generated/prisma/client";

export function isOrderAlreadyPaid(status: OrderStatus): boolean {
  return status === "PAID";
}

export function canTransitionOrderFromPending(status: OrderStatus): boolean {
  return status === "PENDING";
}

export function shouldSkipEnrollmentActivation(
  status: EnrollmentStatus,
): boolean {
  return status === "ACTIVE";
}
