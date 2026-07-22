"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  Flex,
  Button,
  Body,
  Heading1,
} from "@/components/ui";
import { FaChevronRight } from "react-icons/fa";
import { KhazuListingCard } from "@/components/khazu/KhazuListingCard";
import { toApifyCardListing } from "@/lib/marketplace/toApifyCard";
import type { MarketplaceListing } from "@/lib/marketplace/types";

const DISPLAY_COUNT = 8;
const ROTATE_INTERVAL_MS = 20_000;

function pickRandom<T>(pool: T[], count: number): T[] {
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export function RecentListings({
  sponsoredListings,
}: {
  sponsoredListings: MarketplaceListing[];
}) {
  // Deterministic first paint (matches the server-rendered markup); the
  // client re-randomizes right after mount, and again every 20s.
  const [visible, setVisible] = useState(() =>
    sponsoredListings.slice(0, DISPLAY_COUNT),
  );

  useEffect(() => {
    if (sponsoredListings.length === 0) return;

    const rotate = () =>
      setVisible(pickRandom(sponsoredListings, DISPLAY_COUNT));

    // Defer the first rotation out of the synchronous effect body — it
    // still runs immediately after mount, but as a subscription callback
    // rather than a direct render-triggered setState.
    const initial = setTimeout(rotate, 0);
    const id = setInterval(rotate, ROTATE_INTERVAL_MS);

    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, [sponsoredListings]);

  const recentCars = visible.map(toApifyCardListing);

  return (
    <section className="py-10 md:py-14 bg-gray-200/65  ">
      <div className="max-w-[1200px] mx-auto">
        <Flex justify="between" items="center" className="mb-6">
          <Heading1>Recent Listings</Heading1>
          <Button variant="primary" size="sm" as={Link} href="/listings">
            View All <FaChevronRight size={12} className="ml-1" />
          </Button>
        </Flex>
      </div>
      <Container maxWidth="full" className="">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid  grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCars.length > 0 ? (
              recentCars.map((car) => (
                <KhazuListingCard
                  key={car.vehicle_data.header.listingId}
                  data={car}
                  isAd
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-800/40">
                <Body>No recent listings available.</Body>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
