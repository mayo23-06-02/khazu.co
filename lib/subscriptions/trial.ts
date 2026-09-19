import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlanRole } from "@/components/subscription/plans-data";

/** Free trial length, per role — individuals get 14 days, dealers 28. */
export const TRIAL_DAYS_BY_ROLE: Record<PlanRole, number> = {
  individual: 14,
  dealer: 28,
};

/** Listings allowed while the free trial is active, per role. */
export const TRIAL_LISTING_LIMIT_BY_ROLE: Record<PlanRole, number> = {
  individual: 1,
  dealer: 5,
};

export function trialDaysForRole(role: PlanRole): number {
  return TRIAL_DAYS_BY_ROLE[role] ?? TRIAL_DAYS_BY_ROLE.individual;
}

export function trialListingLimitForRole(role: PlanRole): number {
  return TRIAL_LISTING_LIMIT_BY_ROLE[role] ?? TRIAL_LISTING_LIMIT_BY_ROLE.individual;
}

export function computeTrialWindow(role: PlanRole, from = new Date()) {
  const start = new Date(from);
  const end = new Date(from);
  end.setDate(end.getDate() + trialDaysForRole(role));
  return { start, end };
}

export function isTrialActive(trialEndsAt: string | null | undefined): boolean {
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt).getTime() > Date.now();
}

/** Start automatic free trial for a new (or existing) user */
export async function ensureUserTrial(
  client: SupabaseClient,
  userId: string,
  role: PlanRole,
) {
  const { data: profile } = await client
    .from("profiles")
    .select("trial_started_at, trial_ends_at")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.trial_ends_at && isTrialActive(profile.trial_ends_at)) {
    return {
      trialStartedAt: profile.trial_started_at as string,
      trialEndsAt: profile.trial_ends_at as string,
      alreadyActive: true,
    };
  }

  // Don't re-start trial if they already used one
  if (profile?.trial_started_at && profile?.trial_ends_at) {
    return {
      trialStartedAt: profile.trial_started_at as string,
      trialEndsAt: profile.trial_ends_at as string,
      alreadyActive: false,
      expired: true,
    };
  }

  const { start, end } = computeTrialWindow(role);
  const trialDays = trialDaysForRole(role);
  const trialListingLimit = trialListingLimitForRole(role);
  const planId = role === "dealer" ? "dealer_trial" : "individual_trial";
  const planName = role === "dealer" ? "Dealership free trial" : "Free Trial";

  await client
    .from("profiles")
    .update({
      trial_started_at: start.toISOString(),
      trial_ends_at: end.toISOString(),
      listing_limit: trialListingLimit,
      subscription_plan_id: planId,
      subscription_ends_at: end.toISOString(),
    })
    .eq("id", userId);

  // Best-effort subscription row (table may not exist yet)
  await client.from("subscriptions").insert({
    user_id: userId,
    role,
    plan_id: planId,
    plan_name: planName,
    price_szl: 0,
    billing_period_days: trialDays,
    listing_limit: trialListingLimit,
    included_sponsorships: 0,
    status: "trialing",
    starts_at: start.toISOString(),
    ends_at: end.toISOString(),
    payment_provider: "promo",
    payment_metadata: {
      auto_trial: true,
      trial_days: trialDays,
    },
  });

  return {
    trialStartedAt: start.toISOString(),
    trialEndsAt: end.toISOString(),
    alreadyActive: false,
  };
}
