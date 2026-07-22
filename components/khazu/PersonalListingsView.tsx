"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Badge,
  Body,
  Button,
  Card,
  Heading1,
} from "@/components/ui";
import {
  FaEye,
  FaPlus,
  FaPhone,
  FaTh,
  FaList,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { KhazuListingCard } from "@/components/khazu/KhazuListingCard";
import { PersonalListingsActions } from "@/components/khazu/PersonalListingsActions";
import { toApifyCardListing } from "@/lib/marketplace/toApifyCard";
import { formatMileage, formatSzl } from "@/lib/marketplace/format";
import { formatCompactNumber } from "@/lib/dashboard/format";
import type { Listing } from "@/types/listing";
import type { MarketplaceListing } from "@/lib/marketplace/types";

type ViewMode = "cards" | "table";

export function PersonalListingsView({ listings }: { listings: Listing[] }) {
  const [view, setView] = useState<ViewMode>("cards");

  const cardData = useMemo(
    () =>
      listings.map((l) => ({
        id: l.id,
        listing: l,
        apify: toApifyCardListing(l as MarketplaceListing),
      })),
    [listings],
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Heading1>My Listings</Heading1>
          <Body muted>
            Same cards as the public marketplace — or switch to a table.
          </Body>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setView("cards")}
              className={twMerge(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all",
                view === "cards"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
              aria-pressed={view === "cards"}
            >
              <FaTh size={14} /> Cards
            </button>
            <button
              type="button"
              onClick={() => setView("table")}
              className={twMerge(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all",
                view === "table"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
              aria-pressed={view === "table"}
            >
              <FaList size={14} /> Table
            </button>
          </div>
          <Link href="/sell/upload">
            <Button variant="primary" size="md">
              <FaPlus className="mr-2" /> List Another Car
            </Button>
          </Link>
        </div>
      </div>

      {listings.length === 0 ? (
        <Card padding="lg" className="text-center bg-white border-gray-100">
          <Body muted className="mb-4">
            You haven&apos;t listed any cars yet.
          </Body>
          <Link href="/sell/upload">
            <Button variant="outline" size="sm">
              Start Selling
            </Button>
          </Link>
        </Card>
      ) : view === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {cardData.map(({ id, listing, apify }) => (
            <div key={id} className="relative group/card">
              <KhazuListingCard data={apify} />
              {/* Dashboard overlay: stats + actions (doesn’t replace public card) */}
              <div className="mt-2 flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <FaEye className="text-gray-400" />
                    {formatCompactNumber(listing.views_count ?? 0)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FaPhone className="text-gray-400" />
                    {formatCompactNumber(listing.contacts_count ?? 0)}
                  </span>
                  <Badge
                    variant={
                      listing.status === "active" ? "success" : "secondary"
                    }
                    className="capitalize text-[10px]"
                  >
                    {listing.status}
                  </Badge>
                </div>
                <PersonalListingsActions
                  listingId={listing.id}
                  isFeatured={listing.is_featured}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card padding="none" className="border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[720px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Mileage</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Contacts</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listings.map((car) => (
                  <tr
                    key={car.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {car.images?.[0] ? (
                            <Image
                              src={car.images[0]}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">
                            {car.year} {car.make} {car.model}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {car.reg_number || "—"}
                            {car.is_featured ? " · Featured" : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          car.status === "active" ? "success" : "secondary"
                        }
                        className="capitalize"
                      >
                        {car.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      {formatSzl(car.price)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {formatMileage(car.mileage)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {formatCompactNumber(car.views_count ?? 0)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {formatCompactNumber(car.contacts_count ?? 0)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/deals/${car.id}`}
                          className="p-2.5 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-all"
                          title="View public listing"
                        >
                          <FaExternalLinkAlt size={14} />
                        </Link>
                        <PersonalListingsActions
                          listingId={car.id}
                          isFeatured={car.is_featured}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
