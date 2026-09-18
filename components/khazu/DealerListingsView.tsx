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
  InputText,
  Select,
  DataTable,
  EmptyState,
} from "@/components/ui";
import { FaSearch, FaPlus, FaEye, FaEnvelope, FaCar } from "react-icons/fa";
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

      <Card padding="none" elevated="sm" className="overflow-hidden">
        <div className="p-4 border-b border-line bg-surface-alt/50">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10" />
              <InputText
                placeholder="Search by make or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                fullWidth
              />
            </div>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              options={STATUS_OPTIONS}
              className="w-full sm:w-auto sm:min-w-[160px]"
            />
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <EmptyState
            icon={<FaCar size={18} />}
            title={
              listings.length === 0
                ? "You haven't listed any vehicles yet."
                : "No vehicles found matching your search."
            }
          />
        ) : (
          <DataTable
            data={filteredListings}
            columns={[
              {
                key: "vehicle",
                label: "Vehicle",
                render: (car) => (
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-12 bg-surface-alt rounded-lg overflow-hidden flex-shrink-0 border border-line">
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
                ),
              },
              {
                key: "price",
                label: "Price",
                render: (car) => (
                  <div>
                    <Body className="font-bold text-ink">{formatSzl(car.price)}</Body>
                    {car.negotiable && (
                      <Badge variant="secondary" size="xs" className="mt-1">
                        Negotiable
                      </Badge>
                    )}
                  </div>
                ),
              },
              {
                key: "status",
                label: "Status",
                render: (car) => (
                  <div>
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
                  </div>
                ),
              },
              {
                key: "analytics",
                label: "Analytics",
                render: (car) => (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-muted" title="Total Views">
                      <FaEye size={14} />
                      <span className="text-xs font-bold">
                        {formatCompactNumber(car.views_count ?? 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted" title="Lead Contacts">
                      <FaEnvelope size={14} />
                      <span className="text-xs font-bold">
                        {formatCompactNumber(car.contacts_count ?? 0)}
                      </span>
                    </div>
                  </div>
                ),
              },
              {
                key: "actions",
                label: "Actions",
                render: (car) => (
                  <div className="flex items-center justify-end gap-2">
                    <PersonalListingsActions
                      listingId={car.id}
                      isFeatured={car.is_featured}
                      editHref={`/dashboard/dealer/listings/${car.id}/edit`}
                    />
                  </div>
                ),
              },
            ]}
          />
        )}
      </Card>
    </Container>
  );
}
