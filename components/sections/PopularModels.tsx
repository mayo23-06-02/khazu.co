"use client";

import Link from "next/link";
import { Container, Grid, Heading1 } from "@/components/ui";

const popularModels = [
  "Used Audi A1 Sportback",
  "Used Citroen C5 Aircross",
  "Used Fiat 500",
  "Used Ford Fiesta",
  "Used Hyundai i10",
  "Used Hyundai Ioniq 5",
  "Used Jaguar E-PACE",
  "Used Jaguar F-PACE",
  "Used Jaguar I-PACE",
  "Used Kia Ceed",
  "Used Kia Niro",
  "Used Kia Picanto",
  "Used Kia XCeed",
  "Used Land Rover Defender 110",
  "Used Mazda CX-5",
  "Used Mercedes-Benz A-Class",
  "Used Mercedes-Benz CLA",
  "Used Mercedes-Benz GLA",
  "Used MG MG4 EV",
  "Used MG ZS",
  "Used Peugeot 208",
  "Used Peugeot 3008",
  "Used Polestar 2",
  "Used Renault Clio",
  "Used SEAT Ateca",
  "Used SEAT Ibiza",
  "Used SEAT Leon",
  "Used Skoda Kodiaq",
  "Used Toyota Aygo X",
  "Used Toyota Yaris Cross",
  "Used Vauxhall Corsa",
  "Used Vauxhall Grandland X",
  "Used Vauxhall Mokka",
  "Used Volkswagen T-Cross",
  "Used Volkswagen Tiguan",
];

export function PopularModels() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <Container>
        <Heading1 className="mb-8">Popular used car models</Heading1>
        <Grid cols={4} sm={3} md={4} lg={5} gap="md">
          {popularModels.map((model, i) => (
            <Link
              key={i}
              href={`/listings?make=${model.replace("Used ", "")}`}
              className="font-bold text-gray-800 hover:text-[#cd2c58] transition-colors"
            >
              {model}
            </Link>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
