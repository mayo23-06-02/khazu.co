import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getAdminPayments } from "@/lib/dashboard/admin";
import { AdminPaymentsView } from "@/components/khazu/AdminPaymentsView";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  await requireAdmin("/dashboard/admin/payments");
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const result = await getAdminPayments({
    page,
    statusFilter: params.status || undefined,
  });

  return <AdminPaymentsView result={result} status={params.status || ""} />;
}
