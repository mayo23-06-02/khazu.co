"use client";
import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Container,
  Navbar,
  Button,
  CarCard,
  Section,
  Grid,
  Stack,
  Flex,
  Heading1,
  Body,
  Divider,
  Badge,
} from "@/components/ui";
import { cars } from "@/lib/data/carData";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  MdFilterList,
  MdSearch,
  MdSort,
  MdGridView,
  MdViewList,
  MdRefresh,
} from "react-icons/md";

function toCarCardData(raw: (typeof cars)[number]) {
  const header = raw.vehicle_data.header;
  const parts = header.registrationYearMakeModel.split(" ");
  const year = parseInt(parts[0], 10) || new Date().getFullYear();
  const make = parts[1] || "Unknown";
  const model = header.variant || "Unknown";
  const price = parseInt(header.listingPrice.replace(/\D/g, ""), 10) || 0;
  const mileage = parseInt(
    raw.vehicle_data.summaryIcons
      .find((i) => i.text.toLowerCase().includes("km"))
      ?.text.replace(/\D/g, "") || "0",
    10,
  );
  const fuel =
    raw.vehicle_data.summaryIcons.find((i) =>
      ["Diesel", "Petrol", "Electric", "Hybrid"].includes(i.text),
    )?.text || "Unknown";
  const transmission =
    raw.vehicle_data.summaryIcons.find((i) =>
      ["Manual", "Automatic"].includes(i.text),
    )?.text || "Unknown";
  const bodyType =
    raw.vehicle_data.additionalInformation.find(
      (i) =>
        i &&
        ["Single cab", "Double cab", "SUV", "Hatchback", "Sedan", "Panel van"].includes(
          i.text,
        ),
    )?.text || "Unknown";
  const images =
    raw.vehicle_data.gallery.galleryImages?.map((g) => g.imageUrl).filter(Boolean) ??
    [];

  return {
    id: header.listingId.toString(),
    make,
    model,
    year,
    price,
    mileage,
    fuel,
    transmission,
    bodyType,
    location:
      raw.vehicle_data.listingSellerInformation?.sellerSuburbName || "Eswatini",
    images,
    image: images[0] || "",
    sellerType: "dealer" as const,
    valueScore: 85,
    conditionScore: 90,
    dealRating: "Good" as const,
    marketRank: 1,
  };
}

export default function ListingPage() {
  return (
    <Suspense fallback={null}>
      <ListingPageContent />
    </Suspense>
  );
}

