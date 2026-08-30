// app/page.tsx
import { PublicHeader, PublicFooter, SellYourCarAd } from "@/components/ui";
import { MainHero } from "@/components/ui/Hero/MainHero";
import { BrowseByManufacturer } from "@/components/sections/BrowseByManufacturer";
import { BrowseByBodyType } from "@/components/sections/BrowseByBodyType";
import { RecentListings } from "@/components/sections/RecentListings";
import { PopularModels } from "@/components/sections/PopularModels";
import { FaqSection } from "@/components/sections/FaqSection";
import { getSponsoredDealerListings } from "@/lib/marketplace/listings";
import { JsonLd, organizationJsonLd } from "@/lib/seo/jsonLd";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const sponsoredListings = await getSponsoredDealerListings();

  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      <PublicHeader />

      <MainHero />

      <SellYourCarAd />

      {/* ─── Browse by Body Type ─── */}
      <BrowseByBodyType />

      {/* ─── Recent Listings ─── */}
      <RecentListings sponsoredListings={sponsoredListings} />

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
