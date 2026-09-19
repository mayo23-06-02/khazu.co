"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEdit, FaRocket, FaTrashAlt } from "react-icons/fa";
import { archiveListing } from "@/lib/listings/actions";
import { CheckoutDrawer } from "@/components/subscription/CheckoutDrawer";
import type { PlanId, PlanRole } from "@/components/subscription/plans-data";

export function PersonalListingsActions({
  listingId,
  isFeatured,
  role = "individual",
  editHref = `/dashboard/personal/listings/${listingId}/edit`,
}: {
  listingId: string;
  isFeatured: boolean;
  role?: PlanRole;
  editHref?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [boostOpen, setBoostOpen] = useState(false);

  const onArchive = () => {
    if (!confirm("Remove this listing from your dashboard?")) return;
    startTransition(async () => {
      const res = await archiveListing(listingId);
      if (!res.success) alert(res.error || "Failed");
      else router.refresh();
    });
  };

  const trialPlanId: PlanId = role === "dealer" ? "dealer_trial" : "individual_trial";

  return (
    <div className="flex items-center gap-2">
      <Link
        href={editHref}
        title="Edit listing"
        className="p-3 bg-gray-50 text-gray-400 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
      >
        <FaEdit size={18} />
      </Link>
      {!isFeatured && (
        <button
          type="button"
          disabled={pending}
          onClick={() => setBoostOpen(true)}
          title="Boost listing (14 days)"
          className="p-3 bg-gray-50 text-gray-400 hover:bg-primary/10 hover:text-primary rounded-lg transition-all disabled:opacity-50"
        >
          <FaRocket size={18} />
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={onArchive}
        title="Archive listing"
        className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all disabled:opacity-50"
      >
        <FaTrashAlt size={18} />
      </button>

      {boostOpen && (
        <CheckoutDrawer
          open={boostOpen}
          onClose={() => setBoostOpen(false)}
          role={role}
          planId={trialPlanId}
          addonIds={["listing_boost_14"]}
          listingId={listingId}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}
