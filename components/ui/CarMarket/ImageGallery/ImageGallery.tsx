"use client";
import { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

export function ImageGallery({ images, className = "" }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  return (
    <div className={twMerge(clsx("space-y-2", className))}>
      <div className="relative aspect-[16/10] rounded-lg overflow-hidden shadow-sm border border-black/5 bg-dark/5">
        <img
          src={images[current]}
          alt={`Gallery ${current + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={twMerge(
              clsx(
                "w-20 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                i === current
                  ? "border[#CD2C58] ring-2 ring[#CD2C58]/20 scale-95"
                  : "border-transparent opacity-60 hover:opacity-100",
              ),
            )}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
