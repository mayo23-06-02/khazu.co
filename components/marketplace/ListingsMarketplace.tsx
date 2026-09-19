"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Container,
  Grid,
  Button,
  EmptyState,
  PaginationControls,
} from "@/components/ui";
import { FaCar } from "react-icons/fa";
import { clsx } from "clsx";
import { KhazuListingCard } from "@/components/khazu/KhazuListingCard";
import { StockHeader } from "@/components/sections/stock-cars/StockHeader";
import { StockFilters } from "@/components/sections/stock-cars/StockFilters";
import { StockSortBar } from "@/components/sections/stock-cars/StockSortBar";
import type { MarketplaceListing } from "@/lib/marketplace/types";
import { toApifyCardListing } from "@/lib/marketplace/toApifyCard";

const defaultFilters = {
  make: "",
  model: "",
  minPrice: "",
  maxPrice: "",
  minYear: "",
  maxYear: "",
  fuel: "",
  transmission: "",
  bodyType: "",
  sellerType: "",
  minMileage: "",
  maxMileage: "",
  verifiedOnly: false,
  featuredOnly: false,
  condition: "",
  sellerId: "",
};

export function ListingsMarketplace({
  initialListings,
}: {
  initialListings: MarketplaceListing[];
}) {
  const searchParams = useSearchParams();
  const [listings] = useState(initialListings);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [search, setSearch] = useState("");

  const itemsPerPage = 12;

  useEffect(() => {
    const make = searchParams.get("make") || "";
    const model = searchParams.get("model") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const fuel = searchParams.get("fuel") || "";
    const bodyType =
      searchParams.get("type") || searchParams.get("bodyType") || "";
    const condition = searchParams.get("condition") || "";
    const sellerId = searchParams.get("sellerId") || "";

    if (
      make ||
      model ||
      minPrice ||
      maxPrice ||
      fuel ||
      bodyType ||
      condition ||
      sellerId
    ) {
      setFilters((prev) => ({
        ...prev,
        make,
        model,
        minPrice,
        maxPrice,
        fuel,
        bodyType,
        condition,
        sellerId,
      }));
    }
  }, [searchParams]);

  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.make.toLowerCase().includes(q) ||
          l.model.toLowerCase().includes(q) ||
          `${l.year} ${l.make} ${l.model}`.toLowerCase().includes(q),
      );
    }
    if (filters.make) {
      const q = filters.make.toLowerCase();
      result = result.filter(
        (l) =>
          l.make.toLowerCase().includes(q) ||
          l.model.toLowerCase().includes(q) ||
          `${l.year} ${l.make} ${l.model}`.toLowerCase().includes(q),
      );
    }
    if (filters.model) {
      const q = filters.model.toLowerCase();
      result = result.filter((l) => l.model.toLowerCase().includes(q));
    }
    if (filters.minPrice) {
      const min = Number(filters.minPrice);
      if (!Number.isNaN(min)) {
        result = result.filter((l) => Number(l.price) >= min);
      }
    }
    if (filters.maxPrice) {
      const max = Number(filters.maxPrice);
      if (!Number.isNaN(max)) {
        result = result.filter((l) => Number(l.price) <= max);
      }
    }
    if (filters.minYear) {
      const y = Number(filters.minYear);
      if (!Number.isNaN(y)) result = result.filter((l) => l.year >= y);
    }
    if (filters.maxYear) {
      const y = Number(filters.maxYear);
      if (!Number.isNaN(y)) result = result.filter((l) => l.year <= y);
    }
    if (filters.fuel) {
      const q = filters.fuel.toLowerCase();
      result = result.filter((l) =>
        (l.fuel_type || "").toLowerCase().includes(q),
      );
    }
    if (filters.transmission) {
      const q = filters.transmission.toLowerCase();
      result = result.filter((l) =>
        (l.transmission || "").toLowerCase().includes(q),
      );
    }
    if (filters.bodyType) {
      const q = filters.bodyType.toLowerCase();
      result = result.filter((l) =>
        (l.body_type || "").toLowerCase().includes(q),
      );
    }
    if (filters.condition) {
      const q = filters.condition.toLowerCase();
      // "used"/"new" map loosely to condition field or all
      if (q === "used" || q === "new") {
        // keep all unless condition explicitly set on listing
        result = result.filter(
          (l) =>
            !l.condition ||
            l.condition.toLowerCase().includes(q) ||
            q === "used",
        );
      } else {
        result = result.filter((l) =>
          (l.condition || "").toLowerCase().includes(q),
        );
      }
    }
    if (filters.sellerId) {
      result = result.filter((l) => l.seller_id === filters.sellerId);
    }
    if (filters.sellerType) {
      const q = filters.sellerType.toLowerCase();
      result = result.filter((l) =>
        l.seller_type.toLowerCase().includes(q === "personal" ? "individual" : q),
      );
    }
    if (filters.minMileage) {
      const m = Number(filters.minMileage);
      if (!Number.isNaN(m)) result = result.filter((l) => l.mileage >= m);
    }
    if (filters.maxMileage) {
      const m = Number(filters.maxMileage);
      if (!Number.isNaN(m)) result = result.filter((l) => l.mileage <= m);
    }
    if (filters.verifiedOnly) {
      result = result.filter((l) => l.is_verified);
    }
    if (filters.featuredOnly) {
      result = result.filter((l) => l.is_featured);
    }

    if (sortBy === "price_low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.year - a.year);
    } else {
      // featured first already from API; stable by created_at
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    return result;
  }, [listings, filters, search, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, search, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredListings.length / itemsPerPage),
  );
  const pageListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleFilterChange = (key: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ ...defaultFilters });
    setSearch("");
  };

  return (
    <>
      <StockHeader
        count={filteredListings.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleFilters={() => setShowFilters(!showFilters)}
        search={search}
        onSearchChange={setSearch}
      />

      <section className="py-6 bg-gray-200/65">
        <Container>
          <div className="grid grid-cols-1 max-w-[1920px] lg:grid-cols-12 gap-6">
            <div
              className={clsx(
                "lg:col-span-4",
                !showFilters && "hidden lg:block",
              )}
            >
              <StockFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
                onApplyMobile={() => setShowFilters(false)}
              />
            </div>

            <div className="lg:col-span-8">
              <StockSortBar
                sortBy={sortBy}
                onSortChange={setSortBy}
                resultCount={filteredListings.length}
              />

              {pageListings.length > 0 ? (
                <div
                  className={clsx(
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                      : "flex flex-col gap-4",
                  )}
                >
                  {pageListings.map((item) => (
                    <div
                      key={item.id}
                      className={viewMode === "list" ? "w-full" : ""}
                    >
                      <KhazuListingCard data={toApifyCardListing(item)} />
                    </div>
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <EmptyState
                  icon={<FaCar size={48} className="text-dark/20" />}
                  title="No cars listed yet"
                  description="Be the first to list a vehicle on Khazu."
                  action={
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => {
                        window.location.href = "/sell/upload";
                      }}
                    >
                      Sell your car
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  icon={<FaCar size={48} className="text-dark/20" />}
                  title="No cars found"
                  description="Try adjusting your filters or search terms."
                  action={
                    <Button variant="primary" size="md" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  }
                />
              )}

              {filteredListings.length > itemsPerPage && (
                <div className="mt-6">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
