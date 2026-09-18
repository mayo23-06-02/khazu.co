import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getAdminListings } from "@/lib/dashboard/admin";
import { AdminListingsView } from "@/components/khazu/AdminListingsView";

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; moderation?: string }>;
}) {
  await requireAdmin("/dashboard/admin/listings");
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const result = await getAdminListings({
    page,
    search: params.search || "",
    moderationFilter:
      (params.moderation as "pending" | "approved" | "rejected") || undefined,
  });

  return (
    <AdminListingsView
      result={result}
      search={params.search || ""}
      moderation={params.moderation || ""}
    />
  );
}
