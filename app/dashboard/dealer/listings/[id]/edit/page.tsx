import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { EditListingForm } from "@/components/khazu/EditListingForm";
import type { Listing } from "@/types/listing";

export default async function DealerEditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=/dashboard/dealer/listings/${id}/edit`);
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("seller_id", user.id)
    .maybeSingle<Listing>();

  if (!listing) notFound();

  return (
    <Container className="py-8 max-w-3xl">
      <EditListingForm listing={listing} backHref="/dashboard/dealer/listings" />
    </Container>
  );
}
