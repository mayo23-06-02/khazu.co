"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getAddonById,
  getPlanById,
  type AddonId,
  type PlanId,
  type PlanRole,
} from "@/components/subscription/plans-data";
import {
  isValidMtnMsisdn,
  momoInitiateRequestToPay,
  momoSimulateApproval,
  momoValidatePayment,
  normalizeMomoMsisdn,
} from "./momo";

export type TransactionResult = {
  success: boolean;
  error?: string;
  message?: string;
  subscriptionId?: string;
  paymentReference?: string;
  status?: string;
  totalSzl?: number;
  phase?: "initiate" | "approve" | "validate";
};

export type BillingTransaction = {
  id: string;
  plan_id: string;
  plan_name: string;
  price_szl: number;
  status: string;
  role: string;
  momo_msisdn: string | null;
  payment_reference: string | null;
  payment_metadata: Record<string, unknown> | null;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  total_szl?: number;
};

function missingTableError(msg: string) {
  return (
    msg.includes("schema cache") ||
    msg.includes("Could not find the table") ||
    msg.includes("subscriptions")
  );
}

async function getAuthedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function revalidateBilling() {
  revalidatePath("/dashboard/personal/subscription");
  revalidatePath("/dashboard/dealer/subscription");
  revalidatePath("/dashboard");
}

/**
 * INITIATE
 * Create pending subscription + sponsorships and fire MoMo request-to-pay.
 * Free plans skip MoMo and go straight to trialing on validate.
 */
export async function initiateTransaction(input: {
  role: PlanRole;
  planId: PlanId;
  addonIds: AddonId[];
  momoNumber: string;
}): Promise<TransactionResult> {
  try {
    const { supabase, user } = await getAuthedUser();
    if (!user) return { success: false, error: "Please sign in to checkout." };

    const plan = getPlanById(input.planId);
    if (!plan || plan.role !== input.role) {
      return { success: false, error: "Invalid plan selected." };
    }

    // Trial is automatic — never "buy" the free trial plan
    if (plan.isTrial || plan.id === "individual_trial") {
      return {
        success: false,
        error: "Your free trial starts automatically. Pick a paid plan to schedule after trial.",
      };
    }

    const addons = input.addonIds
      .map((id) => getAddonById(id))
      .filter((a): a is NonNullable<typeof a> => !!a)
      .filter((a) => !a.dealerOnly || input.role === "dealer");

    const addonsTotal = addons.reduce((s, a) => s + a.priceSzl, 0);
    const total = plan.priceSzl + addonsTotal;
    const isFree = total === 0;
    const msisdn = normalizeMomoMsisdn(input.momoNumber || "");

    const { data: profile } = await supabase
      .from("profiles")
      .select("trial_ends_at, trial_started_at")
      .eq("id", user.id)
      .maybeSingle();

    const trialEndsAt = profile?.trial_ends_at as string | null | undefined;
    const inTrial =
      !!trialEndsAt && new Date(trialEndsAt).getTime() > Date.now();
    /** Paid plan during trial → charge only after trial ends */
    const deferred = inTrial && total > 0;

    if (!isFree && !isValidMtnMsisdn(msisdn)) {
      return {
        success: false,
        error: "Enter a valid MTN MoMo number (76/77/78 or 2687…). Saved for when trial ends.",
      };
    }

    let paymentReference: string | null = null;
    let momoMeta: unknown = null;

    // Only charge MoMo now if not on free trial
    if (!isFree && !deferred) {
      const momo = await momoInitiateRequestToPay({
        msisdn,
        amountSzl: total,
        externalId: `${user.id.slice(0, 8)}-${plan.id}`,
        description: `Khazu ${plan.name}${addons.length ? ` + ${addons.length} add-on(s)` : ""}`,
      });
      paymentReference = momo.reference;
      momoMeta = momo.raw;

      if (!momo.ok || momo.status === "FAILED") {
        return {
          success: false,
          error: "Could not initiate MoMo request. Check your number.",
          paymentReference: momo.reference,
          phase: "initiate",
        };
      }
    } else if (deferred) {
      paymentReference = `SCHED-${Date.now().toString(36).toUpperCase()}`;
      momoMeta = {
        simulated: true,
        deferred: true,
        charge_after: trialEndsAt,
      };
    }

    const { data: sub, error: subError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        role: input.role,
        plan_id: plan.id,
        plan_name: plan.name,
        price_szl: plan.priceSzl,
        billing_period_days: plan.periodDays,
        listing_limit: plan.listingLimit,
        included_sponsorships: plan.includedSponsorships,
        status: "pending",
        starts_at: deferred ? trialEndsAt : null,
        ends_at: null,
        momo_msisdn: isFree ? null : msisdn,
        payment_provider: isFree ? "promo" : "mtn_momo",
        payment_reference: paymentReference,
        payment_metadata: {
          phase: "initiated",
          total,
          addons: addons.map((a) => ({
            id: a.id,
            name: a.name,
            price: a.priceSzl,
            days: a.durationDays,
          })),
          momo: momoMeta,
          is_free: isFree,
          deferred,
          charge_after: deferred ? trialEndsAt : null,
          initiated_at: new Date().toISOString(),
        },
      })
      .select("id")
      .single();

    if (subError) {
      return {
        success: false,
        error: missingTableError(subError.message)
          ? "Billing tables missing. Run supabase/subscriptions.sql."
          : subError.message,
        phase: "initiate",
      };
    }

    for (const addon of addons) {
      await supabase.from("sponsorships").insert({
        user_id: user.id,
        subscription_id: sub.id,
        sponsorship_type: addon.id,
        label: addon.name,
        price_szl: addon.priceSzl,
        duration_days: addon.durationDays,
        status: "pending",
        momo_msisdn: isFree ? null : msisdn,
        payment_reference: paymentReference,
        payment_metadata: {
          plan_id: plan.id,
          deferred,
          charge_after: deferred ? trialEndsAt : null,
        },
      });
    }

    revalidateBilling();

    const trialEndLabel = trialEndsAt
      ? new Date(trialEndsAt).toLocaleDateString()
      : "";

    return {
      success: true,
      phase: "initiate",
      subscriptionId: sub.id,
      paymentReference: paymentReference ?? undefined,
      totalSzl: total,
      status: "pending",
      message: deferred
        ? `Plan reserved. Your free trial continues until ${trialEndLabel}. First MoMo charge runs after trial ends.`
        : isFree
          ? "Free trial ready. Confirm to activate."
          : "MoMo prompt sent. Confirm payment to finish.",
    };
  } catch (err) {
    console.error("initiateTransaction:", err);
    return {
      success: false,
      phase: "initiate",
      error: err instanceof Error ? err.message : "Initiate failed",
    };
  }
}

