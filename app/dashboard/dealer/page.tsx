'use client'
import React from 'react'
import { Container, Heading1, Body, Grid, Card, CardBody, Button } from '@/components/ui'
import { FaCar, FaMoneyBillWave, FaPhoneAlt, FaPercentage, FaRocket } from 'react-icons/fa'
import { StatsCard } from '@/components/khazu/StatsCard/StatsCard'
import { VisitorGraph } from '@/components/khazu/VisitorGraph/VisitorGraph'
import { RecentActivity } from "@/components/khazu/RecentActivity/RecentActivity"
import { DashboardCalendar } from "@/components/khazu/DashboardCalendar/DashboardCalendar"

export default function DealerDashboardPage() {

  return (
    <Container className="py-8 max-w-7xl">
      <div className="mb-8">
        <Heading1 className="text-3xl mb-2">Dealer Portal</Heading1>
        <Body muted>Overview of your inventory and lead performance.</Body>
      </div>

      {/* KPIs Row */}
      <Grid cols={1} md={2} lg={4} gap={6} className="mb-8">
        <StatsCard 
          title="Active Listings" 
          value="42" 
          subtitle="3 pending approval"
          icon={<FaCar size={20} />} 
          iconBgClass="bg-[#4085aa]"
          trendValue="8%"
          trendUp={true}
        />
        <StatsCard 
          title="Sold This Month" 
          value="8" 
          subtitle="Last 30 days"
          icon={<FaMoneyBillWave size={20} />} 
          iconBgClass="bg-[#00a859]"
          trendValue="24%"
          trendUp={true}
        />
        <StatsCard 
          title="Total Leads" 
          value="156" 
          subtitle="Across all active inventory"
          icon={<FaPhoneAlt size={20} />} 
          iconBgClass="bg-[#2a3042]"
          trendValue="12.5%"
          trendUp={true}
        />
        <StatsCard 
          title="Conversion Rate" 
          value="5.1" 
          unit="%"
          subtitle="Leads to sale"
          icon={<FaPercentage size={20} />} 
          iconBgClass="bg-[#2a3042]"
          trendValue="0.5%"
          trendUp={true}
        />
      </Grid>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Graph Section (Column 1) */}
        <div className="flex flex-col h-full">
          <VisitorGraph />
        </div>

        {/* Recent Activity Section (Column 2) */}
        <div className="flex flex-col h-full">
          <RecentActivity userType="dealer" />
        </div>

        {/* Calendar Section (Column 3) */}
        <div className="flex flex-col h-full">
          <DashboardCalendar userType="dealer" />
        </div>
      </div>

      {/* Boost Banner */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-none overflow-hidden relative shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-white">
          <FaRocket size={120} />
        </div>
        <CardBody className="p-8 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="mb-6 md:mb-0">
            <Heading1 className="text-2xl text-white mb-2">Boost your inventory – get noticed faster</Heading1>
            <Body className="text-gray-300 font-medium">SZL 25 for 14 days of featured placement across all searches</Body>
          </div>
          <Button variant="primary" size="lg" className="shrink-0 w-full md:w-auto shadow-lg shadow-[#CD2C58]/30">
            <FaRocket className="mr-2" /> Boost a Car
          </Button>
        </CardBody>
      </Card>

    </Container>
  )
}
