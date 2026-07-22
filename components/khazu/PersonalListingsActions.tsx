"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEdit, FaRocket, FaTrashAlt } from "react-icons/fa";
import {
  archiveListing,
  createMockBoost,
} from "@/lib/listings/actions";

export function PersonalListingsActions({
  listingId,
  isFeatured,
}: {
  listingId: string;
  isFeatured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onArchive = () => {
    if (!confirm("Remove this listing from your dashboard?")) return;
    startTransition(async () => {
      const res = await archiveListing(listingId);
      if (!res.success) alert(res.error || "Failed");
      else router.refresh();
    });
  };

  const onBoost = () => {
    startTransition(async () => {
      const res = await createMockBoost(listingId);
      if (!res.success) alert(res.error || "Failed");
      else router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/dashboard/personal/listings/${listingId}/edit`}
        title="Edit listing"
        className="p-3 bg-gray-50 text-gray-400 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
      >
        <FaEdit size={18} />
      </Link>
      {!isFeatured && (
        <button
          type="button"
          disabled={pending}
          onClick={onBoost}
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
    </div>
  );
}
