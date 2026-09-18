"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Container,
  Heading1,
  Body,
  Heading6,
  Grid,
  Card,
  ButtonLink,
} from "@/components/ui";
import {
  FaListUl,
  FaClock,
  FaStore,
  FaMoneyBillWave,
} from "react-icons/fa";
import { StatsCard } from "@/components/khazu/StatsCard/StatsCard";
import { TrendChart } from "@/components/khazu/TrendChart/TrendChart";
import { FlaggedItem } from "@/components/ui/Admin/FlaggedItem/FlaggedItem";
import { FraudAlert } from "@/components/ui/Admin/FraudAlert/FraudAlert";
import type { AdminDashboardData } from "@/types/dashboard";
import { formatCompactNumber } from "@/lib/dashboard/format";
import { formatSzl } from "@/lib/marketplace/format";
import { approveListing, rejectListing } from "@/lib/dashboard/adminActions";

function trendProps(pct: number | null | undefined) {
  if (pct == null) return {};
  return { trendValue: `${Math.abs(pct)}%`, trendUp: pct >= 0 };
}

export function AdminDashboardClient({ data }: { data: AdminDashboardData }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <Container className="py-8 max-w-7xl">
      <div className="mb-8">
        <Heading1 className="text-3xl mb-2">Admin Control Center</Heading1>
        <Body muted>Platform-wide overview and moderation.</Body>
      </div>

      {/* KPIs Row */}
      <Grid cols={1} md={2} lg={4} gap="lg" className="mb-8">
        <StatsCard
          title="Total Users"
          value={formatCompactNumber(data.totalUsers)}
          subtitle="All accounts"
          icon={<FaListUl size={20} />}
          iconBgClass="bg-info"
          slug="admin/users"
          {...trendProps(data.totalUsersTrendPct)}
        />
        <StatsCard
          title="Pending Moderation"
          value={formatCompactNumber(data.pendingModeration)}
          subtitle="Listings awaiting review"
          icon={<FaClock size={20} />}
          iconBgClass="bg-warning"
          slug="admin/listings"
        />
        <StatsCard
          title="Total Dealers"
          value={formatCompactNumber(data.totalDealers)}
          subtitle="Verified dealer accounts"
          icon={<FaStore size={20} />}
          iconBgClass="bg-ink"
          slug="admin/users"
        />
        <StatsCard
          title="Revenue (30d)"
          value={formatSzl(data.monthlyRevenueSzl)}
          subtitle="Platform revenue"
          icon={<FaMoneyBillWave size={20} />}
          iconBgClass="bg-success"
          slug="admin/payments"
          {...trendProps(data.revenueTrendPct)}
        />
      </Grid>

      <div className="mb-8">
        <TrendChart
          title="Revenue trend"
          data={data.revenueSeries}
          valueFormatter={(v) => formatSzl(v)}
        />
      </div>

      {/* Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-3">
            <Heading6 className="text-sm uppercase font-bold text-dark-light">
              Pending listings
            </Heading6>
            <Link
              href="/dashboard/admin/listings"
              className="text-sm font-bold text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {data.pendingListings.length === 0 ? (
            <Card padding="lg" elevated="sm">
              <Body muted className="text-sm">
                Nothing waiting on review.
              </Body>
            </Card>
          ) : (
            <div className="space-y-3">
              {data.pendingListings.map((l) => (
                <FlaggedItem
                  key={l.id}
                  id={l.id}
                  title={`${l.year} ${l.make} ${l.model} — ${l.sellerName}`}
                  flagReason={`Listed at ${formatSzl(l.price)}`}
                  riskScore={0}
                  onApprove={() =>
                    startTransition(async () => {
                      await approveListing(l.id);
                      router.refresh();
                    })
                  }
                  onReject={() =>
                    startTransition(async () => {
                      await rejectListing(l.id, "Rejected by admin");
                      router.refresh();
                    })
                  }
                />
              ))}
              <ButtonLink href="/dashboard/admin/listings" variant="outline" fullWidth>
                Open moderation queue
              </ButtonLink>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Heading6 className="text-sm uppercase font-bold text-dark-light">
              Open fraud patterns
            </Heading6>
            <Link
              href="/dashboard/admin/fraud"
              className="text-sm font-bold text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {data.fraudPatterns.length === 0 ? (
            <Card padding="lg" elevated="sm">
              <Body muted className="text-sm">
                No open fraud flags. ({data.openFraudFlags} total tracked)
              </Body>
            </Card>
          ) : (
            <div className="space-y-3">
              {data.fraudPatterns.map((p) => (
                <FraudAlert
                  key={p.pattern}
                  pattern={p.pattern}
                  count={p.count}
                  actions={[
                    {
                      label: "Review",
                      onClick: () => router.push("/dashboard/admin/fraud"),
                    },
                  ]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
