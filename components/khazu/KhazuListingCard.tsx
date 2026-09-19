"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui";
import { ApifyListing } from "@/lib/data/apifyData";
import { twMerge } from "tailwind-merge";
import { MdTrendingDown } from "react-icons/md";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaTachometerAlt,
  FaCogs,
  FaGasPump,
} from "react-icons/fa";

interface KhazuListingCardProps {
  data: ApifyListing;
}

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80";

export function KhazuListingCard({ data }: KhazuListingCardProps) {
  const { header, gallery, summaryIcons, priceInformation } = data.vehicle_data;

  const images =
    gallery.galleryImages?.map((g) => g.imageUrl).filter(Boolean) ?? [];
  const slides = images.length > 0 ? images : [PLACEHOLDER];

  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, slides.length - 1);

  // Extract summary info
  const year = summaryIcons.find((i) => i.text.match(/^\d{4}$/))?.text || "N/A";
  const mileage =
    summaryIcons.find(
      (i) =>
        i.text.toLowerCase().includes("miles") ||
        i.text.toLowerCase().includes("km"),
    )?.text || "N/A";
  const transmission =
    summaryIcons.find((i) => i.text === "Manual" || i.text === "Automatic")
      ?.text || "N/A";
  const fuel =
    summaryIcons.find((i) =>
      ["Diesel", "Petrol", "Electric", "Hybrid"].includes(i.text),
    )?.text || "N/A";

  const repayment = priceInformation.repaymentPrice?.estimatedRepayment;
  const apr = "8.9%";
  const priceDropPercent = header.priceDropPercent;
  const previousListingPrice = header.previousListingPrice;

  const goTo = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(index);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((i) => (i - 1 + slides.length) % slides.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((i) => (i + 1) % slides.length);
  };

  const hasMultiplePhotos = slides.length > 1;

  return (
    <Card
      padding="none"
      className="group w-full overflow-hidden transition-all duration-300 border cursor-pointer hover:-translate-y-2 delay-200 ease-in-out border-gray-100 bg-white flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link
          href={`/deals/${header.listingId}`}
          className="absolute inset-0 block"
        >
          {slides.map((src, idx) => (
            <Image
              key={`${src}-${idx}`}
              src={src}
              alt={`${header.registrationYearMakeModel} photo ${idx + 1}`}
              fill
              className={twMerge(
                "object-cover transition-opacity duration-300",
                idx === safeIndex ? "opacity-100 z-[1]" : "opacity-0 z-0",
              )}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={idx === 0}
            />
          ))}
        </Link>

        {/* Top Left: Price Drop + Repayment Badges (repayment only on sponsored listings) */}
        <div className="absolute top-3 left-3 z-[2] pointer-events-none flex flex-col items-start gap-1.5">
          {!!priceDropPercent && (
            <div className="flex items-center gap-1 bg-[#CD2C58] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              <MdTrendingDown size={13} />-{priceDropPercent}%
            </div>
          )}
          {header.isSponsored && repayment && (
            <div className="bg-[#e2f38c] text-gray-900 text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-sm border border-black/5">
              From {repayment}pm ({apr} APR)
            </div>
          )}
        </div>

        {/* Top Right: Ad Badge — sponsored listings only */}
        {header.isSponsored && (
          <div className="absolute top-2.5 right-2.5 z-[2] pointer-events-none">
            <div className="bg-white text-gray-900 text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
              Ad
            </div>
          </div>
        )}

        {/* Bottom Overlay: Disclaimer — only relevant alongside the finance badge */}
        {header.isSponsored && repayment && (
          <div className="absolute bottom-1.5 left-0 right-0 px-4 text-end z-[2] pointer-events-none">
            <p className="text-[8px] text-white/90 leading-tight font-medium">
              Subject to status. T&Cs apply.
            </p>
          </div>
        )}

        {/* Prev/Next arrows — operational carousel, shown whenever there's more than one photo */}
        {hasMultiplePhotos && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-[2] w-8 h-8 rounded-full bg-white/90 text-gray-900 shadow-sm flex items-center justify-center hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CD2C58]/40"
            >
              <FaChevronLeft size={12} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-[2] w-8 h-8 rounded-full bg-white/90 text-gray-900 shadow-sm flex items-center justify-center hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CD2C58]/40"
            >
              <FaChevronRight size={12} />
            </button>
          </>
        )}
      </div>

      {/* Carousel dots — one per image */}
      {hasMultiplePhotos && (
        <div
          className="flex justify-center items-center gap-1.5 py-2.5"
          role="tablist"
          aria-label="Listing photos"
        >
          {slides.map((_, idx) => {
            const isActive = idx === safeIndex;
            return (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show photo ${idx + 1} of ${slides.length}`}
                onClick={(e) => goTo(idx, e)}
                className={twMerge(
                  "rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CD2C58]/40",
                  isActive
                    ? "w-2 h-2 bg-gray-900"
                    : idx === safeIndex + 1 || idx === safeIndex - 1
                      ? "w-2 h-2 bg-gray-300"
                      : "w-1.5 h-1.5 bg-gray-200",
                )}
              />
            );
          })}
        </div>
      )}

      <Link href={`/deals/${header.listingId}`} className="flex-grow flex flex-col">
        <CardBody className="px-5 pb-5 pt-0 flex-grow flex flex-col">
          {/* Used Badge */}
          <div className="mb-2.5">
            <span className="bg-[#1a1a1a] text-white text-[11px] font-bold px-2.5 py-1 rounded tracking-wide">
              Used
            </span>
          </div>

          {/* Subtitle / Variant */}
          <p className="text-gray-500 text-sm font-medium mb-1 line-clamp-1">
            {header.variant || "1.6T GDi ISG 3"}
          </p>

          {/* Title / Make Model */}
          <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-4">
            {header.registrationYearMakeModel.split(" ").slice(1).join(" ")}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-2xl font-extrabold text-gray-900">
              {header.listingPrice}
            </span>
            {previousListingPrice && (
              <span className="text-sm text-gray-400 line-through">
                {previousListingPrice}
              </span>
            )}
          </div>

          {/* 4 key details, icon next to each value */}
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-y-2 gap-x-3">
            <div className="flex items-center gap-2 text-gray-800">
              <FaCalendarAlt className="text-gray-400 shrink-0" size={13} />
              <span className="font-bold text-[13px]">{year}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-800">
              <FaTachometerAlt className="text-gray-400 shrink-0" size={13} />
              <span className="font-bold text-[13px]">{mileage}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-800">
              <FaCogs className="text-gray-400 shrink-0" size={13} />
              <span className="font-bold text-[13px]">{transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-800">
              <FaGasPump className="text-gray-400 shrink-0" size={13} />
              <span className="font-bold text-[13px]">{fuel}</span>
            </div>
          </div>
        </CardBody>
      </Link>
    </Card>
  );
}
