"use client";

import { useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Heading1,
  Body,
  Heading6,
  Card,
  Select,
  Badge,
  DataTable,
  PaginationControls,
  EmptyState,
  Grid,
} from "@/components/ui";
import { FraudAlert } from "@/components/ui/Admin/FraudAlert/FraudAlert";
import { FaShieldHalved } from "react-icons/fa6";
import type { AdminFraudFlagRow, PaginatedResult } from "@/types/dashboard";
import { resolveFraudFlag } from "@/lib/dashboard/adminActions";

function buildQuery(params: Record<string, string>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) usp.set(k, v);
  });
  const qs = usp.toString();
  return qs ? `/dashboard/admin/fraud?${qs}` : "/dashboard/admin/fraud";
}

export function AdminFraudView({
  result,
  status,
}: {
  result: PaginatedResult<AdminFraudFlagRow>;
  status: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const navigate = (overrides: Record<string, string>) => {
    router.push(buildQuery({ status, page: "1", ...overrides }));
  };

  const patterns = useMemo(() => {
    const map = new Map<string, AdminFraudFlagRow[]>();
    for (const row of result.rows) {
      if (row.status !== "open") continue;
      map.set(row.pattern, [...(map.get(row.pattern) ?? []), row]);
    }
    return Array.from(map.entries());
  }, [result.rows]);

  const resolve = (id: string, action: "dismissed" | "actioned") =>
    startTransition(async () => {
      await resolveFraudFlag(id, action);
      router.refresh();
    });

  return (
    <Container className="py-8 max-w-7xl">
      <div className="mb-8">
        <Heading1 className="text-3xl mb-2">Fraud Detection</Heading1>
        <Body muted>Review flagged listings and accounts.</Body>
      </div>

      {patterns.length > 0 && (
        <div className="mb-8">
          <Heading6 className="mb-3 text-sm uppercase font-bold text-dark-light">
            Open patterns
          </Heading6>
          <Grid cols={1} md={2} gap="md">
            {patterns.map(([pattern, rows]) => (
              <FraudAlert
                key={pattern}
                pattern={pattern}
                count={rows.length}
                actions={[
                  {
                    label: "Dismiss all",
                    onClick: () => rows.forEach((r) => resolve(r.id, "dismissed")),
                  },
                  {
                    label: "Mark actioned",
                    onClick: () => rows.forEach((r) => resolve(r.id, "actioned")),
                  },
                ]}
              />
            ))}
          </Grid>
        </div>
      )}

      <Card padding="none" elevated="sm" className="overflow-hidden">
        <div className="p-4 border-b border-line">
          <Select
            value={status}
            onChange={(e) => navigate({ status: e.target.value })}
            options={[
              { value: "", label: "All" },
              { value: "open", label: "Open" },
              { value: "dismissed", label: "Dismissed" },
              { value: "actioned", label: "Actioned" },
            ]}
            className="sm:max-w-[160px]"
          />
        </div>

        {result.rows.length === 0 ? (
          <EmptyState
            icon={<FaShieldHalved size={18} />}
            title="No flags found"
            description="Nothing matches this filter right now."
          />
        ) : (
          <DataTable
            data={result.rows}
            columns={[
              { key: "pattern", label: "Pattern" },
              {
                key: "target",
                label: "Target",
                render: (f) => f.listingLabel || f.userName || "—",
              },
              { key: "riskScore", label: "Risk", render: (f) => `${f.riskScore}%` },
              {
                key: "status",
                label: "Status",
                render: (f) => (
                  <Badge
                    variant={
                      f.status === "open"
                        ? "warning"
                        : f.status === "actioned"
                          ? "danger"
                          : "secondary"
                    }
                  >
                    {f.status}
                  </Badge>
                ),
              },
              {
                key: "createdAt",
                label: "Flagged",
                render: (f) => new Date(f.createdAt).toLocaleDateString(),
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
