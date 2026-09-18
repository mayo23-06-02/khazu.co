import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getAdminOverviewData } from "@/lib/dashboard/admin";
import { AdminDashboardClient } from "@/components/khazu/AdminDashboardClient";

export default async function AdminDashboardPage() {
  await requireAdmin("/dashboard/admin");
  const data = await getAdminOverviewData();
  return <AdminDashboardClient data={data} />;
}
