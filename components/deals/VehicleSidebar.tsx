import Link from "next/link";
import { Badge, Button, Small } from "@/components/ui";
import { FaHandshake, FaMapMarkerAlt, FaPhoneAlt, FaUser, FaWhatsapp } from "react-icons/fa";
import { MdTrendingDown } from "react-icons/md";
import type { MarketplaceListing } from "@/lib/marketplace/types";
import { formatSzl } from "@/lib/marketplace/format";

export function VehicleSidebar({
  listing,
  seller,
  city,
  phone,
  phoneRevealed,
  onRevealPhone,
  onContact,
  onEnquireClick,
}: {
  listing: MarketplaceListing;
  seller: string;
  city: string | null | undefined;
  phone: string | null | undefined;
  phoneRevealed: boolean;
  onRevealPhone: () => void;
  onContact: (channel: "call" | "whatsapp") => void;
  onEnquireClick: () => void;
}) {
  const hasPriceDrop =
    listing.previous_price != null && listing.previous_price > listing.price;
  const dropPercent = hasPriceDrop
    ? Math.round(
        ((listing.previous_price! - listing.price) / listing.previous_price!) *
          100,
      )
    : 0;

  return (
    <div className="lg:sticky lg:top-24 space-y-4">
      <div className="bg-white rounded-lg border border-gray-100  p-6 space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <Small className="text-gray-400 font-bold uppercase tracking-wider">
              Cash price
            </Small>
            {hasPriceDrop && (
              <Badge
                variant="danger"
                className="flex items-center gap-1 font-bold"
              >
                <MdTrendingDown size={13} />-{dropPercent}%
              </Badge>
            )}
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-xl font-bold text-gray-900">
              {formatSzl(listing.price)}
            </p>
            {hasPriceDrop && (
              <p className="text-sm font-semibold text-gray-400 line-through">
                {formatSzl(listing.previous_price)}
              </p>
            )}
          </div>
          {listing.negotiable && (
            <p className="text-sm font-semibold text-emerald-600 mt-1 flex items-center gap-1.5">
              <FaHandshake size={14} /> Price negotiable
            </p>
          )}
        </div>

        {listing.accepts_installments && (
          <div className="rounded-lg bg-[#CD2C58]/5 border border-[#CD2C58]/15 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#CD2C58] mb-1">
              Installments
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {listing.deposit_amount != null && (
                <>Deposit {formatSzl(listing.deposit_amount)}</>
              )}
              {listing.installment_months != null && (
                <>
                  {listing.deposit_amount != null ? " · " : ""}
                  {listing.installment_months} months
                </>
              )}
              {listing.deposit_amount == null &&
                listing.installment_months == null &&
                "Available — contact seller"}
            </p>
          </div>
        )}

        <div className="space-y-2.5">
          <Button
            fullWidth
            className="bg-[#CD2C58] hover:bg-[#a72346] text-white font-bold h-12 rounded-lg border-none"
            onClick={onEnquireClick}
          >
            Enquire now
          </Button>
          {phone && (
            <>
              <Button
                fullWidth
                variant="outline"
                className="font-bold h-12 rounded-lg border-2 border-gray-200 flex items-center justify-center gap-2"
                onClick={() => {
                  onRevealPhone();
                  onContact("call");
                }}
              >
                <FaPhoneAlt size={14} />
                {phoneRevealed ? phone : "Show phone number"}
              </Button>
              <Button
                fullWidth
                variant="outline"
                className="font-bold h-12 rounded-lg border-2 border-emerald-200 text-emerald-700 flex items-center justify-center gap-2"
                onClick={() => onContact("whatsapp")}
              >
                <FaWhatsapp size={16} />
                WhatsApp seller
              </Button>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <FaUser />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-bold uppercase">
              {listing.seller_type === "dealer" ? "Dealership" : "Seller"}
            </p>
            <p className="font-bold text-gray-900 truncate">{seller}</p>
            {city && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <FaMapMarkerAlt size={10} /> {city}
              </p>
            )}
          </div>
        </div>
      </div>

      <Link
        href="/sell/upload"
        className="block text-center text-sm font-bold text-gray-600 hover:text-[#CD2C58] underline underline-offset-2"
      >
        Sell your car on Khazu
      </Link>
    </div>
  );
}