/**
 * APPROVE
 * Records that the payer approved (or declined) the MoMo prompt.
 */
export async function approveTransaction(input: {
  subscriptionId: string;
  approved: boolean;
}): Promise<TransactionResult> {
  try {
    const { supabase, user } = await getAuthedUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: sub, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", input.subscriptionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !sub) {
      return { success: false, error: "Transaction not found.", phase: "approve" };
    }

    if (sub.status !== "pending") {
      return {
        success: false,
        error: `Cannot approve a transaction with status “${sub.status}”.`,
        phase: "approve",
        status: sub.status,
      };
    }

    const meta = (sub.payment_metadata || {}) as Record<string, unknown>;
    const isFree = Boolean(meta.is_free) || Number(sub.price_szl) === 0;
    const deferred = Boolean(meta.deferred);

    if (isFree || deferred) {
      await supabase
        .from("subscriptions")
        .update({
          payment_metadata: {
            ...meta,
            phase: "approved",
            approved_at: new Date().toISOString(),
            free_confirmed: isFree,
            deferred_confirmed: deferred,
          },
        })
        .eq("id", sub.id);

      return {
        success: true,
        phase: "approve",
        subscriptionId: sub.id,
        status: "pending",
        message: deferred
          ? "Confirmed. Scheduling paid plan after your free trial…"
          : "Confirmed. Activating…",
      };
    }

    const ref = sub.payment_reference as string;
    const momo = await momoSimulateApproval({
      reference: ref,
      approve: input.approved,
    });

    if (!input.approved || !momo.ok) {
      await supabase
        .from("subscriptions")
        .update({
          status: "failed",
          payment_metadata: {
            ...meta,
            phase: "declined",
            declined_at: new Date().toISOString(),
            momo_approve: momo.raw,
          },
        })
        .eq("id", sub.id);

      await supabase
        .from("sponsorships")
        .update({ status: "failed" })
        .eq("subscription_id", sub.id);

      revalidateBilling();

      return {
        success: false,
        phase: "approve",
        subscriptionId: sub.id,
        paymentReference: ref,
        status: "failed",
        error: "Payment was declined or cancelled on the MoMo prompt.",
      };
    }

    await supabase
      .from("subscriptions")
      .update({
        payment_metadata: {
          ...meta,
          phase: "approved",
          approved_at: new Date().toISOString(),
          momo_approve: momo.raw,
        },
      })
      .eq("id", sub.id);

    revalidateBilling();

    return {
      success: true,
      phase: "approve",
      subscriptionId: sub.id,
      paymentReference: ref,
      status: "pending",
      message: "Approval recorded. Validating payment with MTN…",
    };
  } catch (err) {
    console.error("approveTransaction:", err);
    return {
      success: false,
      phase: "approve",
      error: err instanceof Error ? err.message : "Approve failed",
    };
  }
}

