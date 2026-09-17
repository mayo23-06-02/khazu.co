// app/page.tsx
import { PublicHeader, PublicFooter, SellYourCarAd } from "@/components/ui";
import { MainHero } from "@/components/ui/Hero/MainHero";
import { BrowseByManufacturer } from "@/components/sections/BrowseByManufacturer";
import { BrowseByBodyType } from "@/components/sections/BrowseByBodyType";
import { PopularModels } from "@/components/sections/PopularModels";
import { FaqSection } from "@/components/sections/FaqSection";
import { getActiveListingsCount } from "@/lib/marketplace/listings";
import { getDealerCount } from "@/lib/marketplace/dealers";
import { JsonLd, organizationJsonLd } from "@/lib/seo/jsonLd";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [listingCount, dealerCount] = await Promise.all([
    getActiveListingsCount(),
    getDealerCount(),
  ]);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      <PublicHeader />

      <MainHero listingCount={listingCount} dealerCount={dealerCount} />

      <SellYourCarAd />

      {/* ─── Browse by Body Type ─── */}
      <BrowseByBodyType />

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
