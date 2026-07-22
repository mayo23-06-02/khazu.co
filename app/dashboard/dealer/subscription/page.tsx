import { redirect } from "next/navigation";
import { Container, Heading1, Body } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { SubscriptionPlans } from "@/components/subscription/subscription-plans";
import { SubscriptionBillingStatus } from "@/components/subscription/SubscriptionBillingStatus";
import { getListingEntitlement } from "@/lib/subscriptions/entitlement";
import { listBillingTransactions } from "@/lib/subscriptions/transactions";

export const dynamic = "force-dynamic";

export default async function DealerSubscriptionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard/dealer/subscription");
  }

  const { ensureUserTrial } = await import("@/lib/subscriptions/trial");
  await ensureUserTrial(supabase, user.id, "dealer");

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
        <Heading1>Subscription & billing</Heading1>
        <Body muted>
          Manage dealership plans, listing slots, and MoMo payments. Free trial
          includes 1 listing; more inventory requires an active plan.
        </Body>
      </div>

      <SubscriptionBillingStatus
        entitlement={entitlement}
        transactions={transactions}
      />

      <SubscriptionPlans
        defaultRole="dealer"
        lockRole
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