/**
 * VALIDATE
 * Poll MoMo for final status; activate subscription + sponsorships on success.
 */
export async function validateTransaction(input: {
  subscriptionId: string;
}): Promise<TransactionResult> {
  try {
    const { supabase, user } = await getAuthedUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: sub, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", input.subscriptionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !sub) {
      return { success: false, error: "Transaction not found.", phase: "validate" };
    }

    if (sub.status === "active" || sub.status === "trialing") {
      return {
        success: true,
        phase: "validate",
        subscriptionId: sub.id,
        status: sub.status,
        message: "Already active.",
        paymentReference: sub.payment_reference ?? undefined,
      };
    }

    if (sub.status === "failed" || sub.status === "cancelled") {
      return {
        success: false,
        phase: "validate",
        status: sub.status,
        error: "This transaction cannot be validated.",
      };
    }

    const meta = (sub.payment_metadata || {}) as Record<string, unknown>;
    const isFree = Boolean(meta.is_free);
    const deferred = Boolean(meta.deferred);
    const chargeAfter =
      typeof meta.charge_after === "string" ? meta.charge_after : null;

    let finalStatus: "active" | "trialing" | "failed" | "pending" = "active";
    let momoValidate: unknown = null;

    if (deferred) {
      // Reserve plan — charge after trial. Keep subscription pending until then.
      finalStatus = "pending";
      const chargeDate = chargeAfter
        ? new Date(chargeAfter)
        : new Date(Date.now() + 7 * 86400000);
      const paidEnds = new Date(chargeDate);
      paidEnds.setDate(paidEnds.getDate() + (sub.billing_period_days || 30));

      await supabase
        .from("subscriptions")
        .update({
          status: "pending",
          starts_at: chargeDate.toISOString(),
          ends_at: paidEnds.toISOString(),
          payment_metadata: {
            ...meta,
            phase: "scheduled",
            validated_at: new Date().toISOString(),
            charge_after: chargeDate.toISOString(),
          },
        })
        .eq("id", sub.id);

      await supabase
        .from("profiles")
        .update({
          scheduled_plan_id: sub.plan_id,
          scheduled_charge_at: chargeDate.toISOString(),
          momo_msisdn: sub.momo_msisdn,
          // Keep trial listing limit until trial ends
        })
        .eq("id", user.id);

      revalidateBilling();

      return {
        success: true,
        phase: "validate",
        subscriptionId: sub.id,
        paymentReference: sub.payment_reference ?? undefined,
        status: "pending",
        message: `You’re still on free trial. ${sub.plan_name} starts ${chargeDate.toLocaleDateString()} — MoMo will be charged then (E${Number(meta.total ?? sub.price_szl)}).`,
      };
    }

    if (!isFree) {
      if (meta.phase !== "approved") {
        return {
          success: false,
          phase: "validate",
          error: "Approve the MoMo prompt before validating.",
        };
      }

      const momo = await momoValidatePayment({
        reference: sub.payment_reference as string,
      });
      momoValidate = momo.raw;

      if (momo.status === "PENDING") {
        await supabase
          .from("subscriptions")
          .update({
            payment_metadata: {
              ...meta,
              phase: "validating",
              momo_validate: momoValidate,
            },
          })
          .eq("id", sub.id);

        revalidateBilling();

        return {
          success: false,
          phase: "validate",
          subscriptionId: sub.id,
          paymentReference: sub.payment_reference ?? undefined,
          status: "pending",
          error:
            "Still waiting for you to approve the MoMo prompt on your phone. Check back in a minute.",
        };
      }

      if (!momo.ok || momo.status !== "SUCCESSFUL") {
        await supabase
          .from("subscriptions")
          .update({
            status: "failed",
            payment_metadata: {
              ...meta,
              phase: "validated_failed",
              momo_validate: momoValidate,
            },
          })
          .eq("id", sub.id);
        await supabase
          .from("sponsorships")
          .update({ status: "failed" })
          .eq("subscription_id", sub.id);

        revalidateBilling();

        return {
          success: false,
          phase: "validate",
          subscriptionId: sub.id,
          paymentReference: sub.payment_reference ?? undefined,
          status: "failed",
          error: "Payment could not be confirmed with MTN MoMo.",
        };
      }
      finalStatus = "active";
    } else {
      finalStatus = "trialing";
    }

    const now = new Date();
    const ends = new Date(now);
    ends.setDate(ends.getDate() + (sub.billing_period_days || 30));

    await supabase
      .from("subscriptions")
      .update({
        status: finalStatus,
        starts_at: now.toISOString(),
        ends_at: ends.toISOString(),
        payment_metadata: {
          ...meta,
          phase: "validated",
          validated_at: now.toISOString(),
          momo_validate: momoValidate,
        },
      })
      .eq("id", sub.id);

    const { data: sponsorships } = await supabase
      .from("sponsorships")
      .select("id, duration_days")
      .eq("subscription_id", sub.id)
      .eq("status", "pending");

    for (const sp of sponsorships || []) {
      const sEnd = new Date(now);
      sEnd.setDate(sEnd.getDate() + (sp.duration_days || 7));
      await supabase
        .from("sponsorships")
        .update({
          status: "active",
          starts_at: now.toISOString(),
          ends_at: sEnd.toISOString(),
        })
        .eq("id", sp.id);
    }

    await supabase
      .from("profiles")
      .update({
        subscription_plan_id: sub.plan_id,
        subscription_ends_at: ends.toISOString(),
        listing_limit: sub.listing_limit,
        scheduled_plan_id: null,
        scheduled_charge_at: null,
      })
      .eq("id", user.id);

    revalidateBilling();

    return {
      success: true,
      phase: "validate",
      subscriptionId: sub.id,
      paymentReference: sub.payment_reference ?? undefined,
      status: finalStatus,
      message:
        finalStatus === "trialing"
          ? `Free trial active until ${ends.toLocaleDateString()}.`
          : `Payment validated. ${sub.plan_name} is active until ${ends.toLocaleDateString()}.`,
    };
  } catch (err) {
    console.error("validateTransaction:", err);
    return {
      success: false,
      phase: "validate",
      error: err instanceof Error ? err.message : "Validate failed",
    };
  }
}

export async function getTransaction(
  subscriptionId: string,
): Promise<BillingTransaction | null> {
  const { supabase, user } = await getAuthedUser();
  if (!user) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select(
      "id, plan_id, plan_name, price_szl, status, role, momo_msisdn, payment_reference, payment_metadata, starts_at, ends_at, created_at",
    )
    .eq("id", subscriptionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return null;
  const meta = (data.payment_metadata || {}) as { total?: number };
  return {
    ...data,
    total_szl: meta.total ?? Number(data.price_szl),
  } as BillingTransaction;
}

export async function listBillingTransactions(): Promise<BillingTransaction[]> {
  const { supabase, user } = await getAuthedUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      "id, plan_id, plan_name, price_szl, status, role, momo_msisdn, payment_reference, payment_metadata, starts_at, ends_at, created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("listBillingTransactions:", error.message);
    return [];
  }

  return (data || []).map((row) => {
    const meta = (row.payment_metadata || {}) as { total?: number };
    return {
      ...row,
      total_szl: meta.total ?? Number(row.price_szl),
    } as BillingTransaction;
  });
}
