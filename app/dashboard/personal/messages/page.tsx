import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEnquiriesForSeller } from "@/lib/enquiries/queries";
import { EnquiriesView } from "@/components/khazu/EnquiriesView";

export default async function PersonalMessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard/personal/messages");
  }

  const enquiries = await getEnquiriesForSeller(user.id);

  return <EnquiriesView enquiries={enquiries} />;
}
