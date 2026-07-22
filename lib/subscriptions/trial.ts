import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlanRole } from "@/components/subscription/plans-data";

export const TRIAL_DAYS = 7;
export const TRIAL_LISTING_LIMIT = 1;

export function computeTrialWindow(from = new Date()) {
  const start = new Date(from);
  const end = new Date(from);
  end.setDate(end.getDate() + TRIAL_DAYS);
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

  const { start, end } = computeTrialWindow();
  const planName = role === "dealer" ? "Dealership free trial" : "Free Trial";

  await client
    .from("profiles")
    .update({
      trial_started_at: start.toISOString(),
      trial_ends_at: end.toISOString(),
      listing_limit: TRIAL_LISTING_LIMIT,
      subscription_plan_id: "individual_trial",
      subscription_ends_at: end.toISOString(),
    })
    .eq("id", userId);

  // Best-effort subscription row (table may not exist yet)
  await client.from("subscriptions").insert({
    user_id: userId,
    role,
    plan_id: "individual_trial",
    plan_name: planName,
    price_szl: 0,
    billing_period_days: TRIAL_DAYS,
    listing_limit: TRIAL_LISTING_LIMIT,
    included_sponsorships: 0,
    status: "trialing",
    starts_at: start.toISOString(),
    ends_at: end.toISOString(),
    payment_provider: "promo",
    payment_metadata: {
      auto_trial: true,
      trial_days: TRIAL_DAYS,
    },
  });

  return {
    trialStartedAt: start.toISOString(),
    trialEndsAt: end.toISOString(),
    alreadyActive: false,
  };
}
