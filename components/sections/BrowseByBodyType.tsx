"use client";

import Link from "next/link";
import Image from "next/image";
import { Container, Heading1 } from "@/components/ui";

const bodyTypes = [
  { name: "Hatchback", image: "/car-type/hatchback.png" },
  { name: "Estate", image: "/car-type/estate.png" },
  { name: "SUV", image: "/car-type/suv.png" },
  { name: "Saloon", image: "/car-type/saloon.png" },
  { name: "Coupe", image: "/car-type/coupe.png" },
  { name: "People Carrier", image: "/car-type/people-carrier.png" },
  { name: "Convertible", image: "/car-type/convertible.png" },
  { name: "Pick-Up", image: "/car-type/pick-up.png" },
];

export function BrowseByBodyType() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <Container>
        <Heading1 className="mb-8">Browse by Body Type</Heading1>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {bodyTypes.map((type, i) => (
            <Link
              key={i}
              href={`/listings?bodyType=${encodeURIComponent(type.name)}`}
              className="group flex flex-col items-center justify-center p-4 bg-white hover:bg-[#CD2C58]/10 rounded-md border border-gray-200  transition-all duration-300"
            >
              <div className="w-full relative aspect-[4/3] mb-3 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={type.image}
                  alt={type.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                />
              </div>
              <span className="font-bold text-sm text-gray-800 text-center">
                {type.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
