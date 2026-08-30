import type { MarketplaceListing } from "@/lib/marketplace/listings";
import { sellerDisplayName } from "@/lib/marketplace/format";
import { absoluteUrl, siteDescription, siteName, siteUrl } from "./site";

/**
 * Renders a JSON-LD block. Structured data is what earns rich results in
 * Google (price, mileage and availability shown directly in the listing),
 * which matters more for a marketplace than any meta tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is our own server-built object, not user markup. We still
      // escape `<` so a listing description can never break out of the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\u003c"),
      }}
    />
  );
}

/** Organization + site-level search box, for the home page. */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        logo: absoluteUrl("/logo.svg"),
        areaServed: { "@type": "Country", name: "Eswatini" },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en",
      },
    ],
  };
}

/**
 * A vehicle offer. Google reads `Car` (a subtype of Product) for vehicle
 * listings — price, mileage, fuel and transmission all surface in results.
 */
export function vehicleJsonLd(
  listing: MarketplaceListing,
): Record<string, unknown> {
  const name = `${listing.year} ${listing.make} ${listing.model}`;
  const url = absoluteUrl(`/deals/${listing.id}`);
  const images = (listing.images ?? []).filter(Boolean);

  const vehicle: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Car",
    "@id": `${url}#vehicle`,
    url,
    name,
    brand: { "@type": "Brand", name: listing.make },
    model: listing.model,
    vehicleModelDate: String(listing.year),
    productionDate: String(listing.year),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "SZL",
      price: listing.price,
      itemCondition:
        listing.condition?.toLowerCase() === "new"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
      availability:
        listing.status === "active"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      seller: {
        "@type": listing.seller_type === "dealer" ? "AutoDealer" : "Person",
        name: sellerDisplayName(listing),
      },
    },
  };

  if (images.length) vehicle.image = images;
  if (listing.description) vehicle.description = listing.description;
  if (listing.colour) vehicle.color = listing.colour;
  if (listing.body_type) vehicle.bodyType = listing.body_type;
  if (listing.doors) vehicle.numberOfDoors = listing.doors;
  if (listing.reg_number) vehicle.vehicleIdentificationNumber = listing.reg_number;

  if (listing.mileage != null) {
    vehicle.mileageFromOdometer = {
      "@type": "QuantitativeValue",
      value: listing.mileage,
      unitCode: "KMT", // UN/CEFACT code for kilometre
    };
  }
  if (listing.fuel_type) {
    vehicle.fuelType = listing.fuel_type;
  }
  if (listing.transmission) {
    vehicle.vehicleTransmission = listing.transmission;
  }
  if (listing.seats) {
    vehicle.seatingCapacity = {
      "@type": "QuantitativeValue",
      value: listing.seats,
    };
  }
  if (listing.power_kw) {
    vehicle.vehicleEngine = {
      "@type": "EngineSpecification",
      enginePower: {
        "@type": "QuantitativeValue",
        value: listing.power_kw,
        unitCode: "KWT",
      },
      ...(listing.engine_size ? { name: listing.engine_size } : {}),
    };
  }

  return vehicle;
}

/** Breadcrumb trail, so Google shows "Khazu › Cars for Sale › 2021 Toyota Hilux". */
export function breadcrumbJsonLd(
  trail: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
