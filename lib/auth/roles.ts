import { UserRole } from "@/types/user";

/** Roles stored in Supabase profiles.role */
export type DbRole = "individual" | "dealer" | "admin";

/** Normalize any legacy or DB role string into a UserRole for the UI */
export function normalizeRole(role: string | null | undefined): UserRole {
  if (!role) return UserRole.PERSONAL;
  const r = role.toLowerCase();
  if (r === "dealer") return UserRole.DEALER;
  if (r === "admin") return UserRole.ADMIN;
  // individual | personal | default
  return UserRole.PERSONAL;
}

/** Map UI role to DB role enum */
export function toDbRole(role: UserRole | string): DbRole {
  const r = String(role).toLowerCase();
  if (r === "dealer") return "dealer";
  if (r === "admin") return "admin";
  return "individual";
}

export function getDashboardPath(role: UserRole | string | null | undefined): string {
  const normalized = normalizeRole(typeof role === "string" ? role : role ?? undefined);
  switch (normalized) {
    case UserRole.ADMIN:
      return "/dashboard/admin";
    case UserRole.DEALER:
      return "/dashboard/dealer";
    default:
      return "/dashboard/personal";
  }
}

export function isAdminRole(role: UserRole | string | null | undefined): boolean {
  return normalizeRole(typeof role === "string" ? role : role ?? undefined) === UserRole.ADMIN;
}

export function isDealerRole(role: UserRole | string | null | undefined): boolean {
  return normalizeRole(typeof role === "string" ? role : role ?? undefined) === UserRole.DEALER;
}
