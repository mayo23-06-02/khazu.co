"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Container,
  Heading1,
  Body,
  Heading6,
  Card,
  CardBody,
  InputText,
  Select,
  StatusBadge,
  Badge,
  DataTable,
  PaginationControls,
  EmptyState,
  Grid,
} from "@/components/ui";
import { FlaggedItem } from "@/components/ui/Admin/FlaggedItem/FlaggedItem";
import { FaCar } from "react-icons/fa6";
import type { AdminListingRow, PaginatedResult } from "@/types/dashboard";
import { approveListing, rejectListing } from "@/lib/dashboard/adminActions";
import { formatSzl } from "@/lib/marketplace/format";

function buildQuery(params: Record<string, string>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) usp.set(k, v);
  });
  const qs = usp.toString();
  return qs ? `/dashboard/admin/listings?${qs}` : "/dashboard/admin/listings";
}

export function AdminListingsView({
  result,
  search,
  moderation,
}: {
  result: PaginatedResult<AdminListingRow>;
  search: string;
  moderation: string;
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(search);
  const [, startTransition] = useTransition();

  const navigate = (overrides: Record<string, string>) => {
    router.push(buildQuery({ search: searchInput, moderation, page: "1", ...overrides }));
  };

  const pendingRows = result.rows.filter((l) => l.moderationStatus === "pending");

  return (
    <Container className="py-8 max-w-7xl">
      <div className="mb-8">
        <Heading1 className="text-3xl mb-2">Listings</Heading1>
        <Body muted>Moderate every listing on the marketplace.</Body>
      </div>

      {pendingRows.length > 0 && (
        <div className="mb-8">
          <Heading6 className="mb-3 text-sm uppercase font-bold text-dark-light">
            Needs review
          </Heading6>
          <Grid cols={1} md={2} gap="md">
            {pendingRows.map((l) => (
              <FlaggedItem
                key={l.id}
                id={l.id}
                title={`${l.year} ${l.make} ${l.model} — ${l.sellerName}`}
                flagReason={`Listed at ${formatSzl(l.price)}, awaiting review`}
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
          </Grid>
        </div>
      )}

      <Card padding="none" elevated="sm" className="overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-line">
          <form
            className="flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({});
            }}
          >
            <InputText
              placeholder="Search by make or model…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              fullWidth
            />
          </form>
          <Select
            value={moderation}
            onChange={(e) => navigate({ moderation: e.target.value })}
            options={[
              { value: "", label: "All" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ]}
            className="sm:max-w-[160px]"
          />
        </div>

        {result.rows.length === 0 ? (
          <EmptyState
            icon={<FaCar size={18} />}
            title="No listings found"
            description="Try a different search or filter."
          />
        ) : (
          <DataTable
            data={result.rows}
            columns={[
              {
                key: "make",
                label: "Vehicle",
                render: (l) => (
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 rounded-md overflow-hidden bg-surface-alt shrink-0">
                      {l.image && (
                        <Image src={l.image} alt="" fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-ink">
                        {l.year} {l.make} {l.model}
                      </p>
                      <p className="text-xs text-muted">{l.sellerName}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: "price",
                label: "Price",
                render: (l) => formatSzl(l.price),
              },
              {
                key: "status",
                label: "Status",
                render: (l) => <StatusBadge status={l.status as any} />,
              },
              {
                key: "moderationStatus",
                label: "Moderation",
                render: (l) => (
                  <Badge
                    variant={
                      l.moderationStatus === "approved"
                        ? "success"
                        : l.moderationStatus === "rejected"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {l.moderationStatus}
                  </Badge>
                ),
              },
              {
                key: "createdAt",
                label: "Listed",
                render: (l) => new Date(l.createdAt).toLocaleDateString(),
              },
            ]}
          />
        )}

        <div className="p-4 border-t border-line flex justify-center">
          <PaginationControls
            currentPage={result.page}
            totalPages={result.totalPages}
            onPageChange={(p) => navigate({ page: String(p) })}
          />
        </div>
      </Card>
    </Container>
  );
}
