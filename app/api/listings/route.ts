import { NextResponse } from "next/server";
import { getActiveListings } from "@/lib/marketplace/listings";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let listings = await getActiveListings();

    const make = (searchParams.get("make") || "").toLowerCase();
    const fuel = (searchParams.get("fuel") || "").toLowerCase();
    const condition = (searchParams.get("condition") || "").toLowerCase();
    const transmission = (searchParams.get("transmission") || "").toLowerCase();
    const bodyType = (
      searchParams.get("bodyType") ||
      searchParams.get("type") ||
      ""
    ).toLowerCase();
    const maxPrice = searchParams.get("maxPrice");
    const minPrice = searchParams.get("minPrice");

    if (make) {
      listings = listings.filter(
        (l) =>
          l.make.toLowerCase().includes(make) ||
          l.model.toLowerCase().includes(make),
      );
    }
    if (fuel) {
      listings = listings.filter((l) =>
        (l.fuel_type || "").toLowerCase().includes(fuel),
      );
    }
    if (condition) {
      listings = listings.filter((l) =>
        (l.condition || "").toLowerCase().includes(condition),
      );
    }
    if (transmission) {
      listings = listings.filter((l) =>
        (l.transmission || "").toLowerCase().includes(transmission),
      );
    }
    if (bodyType) {
      listings = listings.filter((l) =>
        (l.body_type || "").toLowerCase().includes(bodyType),
      );
    }
    if (minPrice) {
      const min = Number(minPrice);
      if (!Number.isNaN(min)) {
        listings = listings.filter((l) => Number(l.price) >= min);
      }
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!Number.isNaN(max)) {
        listings = listings.filter((l) => Number(l.price) <= max);
      }
    }

    return NextResponse.json(listings);
  } catch (e) {
    console.error("GET /api/listings:", e);
    return NextResponse.json([], { status: 200 });
  }
}
