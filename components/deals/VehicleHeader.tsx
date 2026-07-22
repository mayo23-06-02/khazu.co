import Link from "next/link";
import { Badge, Heading2, Heading3 } from "@/components/ui";
import { FaEye, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";
import type { MarketplaceListing } from "@/lib/marketplace/types";

export function VehicleHeader({
  listing,
  title,
  city,
  listedDate,
}: {
  listing: MarketplaceListing;
  title: string;
  city: string | null | undefined;
  listedDate: string;
}) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4 py-4">
        <nav className="text-xs font-medium text-gray-400 flex flex-wrap gap-1.5 mb-4">
          <Link href="/listings" className="hover:text-[#CD2C58]">
            Marketplace
          </Link>
          <span>/</span>
          <Link
            href={`/listings?make=${encodeURIComponent(listing.make)}`}
            className="hover:text-[#CD2C58]"
          >
            {listing.make}
          </Link>
          <span>/</span>
          <span className="text-gray-700">{listing.model}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          {listing.condition && (
            <span className="bg-[#1a1a1a] text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
              {listing.condition}
            </span>
          )}
          
          {listing.is_verified && (
            <Badge className="bg-emerald-600 text-white border-none font-bold flex items-center gap-1">
              <FaShieldAlt size={10} /> Verified
            </Badge>
          )}
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {listing.seller_type === "dealer" ? "Dealer" : "Private seller"}
          </span>
        </div>

        <Heading3 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 mb-1">
          {title}
        </Heading3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700 ">
          {listing.transmission && (
            <span className="capitalize">{listing.transmission}</span>
          )}
          {listing.fuel_type && (
            <>
              <span className="text-gray-300">•</span>
              <span className="capitalize">{listing.fuel_type}</span>
            </>
          )}
          {city && (
            <>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center gap-1">
                <FaMapMarkerAlt className="text-[#CD2C58]" size={12} />
                {city}
              </span>
            </>
          )}
          <span className="text-gray-300">•</span>
          <span className="inline-flex items-center gap-1">
            <FaEye size={12} /> {listing.views_count ?? 0} views
          </span>
          <span className="text-gray-300">•</span>
          <span>Listed {listedDate}</span>
        </div>
      </div>
    </div>
  );
}
