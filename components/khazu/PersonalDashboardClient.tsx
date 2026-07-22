"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Container,
  Heading1,
  Body,
  Button,
} from "@/components/ui";
import {
  FaCar,
  FaEye,
  FaPhone,
  FaChartLine,
  FaRocket,
  FaTimes,
} from "react-icons/fa";
import { BsCarFront, BsCurrencyDollar } from "react-icons/bs";
import { StatsCard } from "@/components/khazu/StatsCard/StatsCard";
import { VisitorGraph } from "@/components/khazu/VisitorGraph/VisitorGraph";
import { RecentActivity } from "@/components/khazu/RecentActivity/RecentActivity";
import { DashboardCalendar } from "@/components/khazu/DashboardCalendar/DashboardCalendar";
import type { PersonalDashboardData } from "@/types/dashboard";
import { formatCompactNumber } from "@/lib/dashboard/format";

const BANNER_KEY = "khazu_personal_boost_banner_dismissed";

function trendProps(pct: number | null | undefined) {
  if (pct == null) return {};
  return {
    trendValue: `${Math.abs(pct)}%`,
    trendUp: pct >= 0,
  };
}

export function PersonalDashboardClient({
  data,
}: {
  data: PersonalDashboardData;
}) {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(BANNER_KEY) === "1") setShowBanner(false);
    } catch {
      /* ignore */
    }
  }, []);

  const dismissBanner = () => {
    setShowBanner(false);
    try {
      localStorage.setItem(BANNER_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const { stats } = data;

  return (
    <Container className="py-8 max-w-[1920px]">
      

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <Heading1 className="text-2xl sm:text-3xl break-words">
            Welcome back, {data.firstName}
          </Heading1>
          <Body muted size="lg" className="text-sm sm:text-base">
            Here&apos;s how your listings are performing today.
          </Body>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          
          <Link href="/sell/upload" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto">
              <BsCarFront className="mr-2" /> Sell Vehicle
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatsCard
          title="Total Listings"
          value={formatCompactNumber(stats.activeListings)}
          subtitle={
            stats.activeListings === 0
              ? "No active listings yet"
              : "Currently active"
          }
          icon={<FaCar size={18} />}
          iconBgClass="bg-[#4085aa]"
          slug="personal/listings"
          {...trendProps(stats.listingsTrendPct)}
        />
        <StatsCard
          title="Total Views"
          value={formatCompactNumber(stats.totalViews)}
          subtitle="Last 30 days"
          icon={<FaEye size={18} />}
          iconBgClass="bg-[#00a859]"
          slug="personal/listings"
          {...trendProps(stats.viewsTrendPct)}
        />
        <StatsCard
          title="Total Contacts"
          value={formatCompactNumber(stats.totalContacts)}
          subtitle="Total leads generated"
          icon={<FaPhone size={18} />}
          iconBgClass="bg-[#2a3042]"
          slug="personal/listings"
          {...trendProps(stats.contactsTrendPct)}
        />
        <StatsCard
          title="Avg Views/Listing"
          value={formatCompactNumber(stats.avgViewsPerListing)}
          subtitle={
            stats.activeListings === 0 ? "List a car to start" : "Active listings"
          }
          icon={<FaChartLine size={18} />}
          iconBgClass="bg-[#2a3042]"
          slug="personal/listings"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-8">
        <div className="flex flex-col h-full min-w-0">
          <VisitorGraph
            data={data.engagementSeries}
            listingOptions={data.listingOptions}
            engagementByListing={data.engagementByListing}
          />
        </div>
        
        <div className="flex flex-col h-full min-w-0 overflow-x-auto">
          <DashboardCalendar
            userType="personal"
            boosts={data.boosts}
            dailyEngagement={data.dailyEngagement}
            reminders={data.calendarReminders}
          />
        </div>
      </div>
    </Container>
  );
}
