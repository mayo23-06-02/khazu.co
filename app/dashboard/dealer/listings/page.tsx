'use client'
import React, { useState, useEffect } from 'react'
import { 
  Container, Heading1, Body, Card, 
  Badge, Button, InputText, FormGroup 
} from '@/components/ui'
import { 
  FaSearch, FaPlus, FaFilter, FaEdit, 
  FaTrashAlt, FaRocket, FaEye, FaEnvelope 
} from 'react-icons/fa'
import { Car } from '@/types/car'
import { twMerge } from 'tailwind-merge'

export default function DealerListingsPage() {
  const [listings, setListings] = useState<Car[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be a fetch to /api/dealer/listings
    // For now, we'll load from our mockData.json
    const loadData = async () => {
      try {
        const response = await fetch('/api/mock/cars')
        const data = await response.json()
        // Mock filtering by "current dealer" (just taking the first few for demo)
        setListings(data.slice(0, 15))
      } catch (error) {
        console.error('Failed to load listings', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredListings = listings.filter(car => 
    car.make.toLowerCase().includes(search.toLowerCase()) ||
    car.model.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Container className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Heading1>Inventory Management</Heading1>
          <Body muted>Manage your vehicle stock and track performance.</Body>
        </div>
        <Button variant="primary" size="md" onClick={() => window.location.href = '/sell'}>
          <FaPlus className="mr-2" /> Add New Vehicle
        </Button>
      </div>

      <Card className="bg-white border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/30">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by make or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <FaFilter className="mr-2" /> Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Vehicle</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Analytics</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Body muted className="animate-pulse">Loading inventory...</Body>
                  </td>
                </tr>
              ) : filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Body muted>No vehicles found matching your search.</Body>
                  </td>
                </tr>
              ) : (
                filteredListings.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                          {car.images[0] && (
                            <img src={car.images[0]} alt={car.model} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <Body className="font-bold leading-none">{car.make} {car.model}</Body>
                          <Body size="xs" muted className="mt-1">{car.year} • {car.regNumber}</Body>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Body className="font-bold text-gray-900">SZL {car.price.toLocaleString()}</Body>
                      {car.negotiable && <Badge variant="secondary" size="xs" className="mt-1">Negotiable</Badge>}
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={car.status === 'active' ? 'success' : 'secondary'} 
                        size="sm"
                      >
                        {car.status}
                      </Badge>
                      {car.isFeatured && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
                          <FaRocket size={10} /> Boosted
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-gray-500" title="Total Views">
                          <FaEye size={14} />
                          <span className="text-xs font-bold">{car.views}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500" title="Lead Contacts">
                          <FaEnvelope size={14} />
                          <span className="text-xs font-bold">{car.contacts}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors" title="Edit">
                          <FaEdit size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors" title="Boost">
                          <FaRocket size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <FaTrashAlt size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Container>
  )
}
