"use server";

import { createClient } from "@/lib/supabase/server";
import { ensureUserTrial, isTrialActive, trialListingLimitForRole } from "./trial";
import type { PlanRole } from "@/components/subscription/plans-data";
import { getPlanById, type PlanId } from "@/components/subscription/plans-data";

export type ListingEntitlement = {
  canPost: boolean;
  requiresPayment: boolean;
  reason: string;
  isTrialActive: boolean;
  trialEndsAt: string | null;
  listingsUsed: number;
  listingLimit: number;
  /** True when the active plan has no listing cap — ignore `listingLimit`'s sentinel value. */
  unlimited: boolean;
  freeSlotsRemaining: number;
  paidSlotsRemaining: number;
  role: PlanRole;
  activePlanId: string | null;
  activePlanName: string | null;
  subscriptionStatus: string | null;
  scheduledPlanId: string | null;
  scheduledChargeAt: string | null;
  /** Suggested plan to open in checkout */
  suggestedPlanId: PlanId;
};

export async function getListingEntitlement(): Promise<ListingEntitlement | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "role, trial_ends_at, trial_started_at, listing_limit, subscription_plan_id, subscription_ends_at, scheduled_plan_id, scheduled_charge_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  const role: PlanRole =
    profile?.role === "dealer" ? "dealer" : "individual";

  await ensureUserTrial(supabase, user.id, role);

  const { data: profile2 } = await supabase
    .from("profiles")
    .select(
      "role, trial_ends_at, listing_limit, subscription_plan_id, subscription_ends_at, scheduled_plan_id, scheduled_charge_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  const { count } = await supabase
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("seller_id", user.id)
    .neq("status", "archived");

  const listingsUsed = count ?? 0;

  const { data: activeSubs } = await supabase
    .from("subscriptions")
    .select("id, plan_id, plan_name, status, ends_at, listing_limit, price_szl")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .order("created_at", { ascending: false })
    .limit(5);

  const now = Date.now();
  const paidActive = (activeSubs || []).find(
    (s) =>
      s.status === "active" &&
      s.price_szl > 0 &&
      (!s.ends_at || new Date(s.ends_at).getTime() > now),
  );

  const trialEndsAt = (profile2?.trial_ends_at as string | null) ?? null;
  const trialOn = isTrialActive(trialEndsAt);

  const trialListingLimit = trialListingLimitForRole(role);
  const trialPlanId: PlanId = role === "dealer" ? "dealer_trial" : "individual_trial";

  // Paid plan limit (from active sub or profile)
  let paidLimit = 0;
  let activePlanId: string | null = null;
  let activePlanName: string | null = null;
  let subscriptionStatus: string | null = null;
  let unlimitedPlan = false;

  if (paidActive) {
    paidLimit = paidActive.listing_limit || 0;
    activePlanId = paidActive.plan_id;
    activePlanName = paidActive.plan_name;
    subscriptionStatus = "active";
    unlimitedPlan = getPlanById(paidActive.plan_id as PlanId)?.unlimited ?? false;
  } else if (
    profile2?.subscription_plan_id &&
    profile2.subscription_plan_id !== "individual_trial" &&
    profile2.subscription_plan_id !== "dealer_trial" &&
    profile2.subscription_ends_at &&
    new Date(profile2.subscription_ends_at).getTime() > now
  ) {
    const plan = getPlanById(profile2.subscription_plan_id as PlanId);
    paidLimit = profile2.listing_limit || plan?.listingLimit || 0;
    activePlanId = profile2.subscription_plan_id;
    activePlanName = plan?.name || profile2.subscription_plan_id;
    subscriptionStatus = "active";
    unlimitedPlan = plan?.unlimited ?? false;
  } else if (trialOn) {
    subscriptionStatus = "trialing";
    activePlanId = trialPlanId;
    activePlanName = "Free trial";
  }

  // Free trial: role-based listing cap while trial is active and not yet used
  const freeSlotsRemaining =
    trialOn && listingsUsed < trialListingLimit
      ? trialListingLimit - listingsUsed
      : 0;

  const paidSlotsRemaining =
    paidLimit > 0 ? Math.max(0, paidLimit - listingsUsed) : 0;

  const canUseFree = freeSlotsRemaining > 0;
  const canUsePaid = unlimitedPlan || paidSlotsRemaining > 0;
  const canPost = canUseFree || canUsePaid;

  let reason = "";
  if (canUseFree) {
    reason = `Free trial listing available (${freeSlotsRemaining} left).`;
  } else if (unlimitedPlan) {
    reason = `Covered by ${activePlanName} (unlimited listings).`;
  } else if (canUsePaid) {
    reason = `Covered by ${activePlanName} (${paidSlotsRemaining} slot${paidSlotsRemaining === 1 ? "" : "s"} left).`;
  } else if (trialOn && listingsUsed >= trialListingLimit) {
    reason =
      "Your free trial listing is used. Choose a paid plan before posting another vehicle.";
  } else if (!trialOn && !paidActive) {
    reason = `No active plan. Subscribe to post listings (new ${role === "dealer" ? "dealerships" : "users"} get ${trialListingLimit} free trial listing${trialListingLimit === 1 ? "" : "s"} once).`;
  } else {
    reason = `Listing limit reached (${listingsUsed}/${paidLimit || trialListingLimit}). Upgrade your plan.`;
  }

  const suggestedPlanId: PlanId =
    role === "dealer" ? "dealer_growth" : "individual_14";

  return {
    canPost,
    requiresPayment: !canPost,
    reason,
    isTrialActive: trialOn,
    trialEndsAt,
    listingsUsed,
    listingLimit: paidLimit > 0 ? paidLimit : trialOn ? trialListingLimit : 0,
    unlimited: unlimitedPlan,
    freeSlotsRemaining,
    paidSlotsRemaining,
    role,
    activePlanId,
    activePlanName,
    subscriptionStatus,
    scheduledPlanId: (profile2?.scheduled_plan_id as string | null) ?? null,
    scheduledChargeAt: (profile2?.scheduled_charge_at as string | null) ?? null,
    suggestedPlanId,
  };
}

/** True if user may create another listing right now */
export async function assertCanCreateListing(): Promise<{
  ok: boolean;
  error?: string;
  entitlement?: ListingEntitlement;
}> {
  const ent = await getListingEntitlement();
  if (!ent) {
    return { ok: false, error: "You must be signed in to list a car." };
  }
  if (!ent.canPost) {
    return {
      ok: false,
      error: ent.reason || "Payment required before posting.",
      entitlement: ent,
    };
  }
  return { ok: true, entitlement: ent };
}
