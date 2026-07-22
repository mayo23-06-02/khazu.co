'use client'
import React from 'react'
import { Container, Heading1, Body, Grid, Card, CardBody, Button } from '@/components/ui'
import { FaListUl, FaClock, FaStore, FaMoneyBillWave, FaShieldAlt, FaUsers, FaCheckDouble } from 'react-icons/fa'
import { StatsCard } from '@/components/khazu/StatsCard/StatsCard'
import { KhazuListingCard } from '@/components/khazu/KhazuListingCard'
import { UserCard } from '@/components/khazu/UserCard/UserCard'
import { Car } from '@/types/car'
import { User, UserRole } from '@/types/user'

export default function AdminDashboardPage() {
  // Mock data formatted for KhazuListingCard
  const mockCars = [
    {
      id: '5',
      status: 'pending',
      vehicle_data: {
        header: {
          listingId: '5',
          registrationYearMakeModel: '2023 Audi RS3',
          variant: 'Sportback quattro',
          listingPrice: 'SZL 1,450,000'
        },
        gallery: { galleryImages: [{ imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80' }] },
        summaryIcons: [{ text: '2023' }, { text: '5,000 km' }, { text: 'Automatic' }, { text: 'Petrol' }, { text: '2.5 L' }],
        priceInformation: { repaymentPrice: { estimatedRepayment: 'SZL 19,500' } }
      }
    },
    {
      id: '6',
      status: 'active',
      vehicle_data: {
        header: {
          listingId: '6',
          registrationYearMakeModel: '2024 Ford Ranger',
          variant: 'Raptor 3.0 V6',
          listingPrice: 'SZL 1,200,000'
        },
        gallery: { galleryImages: [{ imageUrl: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80' }] },
        summaryIcons: [{ text: '2024' }, { text: '1,200 km' }, { text: 'Automatic' }, { text: 'Petrol' }, { text: '3.0 L' }],
        priceInformation: { repaymentPrice: { estimatedRepayment: 'SZL 16,000' } }
      }
    },
    {
      id: '7',
      status: 'active',
      vehicle_data: {
        header: {
          listingId: '7',
          registrationYearMakeModel: '2019 Nissan NP200',
          variant: '1.6i Safety Pack',
          listingPrice: 'SZL 155,000'
        },
        gallery: { galleryImages: [{ imageUrl: 'https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?auto=format&fit=crop&q=80' }] },
        summaryIcons: [{ text: '2019' }, { text: '125,000 km' }, { text: 'Manual' }, { text: 'Petrol' }, { text: '1.6 L' }],
        priceInformation: { repaymentPrice: { estimatedRepayment: 'SZL 2,400' } }
      }
    }
  ]

  // Mock data for recent users
  const mockUsers: User[] = [
    {
      id: 'u1',
      firstName: 'Sipho',
      lastName: 'Dlamini',
      email: 'sipho@example.com',
      phone: '76000000',
      role: UserRole.PERSONAL,
      isVerified: true,
      freeListingsRemaining: 1,
      createdAt: new Date('2026-06-01')
    },
    {
      id: 'u2',
      firstName: 'Mbabane',
      lastName: 'Motors',
      email: 'sales@mbabanemotors.co.sz',
      phone: '24040000',
      role: UserRole.DEALER,
      dealerName: 'Mbabane Motors',
      isVerified: false,
      freeListingsRemaining: 0,
      createdAt: new Date('2026-05-15')
    },
    {
      id: 'u3',
      firstName: 'Thabo',
      lastName: 'Maseko',
      email: 'thabo.m@example.com',
      phone: '79000000',
      role: UserRole.PERSONAL,
      isVerified: false,
      freeListingsRemaining: 1,
      createdAt: new Date('2026-07-10')
    }
  ]

  return (
    <Container className="py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Heading1 className="text-3xl mb-2">Admin Control Center</Heading1>
          <Body muted>Platform-wide overview and moderation.</Body>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
           <Body size="sm" className="font-bold text-gray-500">Live Updates Active</Body>
        </div>
      </div>

      {/* KPIs Row */}
      <Grid cols={1} md={2} lg={4} gap="lg" className="mb-8">
        <StatsCard 
          title="Platform Listings" 
          value="1,248" 
          subtitle="Total active listings"
          icon={<FaListUl size={20} />} 
          iconBgClass="bg-[#4085aa]"
          trendValue="12.5%"
          trendUp={true}
        />
        <StatsCard 
          title="Pending Approvals" 
          value="15" 
          subtitle="Requires review"
          icon={<FaClock size={20} />} 
          iconBgClass="bg-yellow-500"
          trendValue="3"
          trendUp={false}
        />
        <StatsCard 
          title="Total Dealers" 
          value="48" 
          subtitle="Verified dealers"
          icon={<FaStore size={20} />} 
          iconBgClass="bg-[#2a3042]"
          trendValue="4.2%"
          trendUp={true}
        />
        <StatsCard 
          title="Revenue (30d)" 
          value="12,450"
          unit="SZL" 
          subtitle="Platform revenue"
          icon={<FaMoneyBillWave size={20} />} 
          iconBgClass="bg-[#00a859]"
          trendValue="8%"
          trendUp={true}
        />
      </Grid>

      {/* Quick Actions Row */}
      <Grid cols={1} md={3} gap="lg" className="mb-8">
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-200 hover:border-primary hover:text-primary transition-all bg-white shadow-sm">
          <FaCheckDouble size={20} className="mb-2" />
          <span className="font-bold">Review Queue (15)</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-200 hover:border-primary hover:text-primary transition-all bg-white shadow-sm">
          <FaUsers size={20} className="mb-2" />
          <span className="font-bold">Manage Users</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-200 hover:border-primary hover:text-primary transition-all bg-white shadow-sm">
          <FaShieldAlt size={20} className="mb-2" />
          <span className="font-bold">Fraud Alerts (0)</span>
        </Button>
      </Grid>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Recent Listings (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <Heading1 className="text-xl mb-0">Platform Activity - Cars</Heading1>
            <a href="/dashboard/admin/listings" className="text-sm font-bold text-[#CD2C58] hover:underline">
              Moderate All
            </a>
          </div>
          <div className="flex-1 space-y-4">
            {mockCars.map(car => (
              <div key={car.id} className="relative">
                <KhazuListingCard data={car as any} />
                {car.status === 'pending' && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-lg border-2 border-yellow-400">
                    <Button variant="primary" className="shadow-lg">Review Listing</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <Heading1 className="text-xl mb-0">Recent Registrations</Heading1>
            <a href="/dashboard/admin/users" className="text-sm font-bold text-[#CD2C58] hover:underline">
              View Directory
            </a>
          </div>
          <div className="flex-1 bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            {mockUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
            <Button variant="outline" fullWidth className="mt-2 text-gray-500 border-gray-200">
              Load More Users
            </Button>
          </div>
        </div>
      </div>

    </Container>
  )
}
