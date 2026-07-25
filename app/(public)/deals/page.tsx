import Link from "next/link";
import {
  Container,
  Heading1,
  Badge,
  Body,
  Flex,
  Separator,
  PublicHeader,
  PublicFooter,
} from "@/components/ui";
import { KhazuListingCard } from "@/components/khazu/KhazuListingCard";
import { getActiveListings } from "@/lib/marketplace/listings";
import { toApifyCardListing } from "@/lib/marketplace/toApifyCard";

export const dynamic = "force-dynamic";

export default async function KhazuDealsPage() {
  const listings = await getActiveListings();
  // "Deals" = featured first already; also surface lowest-priced slice as deals vibe
  const deals = [...listings].sort(
    (a, b) => Number(a.price) - Number(b.price),
  );

  return (
    <>
      <PublicHeader />
      <main className="bg-cream/30 min-h-dvh py-8">
        <Container>
          <div className="flex items-center gap-4 mb-8">
            <Heading1 className="text-dark">Best Deals on Khazu</Heading1>
            <Badge variant="primary" className="text-white bg-[#cd2c58]">
              Live
            </Badge>
          </div>

          <Flex wrap items="center" className="gap-6 mb-8 text-sm text-dark/60">
            <span>📦 {deals.length} cars</span>
            <Separator orientation="vertical" className="h-4" />
            <span>⚡ From live marketplace inventory</span>
          </Flex>

          {deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((item) => (
                <KhazuListingCard
                  key={item.id}
                  data={toApifyCardListing(item)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <Body muted>No live deals yet. Check back soon.</Body>
              <Link
                href="/listings"
                className="text-[#CD2C58] font-bold underline"
              >
                Browse marketplace
              </Link>
            </div>
          )}
        </Container>
      </main>
      <PublicFooter />
    </>
  );
}
