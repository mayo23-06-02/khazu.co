import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getAdminFraudFlags } from "@/lib/dashboard/admin";
import { AdminFraudView } from "@/components/khazu/AdminFraudView";

export default async function AdminFraudPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  await requireAdmin("/dashboard/admin/fraud");
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const result = await getAdminFraudFlags({
    page,
    statusFilter: (params.status as "open" | "dismissed" | "actioned") || undefined,
  });

  return <AdminFraudView result={result} status={params.status || ""} />;
}
