"use client";

import Link from "next/link";
import {
  Container,
  Heading1,
  Body,
  Grid,
  Card,
  CardBody,
  Button,
} from "@/components/ui";
import {
  FaCar,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaPercentage,
  FaRocket,
} from "react-icons/fa";
import { StatsCard } from "@/components/khazu/StatsCard/StatsCard";
import { VisitorGraph } from "@/components/khazu/VisitorGraph/VisitorGraph";
import { RecentActivity } from "@/components/khazu/RecentActivity/RecentActivity";
import { DashboardCalendar } from "@/components/khazu/DashboardCalendar/DashboardCalendar";
import type { DealerDashboardData } from "@/types/dashboard";
import { formatCompactNumber } from "@/lib/dashboard/format";

function trendProps(pct: number | null | undefined) {
  if (pct == null) return {};
  return {
    trendValue: `${Math.abs(pct)}%`,
    trendUp: pct >= 0,
  };
}

export function DealerDashboardClient({
  data,
}: {
  data: DealerDashboardData;
}) {
  const { stats } = data;

  return (
    <Container className="py-8 max-w-7xl">
      <div className="mb-8">
        <Heading1 className="text-3xl mb-2">Dealer Portal</Heading1>
        <Body muted>Overview of your inventory and lead performance.</Body>
      </div>

      {/* KPIs Row */}
      <Grid cols={1} md={2} lg={4} gap="lg" className="mb-8">
        <StatsCard
          title="Active Listings"
          value={formatCompactNumber(stats.activeListings)}
          subtitle={
            stats.activeListings === 0
              ? "No active listings yet"
              : "Currently active"
          }
          icon={<FaCar size={20} />}
          iconBgClass="bg-info"
          slug="dealer/listings"
          {...trendProps(stats.listingsTrendPct)}
        />
        <StatsCard
          title="Sold This Month"
          value={formatCompactNumber(data.soldThisMonth)}
          subtitle="This calendar month"
          icon={<FaMoneyBillWave size={20} />}
          iconBgClass="bg-success"
          slug="dealer/listings"
          {...trendProps(data.soldTrendPct)}
        />
        <StatsCard
          title="Total Leads"
          value={formatCompactNumber(data.totalLeads)}
          subtitle="Across all active inventory"
          icon={<FaPhoneAlt size={20} />}
          iconBgClass="bg-ink"
          slug="dealer/leads"
          {...trendProps(data.leadsTrendPct)}
        />
        <StatsCard
          title="Conversion Rate"
          value={data.conversionRatePct}
          unit="%"
          subtitle="Leads to sale"
          icon={<FaPercentage size={20} />}
          iconBgClass="bg-ink"
        />
      </Grid>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="flex flex-col h-full">
          <VisitorGraph
            data={data.engagementSeries}
            listingOptions={data.listingOptions}
            engagementByListing={data.engagementByListing}
          />
        </div>

        <div className="flex flex-col h-full">
          <RecentActivity activities={data.activities} />
        </div>

        <div className="flex flex-col h-full">
          <DashboardCalendar
            boosts={data.boosts}
            dailyEngagement={data.dailyEngagement}
            reminders={data.calendarReminders}
          />
        </div>
      </div>

      {/* Boost Banner */}
      <Card elevated="xl" className="bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-white">
          <FaRocket size={120} />
        </div>
        <CardBody className="p-8 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="mb-6 md:mb-0">
            <Heading1 className="text-2xl text-white mb-2">
              Boost your inventory – get noticed faster
            </Heading1>
            <Body className="text-gray-300 font-medium">
              SZL 25 for 14 days of featured placement across all searches
            </Body>
          </div>
          <Link href="/dashboard/dealer/listings" className="w-full md:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="shrink-0 w-full md:w-auto shadow-brand"
            >
              <FaRocket className="mr-2" /> Boost a Car
            </Button>
          </Link>
        </CardBody>
      </Card>
    </Container>
  );
}
