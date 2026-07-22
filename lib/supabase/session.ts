import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  getDashboardPath,
  isAdminRole,
  isDealerRole,
  normalizeRole,
} from "@/lib/auth/roles";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: do not add logic between createServerClient and getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const isAuthPage =
    path.startsWith("/auth/login") ||
    path.startsWith("/auth/register") ||
    path.startsWith("/login") ||
    path.startsWith("/signup");

  const isDashboard = path.startsWith("/dashboard");

  // Unauthenticated users cannot access dashboard
  if (!user && isDashboard) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Authenticated users on auth pages → send to their dashboard
  if (user && isAuthPage) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = normalizeRole(profile?.role);
    const url = request.nextUrl.clone();
    url.pathname = getDashboardPath(role);
    return NextResponse.redirect(url);
  }

  // Role-based dashboard protection
  if (user && isDashboard) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = normalizeRole(profile?.role);

    if (path.startsWith("/dashboard/admin") && !isAdminRole(role)) {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardPath(role);
      return NextResponse.redirect(url);
    }

    if (
      path.startsWith("/dashboard/dealer") &&
      !isDealerRole(role) &&
      !isAdminRole(role)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardPath(role);
      return NextResponse.redirect(url);
    }

    // Root /dashboard → role home
    if (path === "/dashboard" || path === "/dashboard/") {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardPath(role);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
