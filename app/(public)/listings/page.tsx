import { Suspense } from "react";
import { PublicHeader, PublicFooter } from "@/components/ui";
import { ListingsSellBanner } from "@/components/ui/Ads/ListingsSellBanner/ListingsSellBanner";
import { getActiveListings } from "@/lib/marketplace/listings";
import { ListingsMarketplace } from "@/components/marketplace/ListingsMarketplace";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Cars for Sale in Eswatini",
  description:
    "Browse every car for sale on Khazu — filter used and new vehicles by make, model, price, body type, fuel and transmission.",
  alternates: { canonical: absoluteUrl("/listings") },
  openGraph: {
    title: "Cars for Sale in Eswatini | Khazu",
    description:
      "Browse every car for sale on Khazu — filter used and new vehicles by make, model, price, body type, fuel and transmission.",
    url: absoluteUrl("/listings"),
  },
};

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
