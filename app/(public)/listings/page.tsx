import { Suspense } from "react";
import { PublicHeader, PublicFooter } from "@/components/ui";
import { ListingsSellBanner } from "@/components/ui/Ads/ListingsSellBanner/ListingsSellBanner";
import { getActiveListings } from "@/lib/marketplace/listings";
import { ListingsMarketplace } from "@/components/marketplace/ListingsMarketplace";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const listings = await getActiveListings();

  return (
    <>
      <PublicHeader />
      <ListingsSellBanner />
      <Suspense
        fallback={
          <div className="py-20 text-center text-gray-400 font-medium">
            Loading marketplace…
          </div>
        }
      >
        <ListingsMarketplace initialListings={listings} />
      </Suspense>
      <PublicFooter />
    </>
  );
}
