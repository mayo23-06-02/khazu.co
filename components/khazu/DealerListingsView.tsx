"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Container,
  Heading1,
  Body,
  Card,
  Badge,
  Button,
} from "@/components/ui";
import { FaSearch, FaPlus, FaEye, FaEnvelope } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { PersonalListingsActions } from "@/components/khazu/PersonalListingsActions";
import { formatSzl } from "@/lib/marketplace/format";
import { formatCompactNumber } from "@/lib/dashboard/format";
import type { Listing, ListingStatus } from "@/types/listing";

type StatusFilter = "all" | ListingStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "sold", label: "Sold" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

export function DealerListingsView({ listings }: { listings: Listing[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filteredListings = useMemo(() => {
    return listings.filter((car) => {
      const matchesSearch =
        car.make.toLowerCase().includes(search.toLowerCase()) ||
        car.model.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || car.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [listings, search, status]);

  return (
    <Container className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Heading1>Inventory Management</Heading1>
          <Body muted>Manage your vehicle stock and track performance.</Body>
        </div>
        <Link href="/sell">
          <Button variant="primary" size="md">
            <FaPlus className="mr-2" /> Add New Vehicle
          </Button>
        </Link>
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
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className="w-full sm:w-auto bg-white border border-gray-200 rounded-lg text-sm px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Price
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Analytics
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Body muted>
                      {listings.length === 0
                        ? "You haven't listed any vehicles yet."
                        : "No vehicles found matching your search."}
                    </Body>
                  </td>
                </tr>
              ) : (
                filteredListings.map((car) => (
                  <tr
                    key={car.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                          {car.images?.[0] && (
                            <Image
                              src={car.images[0]}
                              alt={car.model}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          )}
                        </div>
                        <div>
                          <Body className="font-bold leading-none">
                            {car.make} {car.model}
                          </Body>
                          <Body size="xs" muted className="mt-1">
                            {car.year} • {car.reg_number || "—"}
                          </Body>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Body className="font-bold text-gray-900">
                        {formatSzl(car.price)}
                      </Body>
                      {car.negotiable && (
                        <Badge variant="secondary" size="xs" className="mt-1">
                          Negotiable
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={car.status === "active" ? "success" : "secondary"}
                        size="sm"
                        className="capitalize"
                      >
                        {car.status}
                      </Badge>
                      {car.is_featured && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
                          Boosted
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex items-center gap-1.5 text-gray-500"
                          title="Total Views"
                        >
                          <FaEye size={14} />
                          <span className="text-xs font-bold">
                            {formatCompactNumber(car.views_count ?? 0)}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-1.5 text-gray-500"
                          title="Lead Contacts"
                        >
                          <FaEnvelope size={14} />
                          <span className="text-xs font-bold">
                            {formatCompactNumber(car.contacts_count ?? 0)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className={twMerge(
                          "flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity",
                        )}
                      >
                        <PersonalListingsActions
                          listingId={car.id}
                          isFeatured={car.is_featured}
                          editHref={`/dashboard/dealer/listings/${car.id}/edit`}
                        />
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
  );
}
