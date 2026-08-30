import Link from "next/link";
import {
  PublicHeader,
  PublicFooter,
  Container,
  Heading2,
  Body,
  Button,
} from "@/components/ui";
import type { Metadata } from "next";
import { getListingById } from "@/lib/marketplace/listings";
import { formatMileage, formatSzl } from "@/lib/marketplace/format";
import { getListingComments, hasLikedListing } from "@/lib/comments/queries";
import { createClient } from "@/lib/supabase/server";
import { VehicleDetailClient } from "@/components/deals/VehicleDetailClient";
import { absoluteUrl, truncateDescription } from "@/lib/seo/site";
import { JsonLd, breadcrumbJsonLd, vehicleJsonLd } from "@/lib/seo/jsonLd";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    return {
      title: "Listing not found",
      robots: { index: false, follow: true },
    };
  }

  const name = `${listing.year} ${listing.make} ${listing.model}`;
  const path = `/deals/${listing.id}`;
  const description = truncateDescription(
    listing.description ||
      `${name} for sale in Eswatini — ${formatMileage(listing.mileage)}, ${
        listing.transmission || "manual"
      }, ${listing.fuel_type || "petrol"}. ${formatSzl(listing.price)} on Khazu.`,
  );
  const images = (listing.images ?? []).filter(Boolean).slice(0, 4);

  return {
    // The root layout appends "| Khazu" via its title template.
    title: `${name} for Sale`,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      title: `${name} — ${formatSzl(listing.price)}`,
      description,
      url: absoluteUrl(path),
      images: images.map((url) => ({ url, alt: name })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${formatSzl(listing.price)}`,
      description,
      images,
    },
    // A sold listing stays reachable for anyone holding the link, but should
    // stop competing for search traffic against cars still on sale.
    robots:
      listing.status === "active"
        ? { index: true, follow: true }
        : { index: false, follow: true },
  };
}

export default async function DealDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    return (
      <>
        <PublicHeader />
        <Container className="py-20 text-center">
          <Heading2>Listing not found</Heading2>
          <Body className="mt-4 mb-8 text-gray-500">
            This vehicle may have been sold or removed.
          </Body>
          <Link href="/listings">
            <Button variant="primary">Back to Marketplace</Button>
          </Link>
        </Container>
        <PublicFooter />
      </>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [comments, liked] = await Promise.all([
    getListingComments(listing.id),
    user ? hasLikedListing(listing.id, user.id) : Promise.resolve(false),
  ]);

  return (
    <>
      <JsonLd data={vehicleJsonLd(listing)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Cars for Sale", path: "/listings" },
          {
            name: `${listing.year} ${listing.make} ${listing.model}`,
            path: `/deals/${listing.id}`,
          },
        ])}
      />
      <PublicHeader />
      <VehicleDetailClient
        listing={listing}
        comments={comments}
        liked={liked}
        isLoggedIn={!!user}
        isOwner={user?.id === listing.seller_id}
      />
      <PublicFooter />
    </>
  );
}
