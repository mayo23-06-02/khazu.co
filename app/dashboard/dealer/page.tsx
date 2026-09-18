import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDealerDashboardData } from "@/lib/dashboard/dealer";
import { DealerDashboardClient } from "@/components/khazu/DealerDashboardClient";

export default async function DealerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard/dealer");
  }

  const data = await getDealerDashboardData(user.id);

  return <DealerDashboardClient data={data} />;
}
