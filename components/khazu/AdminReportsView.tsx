"use client";

import { Container, Heading1, Body, Card, Grid } from "@/components/ui";
import { ReportTable } from "@/components/ui/Admin/ReportTable/ReportTable";
import { TrendChart } from "@/components/khazu/TrendChart/TrendChart";
import type { AdminReportRow } from "@/types/dashboard";
import { formatSzl } from "@/lib/marketplace/format";

export function AdminReportsView({ rows }: { rows: AdminReportRow[] }) {
  const revenueSeries = rows.map((r) => ({ name: r.label, value: r.revenueSzl }));
  const listingsSeries = rows.map((r) => ({ name: r.label, value: r.listings }));

  return (
    <Container className="py-8 max-w-7xl">
      <div className="mb-8">
        <Heading1 className="text-3xl mb-2">Reports</Heading1>
        <Body muted>Platform activity over the last 6 months.</Body>
      </div>

      <Grid cols={1} lg={2} gap="lg" className="mb-8">
        <TrendChart title="Revenue" data={revenueSeries} valueFormatter={(v) => formatSzl(v)} />
        <TrendChart title="New Listings" data={listingsSeries} />
      </Grid>

      <Card padding="none" elevated="sm" className="overflow-hidden">
        <ReportTable
          data={rows.map((r) => ({
            Month: r.label,
            Listings: r.listings,
            "New Users": r.newUsers,
            Revenue: formatSzl(r.revenueSzl),
          }))}
          columns={[
            { key: "Month", label: "Month" },
            { key: "Listings", label: "Listings" },
            { key: "New Users", label: "New Users" },
            { key: "Revenue", label: "Revenue" },
          ]}
        />
      </Card>
    </Container>
  );
}
