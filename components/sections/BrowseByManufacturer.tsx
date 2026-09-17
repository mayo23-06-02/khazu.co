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
    <section className="py-10 md:py-14 bg-white">
      <Container>
        <Heading1 className="mb-8">Browse by Car Manufacturer</Heading1>
        <Grid cols={1} sm={2} md={2} lg={4} gap="sm">
          {manufacturers.map((brand, i) => (
            <Link
              key={i}
              href={`/listings?make=${brand.name}`}
              className="group flex items-center justify-start px-4 hover:bg-gray-50/50 rounded-lg transition-all duration-300"
            >
              <div className="ml-3 w-24 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                <brand.icon className="text-6xl" />
              </div>
              <span className="font-bold text-gray-800 uppercase tracking-wider group-hover:text-[#cd2c58] transition-colors text-center">
                {brand.name}
              </span>
            </Link>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
