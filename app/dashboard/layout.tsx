import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeRole } from "@/lib/auth/roles";
import { DashboardShell } from "@/components/khazu/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, business_name")
    .eq("id", user.id)
    .maybeSingle();

  const role = normalizeRole(profile?.role);
  const userName =
    profile?.full_name ||
    profile?.business_name ||
    user.email?.split("@")[0] ||
    "Khazu user";

  return (
    <DashboardShell role={role} userName={userName}>
      {children}
    </DashboardShell>
  );
}
