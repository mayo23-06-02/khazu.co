import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPersonalDashboardData } from "@/lib/dashboard/personal";
import { PersonalDashboardClient } from "@/components/khazu/PersonalDashboardClient";

export default async function PersonalDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard/personal");
  }

  const data = await getPersonalDashboardData(user.id);

  return <PersonalDashboardClient data={data} />;
}
