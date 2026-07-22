"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Body,
  Card,
  DataTable,
  EmptyState,
  Heading1,
  Modal,
} from "@/components/ui";
import { FaEnvelopeOpenText, FaPhoneAlt } from "react-icons/fa";
import { formatSzl } from "@/lib/marketplace/format";
import type { EnquiryWithListing } from "@/types/enquiry";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EnquiriesView({
  enquiries,
}: {
  enquiries: EnquiryWithListing[];
}) {
  const [selected, setSelected] = useState<EnquiryWithListing | null>(null);

  return (
    <div className="py-8 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <Heading1>Enquiries</Heading1>
        <Body muted>
          Buyers who tapped &ldquo;Enquire&rdquo; on one of your listings show
          up here.
        </Body>
      </div>

      {enquiries.length === 0 ? (
        <Card padding="lg" className="bg-white border-gray-100">
          <EmptyState
            icon={<FaEnvelopeOpenText />}
            title="No enquiries yet"
            description="When a buyer enquires about one of your listings, it'll show up here with their contact details."
          />
        </Card>
      ) : (
        <Card className="bg-white border-gray-100 overflow-hidden">
          <DataTable
            data={enquiries}
            onRowClick={(e) => setSelected(e)}
            columns={[
              {
                key: "listings",
                label: "Vehicle",
                render: (e) => (
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100 relative">
                      {e.listings?.images?.[0] && (
                        <Image
                          src={e.listings.images[0]}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="font-bold text-gray-900">
                      {e.listings
                        ? `${e.listings.year} ${e.listings.make} ${e.listings.model}`
                        : "Listing removed"}
                    </span>
                  </div>
                ),
              },
              { key: "name", label: "Name" },
              { key: "phone", label: "Phone" },
              {
                key: "message",
                label: "Message",
                render: (e) => (
                  <span className="text-gray-500 line-clamp-1 max-w-[220px] block">
                    {e.message}
                  </span>
                ),
              },
              {
                key: "created_at",
                label: "Received",
                render: (e) => (
                  <span className="text-gray-500 text-xs">
                    {formatDate(e.created_at)}
                  </span>
                ),
              },
            ]}
          />
        </Card>
      )}

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Enquiry details"
      >
        {selected && (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Interested in
              </p>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                  {selected.listings?.images?.[0] && (
                    <Image
                      src={selected.listings.images[0]}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {selected.listings
                      ? `${selected.listings.year} ${selected.listings.make} ${selected.listings.model}`
                      : "Listing removed"}
                  </p>
                  {selected.listings && (
                    <p className="text-sm text-gray-500">
                      {formatSzl(selected.listings.price)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                From
              </p>
              <p className="font-bold text-gray-900">{selected.name}</p>
              <a
                href={`tel:${selected.phone}`}
                className="text-sm text-[#CD2C58] font-semibold flex items-center gap-1.5 mt-1"
              >
                <FaPhoneAlt size={12} /> {selected.phone}
              </a>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Message
              </p>
              <Body className="text-gray-700 whitespace-pre-wrap">
                {selected.message}
              </Body>
            </div>

            <p className="text-xs text-gray-400">
              Received {formatDate(selected.created_at)}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
