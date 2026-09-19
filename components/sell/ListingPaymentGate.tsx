"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Badge,
  Body,
  Button,
  Card,
  CardBody,
  Heading4,
  Small,
} from "@/components/ui";
import {
  FaCheckCircle,
  FaCreditCard,
  FaExclamationTriangle,
  FaLock,
} from "react-icons/fa";
import type { ListingEntitlement } from "@/lib/subscriptions/entitlement";
import { CheckoutDrawer } from "@/components/subscription/CheckoutDrawer";
import type { PlanId } from "@/components/subscription/plans-data";

export function ListingPaymentGate({
  entitlement,
  onEntitlementRefresh,
}: {
  entitlement: ListingEntitlement | null;
  onEntitlementRefresh?: () => void;
}) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (!entitlement) {
    return (
      <Card padding="lg" className="border border-amber-100 bg-amber-50/50">
        <CardBody className="p-0 space-y-2">
          <Heading4 className="font-bold text-amber-900">Sign in required</Heading4>
          <Body size="sm" className="text-amber-800">
            Sign in or create an account to publish. New accounts get 1 free
            trial listing.
          </Body>
          <Link href="/auth/login?next=/sell/upload">
            <Button size="sm" className="bg-[#CD2C58] text-white border-none font-bold mt-2">
              Sign in
            </Button>
          </Link>
        </CardBody>
      </Card>
    );
  }

  const {
    canPost,
    requiresPayment,
    reason,
    listingsUsed,
    listingLimit,
    unlimited,
    freeSlotsRemaining,
    isTrialActive,
    trialEndsAt,
    activePlanName,
    scheduledPlanId,
    scheduledChargeAt,
    suggestedPlanId,
    role,
  } = entitlement;

  return (
    <>
      <Card
        padding="lg"
        className={
          canPost
            ? "border border-emerald-100 bg-emerald-50/40"
            : "border border-amber-200 bg-amber-50/50"
        }
      >
        <CardBody className="p-0 space-y-3">
          <div className="flex items-start gap-3">
            <span
              className={
                canPost
                  ? "w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0"
                  : "w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0"
              }
            >
              {canPost ? <FaCheckCircle /> : <FaLock />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Heading4 className="font-black mb-0">
                  {canPost ? "Ready to publish" : "Payment required"}
                </Heading4>
                {isTrialActive && (
                  <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-bold">
                    Trial
                  </Badge>
                )}
                {activePlanName && (
                  <Badge className="bg-gray-100 text-gray-700 border-none text-[10px] font-bold">
                    {activePlanName}
                  </Badge>
                )}
              </div>
              <Body size="sm" className={canPost ? "text-emerald-900" : "text-amber-900"}>
                {reason}
              </Body>
              <Small className="text-gray-500 block mt-1">
                Listings used: {listingsUsed}
                {unlimited ? " / Unlimited" : listingLimit > 0 ? ` / ${listingLimit}` : ""}
                {freeSlotsRemaining > 0
                  ? ` · ${freeSlotsRemaining} free trial slot left`
                  : ""}
                {trialEndsAt && isTrialActive
                  ? ` · Trial ends ${new Date(trialEndsAt).toLocaleDateString()}`
                  : ""}
              </Small>
              {scheduledPlanId && scheduledChargeAt && (
                <Small className="text-gray-600 block mt-1 font-semibold">
                  Scheduled: {scheduledPlanId} from{" "}
                  {new Date(scheduledChargeAt).toLocaleDateString()}
                </Small>
              )}
            </div>
          </div>

          {requiresPayment && (
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                className="bg-[#FFCC00] hover:bg-[#e6b800] text-gray-900 font-black border-none"
                onClick={() => setCheckoutOpen(true)}
              >
                <FaCreditCard className="mr-2" />
                Pay to post another vehicle
              </Button>
              <Link
                href={
                  role === "dealer"
                    ? "/dashboard/dealer/subscription"
                    : "/dashboard/personal/subscription"
                }
              >
                <Button type="button" size="sm" variant="outline">
                  Manage subscription
                </Button>
              </Link>
            </div>
          )}

          {!requiresPayment && freeSlotsRemaining > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-white/60 rounded-lg px-3 py-2">
              <FaCheckCircle className="text-emerald-500 shrink-0" />
              This post uses your free trial listing. Additional cars require a
              paid plan.
            </div>
          )}

          {requiresPayment && (
            <div className="flex items-start gap-2 text-xs text-amber-800 bg-white/50 rounded-lg px-3 py-2">
              <FaExclamationTriangle className="mt-0.5 shrink-0" />
              You must complete payment before this vehicle can be published.
            </div>
          )}
        </CardBody>
      </Card>

      <CheckoutDrawer
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        role={role}
        planId={suggestedPlanId as PlanId}
        addonIds={[]}
        trialEndsAt={trialEndsAt}
        onSuccess={() => {
          setCheckoutOpen(false);
          onEntitlementRefresh?.();
        }}
      />
    </>
  );
}
