import type { ApifyListing } from "@/lib/data/apifyData";
import type { MarketplaceListing } from "./types";
import { formatMileage, formatSzl, sellerDisplayName } from "./format";

/** Sellers type make/model in all sorts of casing ("toyota", "BMW", "vw") —
 * title-case each word for display without touching the stored value. */
function titleCase(value: string): string {
  return value
    .split(" ")
    .map((word) =>
      word.length > 0
        ? word[0]!.toUpperCase() + word.slice(1).toLowerCase()
        : word,
    )
    .join(" ");
}

/**
 * Maps a Supabase marketplace listing into the ApifyListing shape
 * expected by the existing KhazuListingCard (no card UI changes).
 */
export function toApifyCardListing(listing: MarketplaceListing): ApifyListing {
  const make = titleCase(listing.make);
  const model = titleCase(listing.model);
  const yearMakeModel = `${listing.year} ${make} ${model}`;
  const engine =
    listing.engine_size ||
    (listing.power_kw != null ? `${listing.power_kw} kW` : "—");

  const transmission =
    listing.transmission
      ? listing.transmission.charAt(0).toUpperCase() +
        listing.transmission.slice(1).toLowerCase()
      : "Automatic";

  const fuel = listing.fuel_type
    ? listing.fuel_type.charAt(0).toUpperCase() +
      listing.fuel_type.slice(1).toLowerCase()
    : "Petrol";

  // KhazuListingCard looks for exact "Manual" | "Automatic" and fuel labels
  const txNorm = /auto|cvt/i.test(transmission)
    ? "Automatic"
    : /manual/i.test(transmission)
      ? "Manual"
      : transmission;

  const fuelNorm = ["Diesel", "Petrol", "Electric", "Hybrid"].find(
    (f) => f.toLowerCase() === fuel.toLowerCase(),
  ) || fuel;

  const monthly =
    listing.accepts_installments && listing.installment_months
      ? Math.round(
          Number(listing.price) / Math.max(listing.installment_months, 1),
        )
      : null;

  const hasPriceDrop =
    listing.previous_price != null &&
    Number(listing.previous_price) > Number(listing.price);
  const priceDropPercent = hasPriceDrop
    ? Math.round(
        ((Number(listing.previous_price) - Number(listing.price)) /
          Number(listing.previous_price)) *
          100,
      )
    : undefined;

  return {
    url: `/deals/${listing.id}`,
    vehicle_data: {
      header: {
        // Card links to /deals/${listingId}; UUID string is fine at runtime
        listingId: listing.id as unknown as number,
        registrationYearMakeModel: yearMakeModel,
        variant:
          [listing.engine_size, listing.body_type, listing.colour]
            .filter(Boolean)
            .join(" · ") || model,
        listingPrice: formatSzl(listing.price),
        previousListingPrice: hasPriceDrop
          ? formatSzl(listing.previous_price)
          : undefined,
        priceDropPercent,
        isSponsored: listing.is_featured,
      },
      priceInformation: {
        indicators: {
          marketPriceData: {
            description: listing.negotiable ? "Negotiable" : "",
          },
        },
        repaymentPrice: {
          estimatedRepayment: monthly
            ? formatSzl(monthly).replace("SZL ", "SZL ")
            : "",
          deposit:
            listing.deposit_amount != null
              ? formatSzl(listing.deposit_amount)
              : "",
          term: listing.installment_months ?? 0,
          rate: 8.9,
        },
      },
      summaryIcons: [
        { text: listing.condition === "new" ? "New" : "Used" },
        { text: String(listing.year) },
        { text: formatMileage(listing.mileage) },
        { text: txNorm },
        { text: fuelNorm },
        { text: engine },
      ],
      additionalInformation: [
        listing.body_type ? { text: listing.body_type } : null,
        listing.colour ? { text: listing.colour } : null,
      ],
      listingSpecifications: {
        specificationCategories: [
          {
            categoryItems: [
              listing.engine_size ? { value: listing.engine_size } : null,
            ],
          },
          {
            categoryItems: [
              listing.engine_size ? { value: listing.engine_size } : null,
            ],
          },
        ],
      },
      description: listing.description || "",
      listingDealer: {
        name: sellerDisplayName(listing),
        rating: { score: 0, ratingCount: 0 },
      },
      listingSellerInformation: {
        sellerSuburbName: listing.profiles?.city || "Eswatini",
      },
      gallery: {
        galleryImages: (listing.images?.length
          ? listing.images
          : [
              "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80",
            ]
        ).map((imageUrl) => ({ imageUrl })),
      },
    },
  };
}
