import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getAdminReports } from "@/lib/dashboard/admin";
import { AdminReportsView } from "@/components/khazu/AdminReportsView";

export default async function AdminReportsPage() {
  await requireAdmin("/dashboard/admin/reports");
  const rows = await getAdminReports();
  return <AdminReportsView rows={rows} />;
}
