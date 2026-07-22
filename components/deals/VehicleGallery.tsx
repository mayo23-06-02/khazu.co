"use client";

import { useState } from "react";
import Image from "next/image";
import { FaCamera, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80";

export function VehicleGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const gallery = images.length > 0 ? images : [PLACEHOLDER];
  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setActive((i) => (i + 1) % gallery.length);

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {gallery.length > 1 && (
        <div className="hidden md:flex flex-col gap-2 w-24 lg:w-28 shrink-0 max-h-[480px] overflow-y-auto">
          {gallery.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActive(idx)}
              className={twMerge(
                "relative aspect-[4/3] rounded-md overflow-hidden border-2 transition-all",
                active === idx
                  ? "border-gray-700"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="112px" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 aspect-[4/3] md:min-h-[420px] rounded-md overflow-hidden bg-gray-100 group">
        <Image
          src={gallery[active]}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous photo"
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next photo"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        <div className="absolute bottom-4 right-4 bg-[#1a1a1a]/65 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
          <FaCamera />
          {active + 1}/{gallery.length}
        </div>
      </div>

      {gallery.length > 1 && (
        <div className="flex md:hidden gap-2 overflow-x-auto pb-1">
          {gallery.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActive(idx)}
              className={twMerge(
                "relative w-16 h-12 shrink-0 rounded-lg overflow-hidden border-2",
                active === idx ? "border-[#CD2C58]" : "border-transparent",
              )}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
