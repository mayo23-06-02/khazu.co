"use client";

import Link from "next/link";
import { Container, Grid, Heading1 } from "@/components/ui";
import {
  ToyotaIcon,
  VolkswagenIcon,
  FordIcon,
  NissanIcon,
  HondaIcon,
  MBIcon,
  BMWIcon,
  AudiIcon,
  HyundaiIcon,
  KiaIcon,
  MazdaIcon,
  LexusIcon,
  LandroverIcon,
  JeepIcon,
  TeslaIcon,
  PorscheIcon,
  FerrariIcon,
  LamborghiniIcon,
  MaseratiIcon,
  AstonMartinIcon,
  BentleyIcon,
  JaguarIcon,
  VolvoIcon,
  FiatIcon,
  MitsubishiIcon,
  SubaruIcon,
  ChevroletIcon,
  DodgeIcon,
  AlfaRomeoIcon,
  BYDIcon,
} from "@cardog-icons/react";

const manufacturers = [
  { name: "Toyota", icon: ToyotaIcon },
  { name: "Volkswagen", icon: VolkswagenIcon },
  { name: "Ford", icon: FordIcon },
  { name: "Nissan", icon: NissanIcon },
  { name: "Honda", icon: HondaIcon },
  { name: "Mercedes-Benz", icon: MBIcon },
  { name: "BMW", icon: BMWIcon },
  { name: "Audi", icon: AudiIcon },
  { name: "Hyundai", icon: HyundaiIcon },
  { name: "Kia", icon: KiaIcon },
  { name: "Mazda", icon: MazdaIcon },
  { name: "Lexus", icon: LexusIcon },
  { name: "Land Rover", icon: LandroverIcon },
  { name: "Jeep", icon: JeepIcon },
  { name: "Tesla", icon: TeslaIcon },
  { name: "Porsche", icon: PorscheIcon },
  { name: "Ferrari", icon: FerrariIcon },
  { name: "Lamborghini", icon: LamborghiniIcon },
  { name: "Maserati", icon: MaseratiIcon },
  { name: "Aston Martin", icon: AstonMartinIcon },
  { name: "Bentley", icon: BentleyIcon },
  { name: "Jaguar", icon: JaguarIcon },
  { name: "Volvo", icon: VolvoIcon },
  { name: "Fiat", icon: FiatIcon },
  { name: "Mitsubishi", icon: MitsubishiIcon },
  { name: "Subaru", icon: SubaruIcon },
  { name: "Chevrolet", icon: ChevroletIcon },
  { name: "Dodge", icon: DodgeIcon },
  { name: "Alfa Romeo", icon: AlfaRomeoIcon },
  { name: "BYD", icon: BYDIcon },
];

export function BrowseByManufacturer() {
  return (
    <section className="py-8 md:py-12 bg-white">
      <Container>
        <Heading1 className="mb-6 text-xl md:text-2xl">Browse by Car Manufacturer</Heading1>
        <Grid cols={2} md={3} lg={4} gap="sm">
          {manufacturers.map((brand, i) => (
            <Link
              key={i}
              href={`/listings?make=${brand.name}`}
              className="group flex items-center gap-3 px-2.5 py-2.5 hover:bg-gray-50/50 rounded-lg transition-all duration-300"
            >
              <div className="w-10 h-10 shrink-0 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                <brand.icon className="text-3xl" />
              </div>
              <span className="font-bold text-gray-800 text-sm sm:text-base uppercase tracking-wide group-hover:text-[#cd2c58] transition-colors truncate">
                {brand.name}
              </span>
            </Link>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
