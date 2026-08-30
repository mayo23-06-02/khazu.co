// app/page.tsx
import { PublicHeader, PublicFooter, SellYourCarAd } from "@/components/ui";
import { MainHero } from "@/components/ui/Hero/MainHero";
import { BrowseByManufacturer } from "@/components/sections/BrowseByManufacturer";
import { BrowseByBodyType } from "@/components/sections/BrowseByBodyType";
import { VehicleShowcase } from "@/components/sections/VehicleShowcase";
import { PopularModels } from "@/components/sections/PopularModels";
import { FaqSection } from "@/components/sections/FaqSection";
import {
  getActiveListingsCount,
  getRecentListings,
  getTopRatedListings,
  getTrendingListings,
} from "@/lib/marketplace/listings";
import { JsonLd, organizationJsonLd } from "@/lib/seo/jsonLd";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [listingCount, recentListings, topRatedListings, trendingListings] =
    await Promise.all([
      getActiveListingsCount(),
      getRecentListings(),
      getTopRatedListings(),
      getTrendingListings(),
    ]);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      <PublicHeader />

      <MainHero listingCount={listingCount} />

      <SellYourCarAd />

      {/* ─── Browse by Body Type ─── */}
      <BrowseByBodyType />

      {/* ─── Recently Added / Top Rated / Trending ─── */}
      <VehicleShowcase
        recent={recentListings}
        topRated={topRatedListings}
        trending={trendingListings}
      />

      {/* ─── Browse by Car Manufacturer ─── */}
      <BrowseByManufacturer />

      {/* ─── Popular Used Car Models ─── */}
      <PopularModels />

      {/* ─── FAQ Section ─── */}
      <FaqSection />

      <PublicFooter />
    </>
  );
}
