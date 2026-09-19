"use client";

import { useRouter } from "next/navigation";
import {
  Container,
  Heading1,
  Body,
  Grid,
  Card,
  Select,
  DataTable,
  PaginationControls,
  EmptyState,
} from "@/components/ui";
import { PaymentStatusBadge } from "@/components/ui/Admin/PaymentStatusBadge/PaymentStatusBadge";
import { StatsCard } from "@/components/khazu/StatsCard/StatsCard";
import { FaMoneyBillWave, FaCreditCard, FaTriangleExclamation } from "react-icons/fa6";
import type { AdminPaymentRow, PaginatedResult } from "@/types/dashboard";
import { formatSzl } from "@/lib/marketplace/format";
import { formatCompactNumber } from "@/lib/dashboard/format";

function buildQuery(params: Record<string, string>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) usp.set(k, v);
  });
  const qs = usp.toString();
  return qs ? `/dashboard/admin/payments?${qs}` : "/dashboard/admin/payments";
}

/** subscription_status → PaymentStatusBadge's paid/pending/failed/refunded vocabulary. */
function toPaymentStatus(status: string): "paid" | "pending" | "failed" | "refunded" {
  if (status === "active" || status === "trialing") return "paid";
  if (status === "pending") return "pending";
  if (status === "failed") return "failed";
  return "refunded"; // expired / cancelled
}

export function AdminPaymentsView({
  result,
  status,
}: {
  result: PaginatedResult<AdminPaymentRow>;
  status: string;
}) {
  const router = useRouter();

  const navigate = (overrides: Record<string, string>) => {
    router.push(buildQuery({ status, page: "1", ...overrides }));
  };

  const activeCount = result.rows.filter((r) => r.status === "active").length;
  const failedCount = result.rows.filter((r) => r.status === "failed").length;
  const totalRevenue = result.rows.reduce((sum, r) => sum + r.priceSzl, 0);

  return (
    <Container className="py-8 max-w-7xl">
      <div className="mb-8">
        <Heading1 className="text-3xl mb-2">Payments</Heading1>
        <Body muted>Subscription revenue and billing activity.</Body>
      </div>

      <Grid cols={1} md={3} gap="lg" className="mb-8">
        <StatsCard
          title="Revenue (this page)"
          value={formatSzl(totalRevenue)}
          icon={<FaMoneyBillWave size={20} />}
        />
        <StatsCard
          title="Active Subscriptions"
          value={formatCompactNumber(activeCount)}
          icon={<FaCreditCard size={20} />}
        />
        <StatsCard
          title="Failed Payments"
          value={formatCompactNumber(failedCount)}
          icon={<FaTriangleExclamation size={20} />}
          iconBgClass="bg-danger"
        />
      </Grid>

      <Card padding="none" elevated="sm" className="overflow-hidden">
        <div className="p-4 border-b border-line">
          <Select
            value={status}
            onChange={(e) => navigate({ status: e.target.value })}
            options={[
              { value: "", label: "All statuses" },
              { value: "active", label: "Active" },
              { value: "trialing", label: "Trialing" },
              { value: "pending", label: "Pending" },
              { value: "failed", label: "Failed" },
              { value: "expired", label: "Expired" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            className="sm:max-w-[200px]"
          />
        </div>

        {result.rows.length === 0 ? (
          <EmptyState
            icon={<FaCreditCard size={18} />}
            title="No payments found"
            description="Try a different filter."
          />
        ) : (
          <DataTable
            data={result.rows}
            columns={[
              { key: "userName", label: "User" },
              { key: "planName", label: "Plan" },
              { key: "priceSzl", label: "Amount", render: (r) => formatSzl(r.priceSzl) },
              {
                key: "status",
                label: "Status",
                render: (r) => <PaymentStatusBadge status={toPaymentStatus(r.status)} />,
              },
              {
                key: "createdAt",
                label: "Date",
                render: (r) => new Date(r.createdAt).toLocaleDateString(),
              },
            ]}
          />
        )}

        <div className="p-4 border-t border-line flex justify-center">
          <PaginationControls
            currentPage={result.page}
            totalPages={result.totalPages}
            onPageChange={(p) => navigate({ page: String(p) })}
          />
        </div>
      </Card>
    </Container>
  );
}
