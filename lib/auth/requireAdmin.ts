import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeRole, isAdminRole, getDashboardPath } from "@/lib/auth/roles";

/**
 * Guards an admin page: redirects to /auth/login if unauthenticated, or to
 * the caller's real dashboard if authenticated but not an admin. Call at the
 * top of every app/dashboard/admin/**\/page.tsx server component.
 */
export async function requireAdmin(nextPath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(nextPath)}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = normalizeRole(profile?.role);
  if (!isAdminRole(role)) {
    redirect(getDashboardPath(role));
  }

  return user;
}
