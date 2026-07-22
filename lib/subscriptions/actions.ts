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

export type CheckoutResult = {
  success: boolean;
  error?: string;
  subscriptionId?: string;
  paymentReference?: string;
  message?: string;
};

/**
 * Simulate MTN MoMo collection request.
 * Replace body with real MTN MoMo Collections API / local Eswatini gateway.
 *
 * Real integration outline:
 * 1. POST to MoMo Collections /requesttopay with amount, currency SZL, payer msisdn
 * 2. Poll GET /requesttopay/{referenceId} until SUCCESSFUL | FAILED
 * 3. Webhook updates subscription status
 */
async function requestMtnMomoPayment(input: {
  msisdn: string;
  amountSzl: number;
  externalId: string;
  description: string;
}): Promise<{
  ok: boolean;
  reference: string;
  status: "SUCCESSFUL" | "PENDING" | "FAILED";
  raw?: unknown;
}> {
  const reference = `MOMO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // ── REAL API HOOK ──────────────────────────────────────────────────────────
  // const momoBase = process.env.MTN_MOMO_API_BASE;
  // const subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY;
  // const accessToken = await getMomoAccessToken();
  // await fetch(`${momoBase}/collection/v1_0/requesttopay`, {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //     "X-Reference-Id": reference,
  //     "X-Target-Environment": process.env.MTN_MOMO_ENV || "sandbox",
  //     "Ocp-Apim-Subscription-Key": subscriptionKey!,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     amount: String(input.amountSzl),
  //     currency: "SZL",
  //     externalId: input.externalId,
  //     payer: { partyIdType: "MSISDN", partyId: input.msisdn },
  //     payerMessage: input.description.slice(0, 100),
  //     payeeNote: "Khazu subscription",
  //   }),
  // });
  // ──────────────────────────────────────────────────────────────────────────

  // Simulated prompt success (dev)
  await new Promise((r) => setTimeout(r, 1200));

  if (!/^(\+?268)?7[6-8]\d{6}$/.test(input.msisdn.replace(/\s/g, ""))) {
    return { ok: false, reference, status: "FAILED" };
  }

  return {
    ok: true,
    reference,
    status: "SUCCESSFUL",
    raw: {
      simulated: true,
      amount: input.amountSzl,
      msisdn: input.msisdn,
      description: input.description,
    },
  };
}

function normalizeMomoMsisdn(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("268") && digits.length === 11) return digits;
  if (digits.length === 8 && digits.startsWith("7")) return `268${digits}`;
  return digits;
}

export async function checkoutSubscription(input: {
  role: PlanRole;
  planId: PlanId;
  addonIds: AddonId[];
  momoNumber: string;
}): Promise<CheckoutResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please sign in to subscribe." };
    }

    const plan = getPlanById(input.planId);
    if (!plan || plan.role !== input.role) {
      return { success: false, error: "Invalid plan selected." };
    }

    const addons = input.addonIds
      .map((id) => getAddonById(id))
      .filter((a): a is NonNullable<typeof a> => !!a)
      .filter((a) => !a.dealerOnly || input.role === "dealer");

    // Mutual exclusivity for listing boost durations — keep both if user selected both
    const addonsTotal = addons.reduce((s, a) => s + a.priceSzl, 0);
    const total = plan.priceSzl + addonsTotal;

    const msisdn = normalizeMomoMsisdn(input.momoNumber);
    if (total > 0 && !msisdn) {
      return { success: false, error: "Enter a valid MTN MoMo number." };
    }
    if (
      total > 0 &&
      !/^2687[6-8]\d{6}$/.test(msisdn) &&
      !/^7[6-8]\d{6}$/.test(msisdn)
    ) {
      return {
        success: false,
        error: "Use a valid MTN Eswatini number (e.g. 76XXXXXX or 26876XXXXXX).",
      };
    }

    const now = new Date();
    const ends = new Date(now);
    ends.setDate(ends.getDate() + plan.periodDays);

    const isFree = total === 0;
    let paymentReference: string | null = null;
    let paymentStatus: "active" | "trialing" | "failed" | "pending" = isFree
      ? "trialing"
      : "pending";

    if (!isFree) {
      const momo = await requestMtnMomoPayment({
        msisdn: msisdn.startsWith("268") ? msisdn : `268${msisdn}`,
        amountSzl: total,
        externalId: `${user.id.slice(0, 8)}-${plan.id}`,
        description: `Khazu ${plan.name} + ${addons.length} add-on(s)`,
      });

      paymentReference = momo.reference;

      if (!momo.ok || momo.status === "FAILED") {
        // Persist failed attempt for support
        await supabase.from("subscriptions").insert({
          user_id: user.id,
          role: input.role,
          plan_id: plan.id,
          plan_name: plan.name,
          price_szl: plan.priceSzl,
          billing_period_days: plan.periodDays,
          listing_limit: plan.listingLimit,
          included_sponsorships: plan.includedSponsorships,
          status: "failed",
          momo_msisdn: msisdn,
          payment_provider: "mtn_momo",
          payment_reference: paymentReference,
          payment_metadata: { total, addons: addons.map((a) => a.id), momo },
        });

        return {
          success: false,
          error:
            "MoMo payment failed or was cancelled. Check your number and try again.",
          paymentReference: paymentReference ?? undefined,
        };
      }

      paymentStatus = "active";
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
        status: paymentStatus,
        starts_at: now.toISOString(),
        ends_at: ends.toISOString(),
        momo_msisdn: msisdn || null,
        payment_provider: isFree ? "promo" : "mtn_momo",
        payment_reference: paymentReference,
        payment_metadata: {
          total,
          addons: addons.map((a) => ({
            id: a.id,
            price: a.priceSzl,
            days: a.durationDays,
          })),
          simulated: !isFree,
        },
      })
      .select("id")
      .single();

    if (subError) {
      const missing =
        subError.message.includes("schema cache") ||
        subError.message.includes("Could not find the table");
      return {
        success: false,
        error: missing
          ? "Subscriptions table missing. Run supabase/subscriptions.sql in the SQL Editor."
          : subError.message,
      };
    }

    // Sponsorship rows
    for (const addon of addons) {
      const sEnd = new Date(now);
      sEnd.setDate(sEnd.getDate() + addon.durationDays);
      await supabase.from("sponsorships").insert({
        user_id: user.id,
        subscription_id: sub.id,
        sponsorship_type: addon.id,
        label: addon.name,
        price_szl: addon.priceSzl,
        duration_days: addon.durationDays,
        status: paymentStatus === "failed" ? "failed" : "active",
        starts_at: now.toISOString(),
        ends_at: sEnd.toISOString(),
        momo_msisdn: msisdn || null,
        payment_reference: paymentReference,
        payment_metadata: { plan_id: plan.id },
      });
    }

    // Mirror on profile for quick limits
    await supabase
      .from("profiles")
      .update({
        subscription_plan_id: plan.id,
        subscription_ends_at: ends.toISOString(),
        listing_limit: plan.listingLimit,
      })
      .eq("id", user.id);

    revalidatePath("/dashboard");
    revalidatePath("/pricing");
    revalidatePath("/dashboard/dealer/subscription");
    revalidatePath("/dashboard/personal");

    return {
      success: true,
      subscriptionId: sub.id,
      paymentReference: paymentReference ?? undefined,
      message: isFree
        ? "Free trial activated. You can list 1 car for 7 days."
        : `Payment successful. ${plan.name} is active until ${ends.toLocaleDateString()}. Check your phone for the MoMo confirmation.`,
    };
  } catch (err) {
    console.error("checkoutSubscription:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Checkout failed",
    };
  }
}
