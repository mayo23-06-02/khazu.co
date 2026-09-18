import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getAdminUsers } from "@/lib/dashboard/admin";
import { AdminUsersView } from "@/components/khazu/AdminUsersView";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; role?: string; status?: string }>;
}) {
  await requireAdmin("/dashboard/admin/users");
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const result = await getAdminUsers({
    page,
    search: params.search || "",
    roleFilter: params.role || undefined,
    statusFilter: (params.status as "active" | "suspended") || undefined,
  });

  return (
    <AdminUsersView
      result={result}
      search={params.search || ""}
      role={params.role || ""}
      status={params.status || ""}
    />
  );
}
