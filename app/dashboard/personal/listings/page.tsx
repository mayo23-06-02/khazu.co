import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { getSellerListings } from "@/lib/listings/queries";
import { PersonalListingsView } from "@/components/khazu/PersonalListingsView";

export default async function PersonalListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard/personal/listings");
  }

  const listings = await getSellerListings(user.id);

  return (
    <Container className="py-8 max-w-[1400px]">
      <PersonalListingsView listings={listings} />
    </Container>
  );
}
