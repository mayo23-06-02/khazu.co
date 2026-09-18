import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSellerListings } from "@/lib/listings/queries";
import { DealerListingsView } from "@/components/khazu/DealerListingsView";

export default async function DealerListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard/dealer/listings");
  }

  const listings = await getSellerListings(user.id);

  return <DealerListingsView listings={listings} />;
}
