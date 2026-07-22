"use client"
import { useState, useRef } from "react";
import { MdFavoriteBorder, MdSync, MdTrendingDown } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

interface CarCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  bodyType: string;
  location: string;
  images?: string[];
  image: string; // Keep for backward compatibility
  spec?: string;
  statusLabel?: string;
  priceDropPercentage?: number;
  isFeatured?: boolean;
  isVerified?: boolean;
  sellerType: "private" | "dealer";
  valueScore: number;
  conditionScore: number;
  dealRating: "Great" | "Good" | "Fair" | "Overpriced";
  marketRank: number;
  onSave?: () => void;
  onContact?: () => void;
  className?: string;
}

export function CarCard({
  id,
  make,
  model,
  year,
  price,
  mileage,
  fuel,
  transmission,
  images = [],
  image,
  spec,
  statusLabel,
  priceDropPercentage,
  onSave,
  className = "",
}: CarCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currency, setCurrency] = useState<"SZL" | "GBP">("SZL");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Combine image and images array
  const displayImages = images.length > 0 ? images : [image];

  // Mock conversion rate
  const convertedPrice = currency === "SZL" ? price : price * 0.042;
  const convertedSaving =
    currency === "SZL" ? price * 0.2 : price * 0.2 * 0.042;

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(
        scrollRef.current.scrollLeft / scrollRef.current.offsetWidth,
      );
      setActiveIndex(index);
    }
  };

  const toggleCurrency = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrency(currency === "SZL" ? "GBP" : "SZL");
  };

  return (
    <Link
      href={`/deal/${id}`}
      className={twMerge(
        clsx(
          "bg-white rounded-lg overflow-hidden hover:shadow-sm cursor-pointer transition-all duration-500 group flex flex-col no-underline",
          className,
        ),
      )}
    >
      {/* Image Header / Carousel */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-none no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayImages.map((img, idx) => (
            <div key={idx} className="w-full h-full shrink-0 snap-center">
              <img
                src={img}
                alt={`${make} ${model} - ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-none">
          {displayImages.map((_, idx) => (
            <span
              key={idx}
              className={twMerge(
                clsx(
                  "rounded-full shadow-sm transition-all duration-300",
                  activeIndex === idx
                    ? "w-2.5 h-2.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/40",
                ),
              )}
            />
          ))}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSave?.();
          }}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-2.5 hover:bg-white transition-all text-gray-900 shadow-lg border border-white/20 z-10"
          aria-label="Save listing"
        >
          <MdFavoriteBorder size={22} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col space-y-2">
        <div className="flex flex-col gap-2">
          {/* Status Badge */}
          <div className="flex justify-between items-center w-full">
            <span className="bg-[#cd2c58] text-white text-[11px] uppercase font-bold px-3 py-1.5 rounded-md">
              {statusLabel || "Used"}
            </span>
            {statusLabel === "Price Drop" && priceDropPercentage && (
              <div className="flex items-center gap-1 text-[#00875a] font-bold text-xs">
                <MdTrendingDown size={16} />
                <span>-{priceDropPercentage}%</span>
              </div>
            )}
          </div>

          {/* Subtitle/Spec */}
          <p className="text-gray-500 text-xs font-light tracking-tight uppercase">
            {spec || "Premium Executive AWD Auto Excellence"}
          </p>

          {/* Title */}
          <p className="text-2xl font-semibold text-[#cd2c58] tracking-tighter leading-none">
            {make} {model}
          </p>

          {/* Key Specs */}
          <p className="text-md font-light text-gray-900 tracking-tight">
            {transmission} • {fuel}
          </p>
        </div>

        {/* Pricing & Savings with Currency Converter */}
        <div className="flex flex-col gap-1 ">
          <button
            onClick={toggleCurrency}
            className="flex items-baseline gap-3 group/price text-left"
            title="Click to convert currency"
          >
            <span className="text-lg font-bold text-gray-900  flex items-center gap-1.5">
              {currency === "SZL" ? "SZL" : "£"}{" "}
              {convertedPrice.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
              <MdSync
                className="text-gray-400 opacity-0 group-hover/price:opacity-100 transition-opacity"
                size={14}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Footer Section (Separator) */}
      <div className="mt-auto">
        <div className="h-[1px] bg-gray-100 mx-6" />
        <div className="px-6 py-5 flex items-center gap-2">
          <span className="text-md text-gray-900 tracking-tight">{year}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mx-1" />
          <span className="text-md text-gray-900 tracking-tight">
            {mileage.toLocaleString()} miles
          </span>
        </div>
      </div>
    </Link>
  );
}