function ListingPageContent() {
  const searchParams = useSearchParams();
  const initialMake = searchParams.get("make") || "All";

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMake, setSelectedMake] = useState<string>(initialMake);

  // Update state when URL changes
  useEffect(() => {
    const make = searchParams.get("make");
    if (make) {
      setSelectedMake(make);
    }
  }, [searchParams]);

  const carCards = useMemo(() => cars.map(toCarCardData), []);

  const makes = ["All", ...Array.from(new Set(carCards.map((c) => c.make)))];

  const filteredCars = useMemo(() => {
    return carCards.filter((car) => {
      const matchesSearch =
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMake = selectedMake === "All" || car.make === selectedMake;
      return matchesSearch && matchesMake;
    });
  }, [carCards, searchQuery, selectedMake]);

  return (
    <div className="min-h-dvh bg-cream/20">
      <Navbar
        logo={
          <h1 className="text-2xl font-display font-bold text-gray-800">
            Khazu
          </h1>
        }
        links={[
          { label: "Marketplace", href: "/" },
          { label: "Documentation", href: "/docs" },
        ]}
      />

      <Section className="bg-dark text-white py-12">
        <Container>
          <div className="max-w-2xl">
            <Badge variant="primary" className="mb-4">
              Inventory
            </Badge>
            <Heading1 className="text-white mb-4">
              Premium Vehicle Marketplace
            </Heading1>
            <Body className="text-white/60 text-lg">
              Explore {cars.length} verified listings across Eswatini. Every
              vehicle is scored for value and condition using our proprietary
              Khazu KPI engine.
            </Body>
          </div>
        </Container>
      </Section>

      <Container className="py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-lg p-6 border border-black/5 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-lg text-gray-800">
                  Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedMake("All");
                  }}
                >
                  <MdRefresh />
                </Button>
              </div>

              <Stack spacing="lg">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-800/40 mb-2 block">
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search make or model..."
                      className="w-full bg-cream/50 border border-black/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#CD2C58]/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <MdSearch
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-800/20"
                      size={20}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-800/40 mb-2 block">
                    Make
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {makes.map((make) => (
                      <button
                        key={make}
                        onClick={() => setSelectedMake(make)}
                        className={twMerge(
                          clsx(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                            selectedMake === make
                              ? "bg-dark text-white border-black"
                              : "bg-white text-gray-800/60 border-black/5 hover:border-black/20",
                          ),
                        )}
                      >
                        {make}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-800/40 mb-2 block">
                    Market Deal Rating
                  </label>
                  <div className="space-y-2">
                    {["Great", "Good", "Fair", "Overpriced"].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-black/10 text-[#CD2C58] focus:ring-[#CD2C58]"
                        />
                        <span className="text-sm text-gray-800/70 group-hover:text-gray-800 transition-colors">
                          {rating} Deals
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Divider />

                <div className="p-4 bg-[#CD2C58]/10 rounded-lg">
                  <p className="text-[10px] font-black text-[#CD2C58] uppercase tracking-widest mb-1">
                    Pro Tip
                  </p>
                  <p className="text-xs text-gray-800/70 leading-relaxed">
                    Vehicles with a <b>Value Score 80%</b> typically sell 3x
                    faster in the Mbabane market.
                  </p>
                </div>
              </Stack>
            </div>
          </aside>

          {/* Listings Area */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white p-4 rounded-lg border border-black/5 shadow-sm gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-800">
                  {filteredCars.length} results
                </span>
                <div className="flex items-center gap-1 bg-cream/50 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={twMerge(
                      clsx(
                        "p-2 rounded-md transition-all",
                        viewMode === "grid"
                          ? "bg-white shadow-sm text-[#CD2C58]"
                          : "text-gray-800/40 hover:text-gray-800",
                      ),
                    )}
                  >
                    <MdGridView size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={twMerge(
                      clsx(
                        "p-2 rounded-md transition-all",
                        viewMode === "list"
                          ? "bg-white shadow-sm text-[#CD2C58]"
                          : "text-gray-800/40 hover:text-gray-800",
                      ),
                    )}
                  >
                    <MdViewList size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-cream/50 rounded-lg border border-black/5 text-sm font-bold text-gray-800/60 cursor-pointer hover:bg-cream transition-colors">
                  <MdSort size={18} />
                  <span>Price: Low to High</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="hidden sm:flex items-center gap-2"
                >
                  <MdFilterList /> Filters
                </Button>
              </div>
            </div>

            {/* Grid */}
            {viewMode === "grid" ? (
              <Grid cols={3} gap="lg">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} {...car} />
                ))}
              </Grid>
            ) : (
              <Stack spacing="lg">
                {filteredCars.map((car) => (
                  <CarCard
                    key={car.id}
                    {...car}
                    className="flex-row aspect-auto"
                  />
                ))}
              </Stack>
            )}

            {filteredCars.length === 0 && (
              <div className="text-center py-20 bg-white rounded-lg border border-dashed border-black/10">
                <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdSearch size={32} className="text-gray-800/20" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-800">
                  No matches found
                </h3>
                <p className="text-gray-800/50 max-w-xs mx-auto mt-2">
                  Try adjusting your filters or search query to find what you're
                  looking for.
                </p>
                <Button
                  variant="outline"
                  className="mt-8"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedMake("All");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
