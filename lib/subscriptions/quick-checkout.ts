"use server";

import {
  approveTransaction,
  initiateTransaction,
  validateTransaction,
  type TransactionResult,
} from "./transactions";
import type { AddonId, PlanId, PlanRole } from "@/components/subscription/plans-data";

/**
 * Single-shot checkout: initiate → auto-approve (sim) → validate.
 * Keeps the audit trail in the DB while the UI stays one-step.
 */
export async function quickCheckout(input: {
  role: PlanRole;
  planId: PlanId;
  addonIds: AddonId[];
  momoNumber: string;
  listingId?: string;
}): Promise<TransactionResult> {
  const initiated = await initiateTransaction(input);
  if (!initiated.success || !initiated.subscriptionId) {
    return { ...initiated, phase: "initiate" };
  }

  const approved = await approveTransaction({
    subscriptionId: initiated.subscriptionId,
    approved: true,
  });
  if (!approved.success) {
    return { ...approved, phase: "approve" };
  }

  const validated = await validateTransaction({
    subscriptionId: initiated.subscriptionId,
  });

  return {
    ...validated,
    phase: "validate",
    subscriptionId: initiated.subscriptionId,
    paymentReference:
      validated.paymentReference || initiated.paymentReference,
  };
}
