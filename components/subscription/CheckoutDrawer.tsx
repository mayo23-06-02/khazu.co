"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Body,
  Button,
  Heading3,
  InputText,
  OffCanvas,
  Small,
  Spinner,
} from "@/components/ui";
import { FaCheckCircle, FaMobileAlt, FaShieldAlt } from "react-icons/fa";
import {
  formatEmalangeni,
  getAddonById,
  getPlanById,
  type AddonId,
  type PlanId,
  type PlanRole,
} from "./plans-data";
import { quickCheckout } from "@/lib/subscriptions/quick-checkout";

export type CheckoutDrawerProps = {
  open: boolean;
  onClose: () => void;
  role: PlanRole;
  planId: PlanId;
  addonIds: AddonId[];
  trialEndsAt?: string | null;
  onSuccess?: (message: string) => void;
};

export function CheckoutDrawer({
  open,
  onClose,
  role,
  planId,
  addonIds,
  trialEndsAt = null,
  onSuccess,
}: CheckoutDrawerProps) {
  const router = useRouter();
  const plan = getPlanById(planId);
  const addons = addonIds
    .map((id) => getAddonById(id))
    .filter((a): a is NonNullable<typeof a> => !!a)
    .filter((a) => !a.dealerOnly || role === "dealer");

  const planPrice = plan?.priceSzl ?? 0;
  const addonsTotal = addons.reduce((s, a) => s + a.priceSzl, 0);
  const total = planPrice + addonsTotal;
  const isFree = total === 0;

  const trialActive =
    !!trialEndsAt && new Date(trialEndsAt).getTime() > Date.now();
  const deferred = trialActive && total > 0;
  const trialEndLabel = trialEndsAt
    ? new Date(trialEndsAt).toLocaleDateString()
    : "";

  const [momoNumber, setMomoNumber] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [ref, setRef] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reset success state when opening a new plan
  useEffect(() => {
    if (open) {
      setError("");
      setDone(false);
      setSuccessMsg("");
      setRef(null);
    }
  }, [open, planId]);

  const resetAndClose = () => {
    setError("");
    setDone(false);
    setSuccessMsg("");
    setRef(null);
    onClose();
  };

  const pay = () => {
    setError("");
    if (!plan) {
      setError("Invalid plan.");
      return;
    }
    if (!isFree && !momoNumber.trim()) {
      setError(
        deferred
          ? "Enter MoMo number for the charge after your trial."
          : "Enter your MTN MoMo number.",
      );
      return;
    }

    startTransition(async () => {
      const res = await quickCheckout({
        role,
        planId,
        addonIds: addons.map((a) => a.id),
        momoNumber,
      });

      if (!res.success) {
        setError(res.error || "Checkout failed. Try again.");
        return;
      }

      setDone(true);
      setSuccessMsg(res.message || "Done.");
      setRef(res.paymentReference || null);
      onSuccess?.(res.message || "Done.");
      router.refresh();
    });
  };

  if (!plan) return null;

  return (
    <OffCanvas
      isOpen={open}
      onClose={isPending ? () => {} : resetAndClose}
      position="right"
      className="w-full max-w-md"
    >
      <div className="flex flex-col h-[calc(100dvh-4rem)] -mt-2">
        <div className="px-1 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[#CD2C58] text-xs font-bold uppercase tracking-wider mb-2">
            <FaShieldAlt size={12} />{" "}
            {deferred ? "Schedule after trial" : "Checkout"}
          </div>
          <Heading3 className="text-xl font-black text-gray-900 mb-0">
            {done ? "You're all set" : plan.name}
          </Heading3>
          <Body size="sm" muted className="mt-1">
            {done
              ? "Saved to your account."
              : deferred
                ? `Free trial until ${trialEndLabel}. We’ll charge MoMo after that.`
                : "Enter MoMo number and confirm — one step."}
          </Body>
        </div>

        <div className="flex-1 overflow-y-auto py-5 space-y-5 px-1">
          {done ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                <FaCheckCircle size={32} />
              </div>
              <p className="font-semibold text-gray-800 text-sm leading-relaxed px-2">
                {successMsg}
              </p>
              {ref && (
                <p className="text-[11px] font-mono text-gray-400 break-all px-2">
                  {ref}
                </p>
              )}
              <Button
                type="button"
                fullWidth
                className="bg-[#CD2C58] text-white font-bold border-none"
                onClick={resetAndClose}
              >
                Done
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-gray-100 bg-gray-50 divide-y divide-gray-100 text-sm">
                <div className="flex justify-between gap-3 px-3 py-2.5">
                  <span className="text-gray-500 font-medium">Plan</span>
                  <span className="font-bold text-gray-900 text-right">
                    {plan.name}
                  </span>
                </div>
                {addons.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between gap-3 px-3 py-2.5"
                  >
                    <span className="text-gray-500 font-medium line-clamp-1">
                      {a.name}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatEmalangeni(a.priceSzl)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between gap-3 px-3 py-3 font-black">
                  <span>{deferred ? "Due after trial" : "Total now"}</span>
                  <span className="text-[#CD2C58] text-lg">
                    {formatEmalangeni(total)}
                  </span>
                </div>
              </div>

              {deferred && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-sm text-emerald-800 font-medium">
                  No charge today. First payment: {trialEndLabel}.
                </div>
              )}

              <div>
                {isFree ? (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-sm text-emerald-800 font-medium">
                    This plan is free — no payment details needed. Confirm
                    below to activate.
                  </div>
                ) : (
                  <>
                    <InputText
                      label="MTN MoMo number"
                      placeholder="76 000 000"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      fullWidth
                      inputMode="tel"
                      autoComplete="tel"
                      disabled={isPending}
                    />
                    <Small className="text-gray-400 mt-1.5 block">
                      {deferred
                        ? "Saved for the automatic charge when trial ends"
                        : "You’ll get a MoMo prompt on this number"}
                    </Small>
                  </>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 text-sm text-red-600 font-medium">
                  {error}
                </div>
              )}

              {isPending && (
                <div className="flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-100 px-3 py-3 text-sm text-amber-900 font-medium">
                  <Spinner size="sm" />
                  {deferred ? "Scheduling plan…" : "Processing payment…"}
                </div>
              )}
            </>
          )}
        </div>

        {!done && (
          <div className="pt-4 border-t border-gray-100 space-y-2 px-1 pb-2">
            <Button
              type="button"
              fullWidth
              size="lg"
              loading={isPending}
              disabled={isPending}
              onClick={pay}
              className="bg-[#FFCC00] hover:bg-[#e6b800] text-gray-900 font-black border-none h-12"
            >
              <FaMobileAlt className="mr-2" />
              {deferred
                ? `Schedule ${formatEmalangeni(total)} after trial`
                : `Pay ${formatEmalangeni(total)} with MoMo`}
            </Button>
            <Button
              type="button"
              fullWidth
              variant="ghost"
              disabled={isPending}
              onClick={resetAndClose}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </OffCanvas>
  );
}
