"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Body,
  Button,
  Card,
  CardBody,
  Heading2,
  Heading3,
} from "@/components/ui";
import {
  FaCheck,
  FaCrown,
  FaRocket,
  FaStore,
  FaUser,
  FaStar,
  FaBolt,
  FaShieldAlt,
} from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import {
  DEALER_PLANS,
  INDIVIDUAL_PLANS,
  SPONSORSHIP_ADDONS,
  formatEmalangeni,
  type AddonId,
  type PlanId,
  type PlanRole,
  type SubscriptionPlan,
} from "./plans-data";
import { CheckoutDrawer } from "./CheckoutDrawer";

export interface SubscriptionPlansProps {
  defaultRole?: PlanRole;
  lockRole?: boolean;
  className?: string;
  /** ISO trial end date from profile (optional) */
  trialEndsAt?: string | null;
  scheduledPlanId?: string | null;
  scheduledChargeAt?: string | null;
  onSuccess?: (result: {
    subscriptionId?: string;
    paymentReference?: string;
    message?: string;
  }) => void;
}

export function SubscriptionPlans({
  defaultRole = "individual",
  lockRole = false,
  className = "",
  trialEndsAt = null,
  scheduledPlanId = null,
  scheduledChargeAt = null,
  onSuccess,
}: SubscriptionPlansProps) {
  const [role, setRole] = useState<PlanRole>(defaultRole);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<AddonId[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [banner, setBanner] = useState("");

  const trialActive =
    !!trialEndsAt && new Date(trialEndsAt).getTime() > Date.now();
  const trialEndLabel = trialEndsAt
    ? new Date(trialEndsAt).toLocaleDateString()
    : null;

  // Paid plans only — trial is automatic for everyone
  const plans = useMemo(() => {
    const list = role === "dealer" ? DEALER_PLANS : INDIVIDUAL_PLANS;
    return list.filter((p) => !p.isTrial && p.priceSzl > 0);
  }, [role]);

  const selectedPlan: SubscriptionPlan | undefined = useMemo(
    () => plans.find((p) => p.id === selectedPlanId),
    [plans, selectedPlanId],
  );

  const visibleAddons = useMemo(
    () =>
      SPONSORSHIP_ADDONS.filter((a) => !a.dealerOnly || role === "dealer"),
    [role],
  );

  const switchRole = (next: PlanRole) => {
    if (lockRole) return;
    setRole(next);
    setSelectedPlanId(null);
    setSelectedAddons((prev) =>
      prev.filter((id) => {
        const a = SPONSORSHIP_ADDONS.find((x) => x.id === id);
        return a && (!a.dealerOnly || next === "dealer");
      }),
    );
  };

  const toggleAddon = (id: AddonId) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const openCheckout = (planId: PlanId) => {
    setSelectedPlanId(planId);
    setBanner("");
    setCheckoutOpen(true);
  };

  return (
    <div className={twMerge("w-full space-y-8", className)}>
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#CD2C58]/10 text-[#CD2C58] px-3 py-1 text-xs font-bold uppercase tracking-wider">
          <FaShieldAlt /> Secure MTN MoMo billing
        </div>
        <Heading2 className="text-3xl md:text-4xl font-black text-gray-900">
          Choose your Khazu plan
        </Heading2>
        <Body muted className="max-w-xl mx-auto">
          Everyone gets a free trial automatically. Pick a paid plan anytime —
          we only charge after your trial ends.
        </Body>

        {!lockRole && (
          <div className="inline-flex p-1.5 bg-gray-100 rounded-lg gap-1">
            <RoleTab
              active={role === "individual"}
              onClick={() => switchRole("individual")}
              icon={<FaUser />}
              label="Individual seller"
            />
            <RoleTab
              active={role === "dealer"}
              onClick={() => switchRole("dealer")}
              icon={<FaStore />}
              label="Dealership"
            />
          </div>
        )}
      </div>

      {/* Auto trial banner */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <FaBolt />
          </span>
          <div>
            <p className="font-bold text-emerald-900">
              {trialActive
                ? `Free trial active until ${trialEndLabel}`
                : "Free trial included for every account"}
            </p>
            <p className="text-sm text-emerald-800/80">
              {trialActive
                ? "Select any paid plan now — first MoMo charge happens after the trial ends. 1 listing included during trial."
                : "45 days · 1 listing · no card required. Upgrade when you’re ready."}
            </p>
            {scheduledPlanId && scheduledChargeAt && (
              <p className="text-sm font-semibold text-emerald-900 mt-1">
                Scheduled: {scheduledPlanId} from{" "}
                {new Date(scheduledChargeAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {banner && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-medium text-emerald-700 text-center">
          {banner}
        </div>
      )}

      {/* Plan cards — click opens checkout modal */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const selected = selectedPlan?.id === plan.id && checkoutOpen;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => openCheckout(plan.id)}
              className={twMerge(
                "text-left rounded-lg border-2 bg-white p-6 transition-all relative overflow-hidden",
                selected
                  ? "border-[#CD2C58] shadow-xl shadow-[#CD2C58]/10 ring-2 ring-[#CD2C58]/20"
                  : "border-gray-100 hover:border-[#CD2C58]/40 hover:shadow-md",
                plan.popular && "md:-translate-y-1",
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <span className="inline-flex items-center gap-1 bg-[#CD2C58] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-bl-xl">
                    <FaStar size={10} /> Most popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-1">
                {plan.role === "dealer" && plan.id === "dealer_premium" ? (
                  <FaCrown className="text-amber-500" />
                ) : plan.role === "dealer" ? (
                  <FaRocket className="text-[#CD2C58]" />
                ) : null}
                <Heading3 className="text-xl font-black text-gray-900 mb-0">
                  {plan.name}
                </Heading3>
              </div>
              <p className="text-sm text-gray-500 mb-4">{plan.tagline}</p>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-black text-gray-900 tracking-tight">
                  {formatEmalangeni(plan.priceSzl)}
                </span>
                <span className="text-sm font-semibold text-gray-400">
                  / {plan.periodLabel}
                </span>
              </div>

              {trialActive && (
                <p className="text-xs font-semibold text-emerald-600 mb-3">
                  Charge after trial ({trialEndLabel})
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wide bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                  {plan.listingLimit} listing
                  {plan.listingLimit === 1 ? "" : "s"}
                </span>
                {plan.includedSponsorships > 0 && (
                  <span className="text-[11px] font-bold uppercase tracking-wide bg-[#CD2C58]/10 text-[#CD2C58] px-2.5 py-1 rounded-full">
                    {plan.includedSponsorships} sponsored ads
                  </span>
                )}
              </div>

              <ul className="space-y-2.5 mb-2">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-gray-700 font-medium"
                  >
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <FaCheck size={10} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-5 w-full py-2.5 rounded-lg text-center text-sm font-bold bg-[#CD2C58] text-white">
                {trialActive ? "Schedule plan" : "Checkout"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Optional add-ons (apply to next checkout) */}
      <Card padding="none" className="border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-[#2a1520] px-6 py-5 text-white">
          <Heading3 className="text-lg font-black text-white mb-1">
            Sponsorship add-ons
          </Heading3>
          <Body size="sm" className="text-white/70">
            Optional — included when you open checkout on a plan.
            {trialActive && " Deferred add-ons charge after trial too."}
          </Body>
        </div>
        <CardBody className="p-4 md:p-6 space-y-3">
          {visibleAddons.map((addon) => {
            const checked = selectedAddons.includes(addon.id);
            return (
              <label
                key={addon.id}
                className={twMerge(
                  "flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                  checked
                    ? "border-[#CD2C58] bg-[#CD2C58]/5"
                    : "border-gray-100 hover:border-gray-200 bg-white",
                )}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-[#CD2C58] focus:ring-[#CD2C58]"
                    checked={checked}
                    onChange={() => toggleAddon(addon.id)}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-bold text-gray-900">
                        {addon.name}
                      </span>
                      {addon.badge && (
                        <Badge className="bg-amber-100 text-amber-800 border-none text-[10px] font-bold">
                          {addon.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{addon.description}</p>
                  </div>
                </div>
                <div className="sm:text-right shrink-0 pl-8 sm:pl-0">
                  <p className="text-lg font-black text-gray-900">
                    {formatEmalangeni(addon.priceSzl)}
                  </p>
                  <p className="text-xs font-semibold text-gray-400">
                    / {addon.durationDays} days
                  </p>
                </div>
              </label>
            );
          })}
        </CardBody>
      </Card>

      {selectedPlanId && (
        <CheckoutDrawer
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          role={role}
          planId={selectedPlanId}
          addonIds={selectedAddons}
          trialEndsAt={trialEndsAt}
          onSuccess={(message) => {
            setBanner(message);
            onSuccess?.({ message });
          }}
        />
      )}
    </div>
  );
}

function RoleTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all",
        active
          ? "bg-white text-[#CD2C58] shadow-sm"
          : "text-gray-500 hover:text-gray-700",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export default SubscriptionPlans;
