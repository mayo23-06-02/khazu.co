import { redirect } from "next/navigation";
import { Container, Heading1, Body } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { SubscriptionPlans } from "@/components/subscription/subscription-plans";
import { SubscriptionBillingStatus } from "@/components/subscription/SubscriptionBillingStatus";
import { getListingEntitlement } from "@/lib/subscriptions/entitlement";
import { listBillingTransactions } from "@/lib/subscriptions/transactions";

export const dynamic = "force-dynamic";

export default async function PersonalSubscriptionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard/personal/subscription");
  }

  const { ensureUserTrial } = await import("@/lib/subscriptions/trial");
  await ensureUserTrial(supabase, user.id, "individual");

  const [profileRes, entitlement, transactions] = await Promise.all([
    supabase
      .from("profiles")
      .select("trial_ends_at, scheduled_plan_id, scheduled_charge_at")
      .eq("id", user.id)
      .maybeSingle(),
    getListingEntitlement(),
    listBillingTransactions(),
  ]);

  const profile = profileRes.data;

  return (
    <Container className="py-8 max-w-6xl">
      <div className="mb-8">
        <Heading1>Subscription</Heading1>
        <Body muted>
          Free trial = 1 listing once. Tap a plan to pay for more — checkout
          opens on the right.
        </Body>
      </div>

      <SubscriptionBillingStatus
        entitlement={entitlement}
        transactions={transactions}
      />

      <SubscriptionPlans
        defaultRole="individual"
        trialEndsAt={profile?.trial_ends_at ?? entitlement?.trialEndsAt}
        scheduledPlanId={
          profile?.scheduled_plan_id ?? entitlement?.scheduledPlanId
        }
        scheduledChargeAt={
          profile?.scheduled_charge_at ?? entitlement?.scheduledChargeAt
        }
      />
    </Container>
  );
}
