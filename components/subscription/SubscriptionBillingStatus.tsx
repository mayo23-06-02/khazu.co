"use client";

import {
  Badge,
  Body,
  Card,
  CardBody,
  Heading3,
  Small,
} from "@/components/ui";
import type { ListingEntitlement } from "@/lib/subscriptions/entitlement";
import type { BillingTransaction } from "@/lib/subscriptions/transactions";
import { formatEmalangeni } from "@/components/subscription/plans-data";
import { FaCar, FaClock, FaCreditCard, FaBolt } from "react-icons/fa";

export function SubscriptionBillingStatus({
  entitlement,
  transactions = [],
}: {
  entitlement: ListingEntitlement | null;
  transactions?: BillingTransaction[];
}) {
  if (!entitlement) return null;

  const {
    listingsUsed,
    listingLimit,
    unlimited,
    freeSlotsRemaining,
    isTrialActive,
    trialEndsAt,
    activePlanName,
    subscriptionStatus,
    scheduledPlanId,
    scheduledChargeAt,
    canPost,
  } = entitlement;

  return (
    <div className="space-y-4 mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FaCar className="text-primary" />}
          label="Listings used"
          value={
            unlimited
              ? `${listingsUsed} / Unlimited`
              : `${listingsUsed}${listingLimit ? ` / ${listingLimit}` : ""}`
          }
          hint={
            freeSlotsRemaining > 0
              ? `${freeSlotsRemaining} free trial left`
              : canPost
                ? "Slots available"
                : "Limit reached"
          }
        />
        <StatCard
          icon={<FaBolt className="text-emerald-500" />}
          label="Trial"
          value={isTrialActive ? "Active" : "Ended / none"}
          hint={
            trialEndsAt
              ? `Until ${new Date(trialEndsAt).toLocaleDateString()}`
              : "1 free listing for new accounts"
          }
        />
        <StatCard
          icon={<FaCreditCard className="text-amber-500" />}
          label="Plan"
          value={activePlanName || "None"}
          hint={subscriptionStatus || "Subscribe below"}
        />
        <StatCard
          icon={<FaClock className="text-blue-500" />}
          label="Next charge"
          value={
            scheduledChargeAt
              ? new Date(scheduledChargeAt).toLocaleDateString()
              : "—"
          }
          hint={scheduledPlanId || "No scheduled payment"}
        />
      </div>

      {transactions.length > 0 && (
        <Card padding="none" elevated="sm" className="overflow-hidden">
          <div className="px-5 py-3 border-b border-line bg-surface-alt">
            <Heading3 className="text-sm font-black mb-0">
              Recent payments
            </Heading3>
          </div>
          <CardBody className="p-0 divide-y divide-gray-100">
            {transactions.slice(0, 6).map((tx) => (
              <div
                key={tx.id}
                className="px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-sm"
              >
                <div>
                  <p className="font-bold text-gray-900">{tx.plan_name}</p>
                  <Small className="text-gray-400">
                    {new Date(tx.created_at).toLocaleString()}
                    {tx.payment_reference
                      ? ` · ${tx.payment_reference}`
                      : ""}
                  </Small>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      tx.status === "active" || tx.status === "trialing"
                        ? "bg-emerald-100 text-emerald-800 border-none"
                        : tx.status === "pending"
                          ? "bg-amber-100 text-amber-800 border-none"
                          : "bg-gray-100 text-gray-600 border-none"
                    }
                  >
                    {tx.status}
                  </Badge>
                  <span className="font-black text-gray-900">
                    {formatEmalangeni(tx.total_szl ?? Number(tx.price_szl))}
                  </span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card padding="lg" elevated="sm">
      <CardBody className="p-0 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
          {icon}
          {label}
        </div>
        <p className="text-xl font-black text-ink truncate">{value}</p>
        <Body size="sm" muted>
          {hint}
        </Body>
      </CardBody>
    </Card>
  );
}
