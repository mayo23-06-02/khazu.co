"use client";

import { useEffect, useState } from "react";
import { Body, Heading3 } from "@/components/ui";
import { FaMapMarkerAlt } from "react-icons/fa";
import type { MarketplaceListing } from "@/lib/marketplace/types";
import { sellerDisplayName } from "@/lib/marketplace/format";
import { VehicleGallery } from "./VehicleGallery";
import { VehicleHeader } from "./VehicleHeader";
import { VehicleSpecs, buildVehicleSpecs } from "./VehicleSpecs";
import { VehicleFeatures } from "./VehicleFeatures";
import { VehicleSidebar } from "./VehicleSidebar";
import { VehicleMobileBar } from "./VehicleMobileBar";
import { EnquiryModal } from "./EnquiryModal";
import { VehicleComments } from "./VehicleComments";
import { recordListingEvent } from "@/lib/listings/actions";
import type { ListingCommentThread } from "@/types/comment";

export function VehicleDetailClient({
  listing,
  comments,
  liked,
  isLoggedIn,
  isOwner,
}: {
  listing: MarketplaceListing;
  comments: ListingCommentThread[];
  liked: boolean;
  isLoggedIn: boolean;
  isOwner: boolean;
}) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const title = `${listing.year} ${listing.make} ${listing.model}`;
  const phone = listing.profiles?.phone;
  const seller = sellerDisplayName(listing);
  const city = listing.profiles?.city;
  const address = listing.profiles?.address;

  useEffect(() => {
    const key = `khazu_view_${listing.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
    void recordListingEvent({ listingId: listing.id, eventType: "view" });
  }, [listing.id]);

  const onContact = (channel: "call" | "whatsapp") => {
    void recordListingEvent({
      listingId: listing.id,
      eventType: "contact",
      message: channel,
    });
    if (channel === "call" && phone) {
      window.location.href = `tel:${phone.replace(/\s/g, "")}`;
    }
    if (channel === "whatsapp" && phone) {
      const digits = phone.replace(/\D/g, "");
      window.open(
        `https://wa.me/${digits.startsWith("268") ? digits : `268${digits}`}`,
        "_blank",
      );
    }
  };

  const specs = buildVehicleSpecs(listing);
  const features = listing.features?.filter(Boolean) ?? [];
  const listedDate = new Date(listing.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-[#f7f6f4] min-h-dvh pb-24">
      <VehicleHeader
        listing={listing}
        title={title}
        city={city}
        listedDate={listedDate}
      />

      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-10">
            <VehicleGallery images={listing.images ?? []} alt={title} />

            <section>
              <Heading3 className=" font-bold mb-4">
                Key information
              </Heading3>
              <VehicleSpecs specs={specs} />
            </section>

            {listing.description && (
              <section className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
                <Heading3 className=" font-bold mb-3">
                  Seller notes
                </Heading3>
                <Body className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </Body>
              </section>
            )}

            {features.length > 0 && (
              <section>
                <Heading3 className=" font-bold mb-4">
                  Vehicle features
                </Heading3>
                <VehicleFeatures features={features} />
              </section>
            )}

            {(city || address) && (
              <section className="bg-white rounded-lg border border-gray-100 p-6 ">
                <Heading3 className="font-bold mb-3">
                  Location
                </Heading3>
                <div className="flex items-start gap-2 text-gray-700 font-medium">
                  <FaMapMarkerAlt className="text-[#CD2C58] mt-1" />
                  <div>
                    {address && <p>{address}</p>}
                    {city && <p className="text-gray-500">{city}, Eswatini</p>}
                  </div>
                </div>
              </section>
            )}

            <VehicleComments
              listingId={listing.id}
              comments={comments}
              likesCount={listing.likes_count}
              liked={liked}
              isLoggedIn={isLoggedIn}
              isOwner={isOwner}
            />
          </div>

          <div className="lg:col-span-4">
            <VehicleSidebar
              listing={listing}
              seller={seller}
              city={city}
              phone={phone}
              phoneRevealed={phoneRevealed}
              onRevealPhone={() => setPhoneRevealed(true)}
              onContact={onContact}
              onEnquireClick={() => setEnquiryOpen(true)}
            />
          </div>
        </div>
      </div>

      <VehicleMobileBar
        price={listing.price}
        phone={phone}
        onContact={onContact}
        onEnquireClick={() => setEnquiryOpen(true)}
      />

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        listingId={listing.id}
        listingTitle={title}
        sellerPhone={phone}
      />
    </div>
  );
}
