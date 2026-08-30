"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Container, Flex, Button, Body, Heading1 } from "@/components/ui";
import { KhazuListingCard } from "@/components/khazu/KhazuListingCard";
import { toApifyCardListing } from "@/lib/marketplace/toApifyCard";
import type { MarketplaceListing } from "@/lib/marketplace/types";

type TabKey = "recent" | "topRated" | "trending";

const TABS: { key: TabKey; label: string }[] = [
  { key: "recent", label: "Recently Added" },
  { key: "topRated", label: "Top Rated" },
  { key: "trending", label: "Trending" },
];

// One peeking card hints there's more to scroll: 1.2 visible on mobile,
// 2.2 on tablet, 3.2 on desktop.
const CARD_WIDTH_CLASS = "w-[83.3333%] md:w-[45.4545%] lg:w-[31.25%]";

export function VehicleShowcase({
  recent,
  topRated,
  trending,
}: {
  recent: MarketplaceListing[];
  topRated: MarketplaceListing[];
  trending: MarketplaceListing[];
}) {
  const [active, setActive] = useState<TabKey>("recent");
  const trackRef = useRef<HTMLDivElement>(null);

  const listingsByTab: Record<TabKey, MarketplaceListing[]> = {
    recent,
    topRated,
    trending,
  };

  const cars = listingsByTab[active].map(toApifyCardListing);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const amount = (card?.offsetWidth ?? track.clientWidth) + 16; // + gap-4
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  function selectTab(tab: TabKey) {
    setActive(tab);
    trackRef.current?.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
  }

  return (
    <section className="py-10 md:py-14 bg-gray-200/65">
      <div className="max-w-[1200px] mx-auto px-4">
        <Flex justify="between" items="center" wrap gap="md" className="mb-6">
          <Heading1>Explore Vehicles</Heading1>
          <Button variant="primary" size="sm" as={Link} href="/listings">
            View All <FaChevronRight size={12} className="ml-1" />
          </Button>
        </Flex>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => selectTab(tab.key)}
              className={twMerge(
                "shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border",
                active === tab.key
                  ? "bg-dark text-white border-dark"
                  : "bg-white text-gray-600 border-gray-200 hover:border-dark/30",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <Container maxWidth="full">
        <div className="max-w-[1200px] mx-auto relative">
          {cars.length > 0 ? (
            <>
              <div
                ref={trackRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-2 px-4 sm:px-0"
              >
                {cars.map((car) => (
                  <div
                    key={car.vehicle_data.header.listingId}
                    className={twMerge(CARD_WIDTH_CLASS, "shrink-0 snap-start")}
                  >
                    <KhazuListingCard data={car} isAd />
                  </div>
                ))}
              </div>

              <button
                type="button"
                aria-label="Previous vehicles"
                onClick={() => scrollByCard(-1)}
                className="hidden lg:flex items-center justify-center absolute top-1/2 -left-5 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 hover:bg-gray-50"
              >
                <FaChevronLeft size={14} />
              </button>
              <button
                type="button"
                aria-label="Next vehicles"
                onClick={() => scrollByCard(1)}
                className="hidden lg:flex items-center justify-center absolute top-1/2 -right-5 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 hover:bg-gray-50"
              >
                <FaChevronRight size={14} />
              </button>
            </>
          ) : (
            <div className="text-center py-8 text-gray-800/40">
              <Body>No vehicles to show yet.</Body>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
