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
  { name: "Alfa Romeo", icon: AlfaRomeoIcon },
  { name: "Aston Martin", icon: AstonMartinIcon },
  { name: "Audi", icon: AudiIcon },
  { name: "Bentley", icon: BentleyIcon },
  { name: "BMW", icon: BMWIcon },
  { name: "BYD", icon: BYDIcon },
  { name: "Chevrolet", icon: ChevroletIcon },
  { name: "Dodge", icon: DodgeIcon },
  { name: "Ferrari", icon: FerrariIcon },
  { name: "Fiat", icon: FiatIcon },
  { name: "Ford", icon: FordIcon },
  { name: "Honda", icon: HondaIcon },
  { name: "Hyundai", icon: HyundaiIcon },
  { name: "Jaguar", icon: JaguarIcon },
  { name: "Jeep", icon: JeepIcon },
  { name: "Kia", icon: KiaIcon },
  { name: "Lamborghini", icon: LamborghiniIcon },
  { name: "Land Rover", icon: LandroverIcon },
  { name: "Lexus", icon: LexusIcon },
  { name: "Maserati", icon: MaseratiIcon },
  { name: "Mazda", icon: MazdaIcon },
  { name: "Mercedes-Benz", icon: MBIcon },
  { name: "Mitsubishi", icon: MitsubishiIcon },
  { name: "Nissan", icon: NissanIcon },
  { name: "Porsche", icon: PorscheIcon },
  { name: "Subaru", icon: SubaruIcon },
  { name: "Tesla", icon: TeslaIcon },
  { name: "Toyota", icon: ToyotaIcon },
  { name: "Volkswagen", icon: VolkswagenIcon },
  { name: "Volvo", icon: VolvoIcon },
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
              className="group flex flex-col items-center justify-center gap-3 px-3 py-5 border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 rounded-lg transition-all duration-300"
            >
              <div className="w-12 h-12 shrink-0 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                <brand.icon className="text-5xl" />
              </div>
              <span className="font-bold text-gray-800 text-sm uppercase tracking-wide text-center leading-snug group-hover:text-[#cd2c58] transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
