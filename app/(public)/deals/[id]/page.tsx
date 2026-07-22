import Link from "next/link";
import {
  PublicHeader,
  PublicFooter,
  Container,
  Heading2,
  Body,
  Button,
} from "@/components/ui";
import { getListingById } from "@/lib/marketplace/listings";
import { getListingComments, hasLikedListing } from "@/lib/comments/queries";
import { createClient } from "@/lib/supabase/server";
import { VehicleDetailClient } from "@/components/deals/VehicleDetailClient";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) return { title: "Listing not found | Khazu" };
  return {
    title: `${listing.year} ${listing.make} ${listing.model} | Khazu`,
    description:
      listing.description?.slice(0, 160) ||
      `${listing.year} ${listing.make} ${listing.model} for sale on Khazu`,
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
