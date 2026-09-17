"use client";
import { useParams } from "next/navigation";
import {
  Container,
  Navbar,
  Button,
  CtaButton,
  Section,
  Grid,
  Stack,
  Flex,
  Heading1,
  Heading2,
  Body,
  Divider,
  Badge,
  MileageInfographic,
  KpiGauge,
  ValueScoreBadge,
  MarketRankBadge,
} from "@/components/ui";
import { cars } from "@/lib/data/carData";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  MdPlace,
  MdLocalGasStation,
  MdSettings,
  MdSpeed,
  MdVerified,
  MdShare,
  MdFavoriteBorder,
  MdEmail,
  MdPhone,
  MdChevronLeft,
  MdInfoOutline,
  MdHistory,
  MdBuild,
  MdTimer,
  MdInsights,
} from "react-icons/md";
import Link from "next/link";

export default function ProductPage() {
  const { id } = useParams();
  const rawCar =
    cars.find((c) => c.vehicle_data?.header?.listingId?.toString() === id) ||
    cars[0];

  const car = {
    id: rawCar.vehicle_data?.header?.listingId?.toString() || "0",
    make:
      rawCar.vehicle_data?.header?.registrationYearMakeModel.split(" ")[1] ||
      "Unknown",
    model: rawCar.vehicle_data?.header?.variant || "Unknown",
    year:
      parseInt(
        rawCar.vehicle_data?.header?.registrationYearMakeModel.split(" ")[0],
      ) || 2024,
    price:
      parseInt(rawCar.vehicle_data?.header?.listingPrice.replace(/\D/g, "")) ||
      0,
    mileage: parseInt(
      rawCar.vehicle_data?.summaryIcons
        .find((i) => i.text.includes("km"))
        ?.text.replace(/\D/g, "") || "0",
    ),
    images:
      rawCar.vehicle_data?.gallery?.galleryImages?.map((img) => img.imageUrl) ||
      [],
    fuel:
      rawCar.vehicle_data?.summaryIcons.find((i) =>
        ["Diesel", "Petrol", "Electric", "Hybrid"].includes(i.text),
      )?.text || "Unknown",
    transmission:
      rawCar.vehicle_data?.summaryIcons.find((i) =>
        ["Manual", "Automatic"].includes(i.text),
      )?.text || "Unknown",
    bodyType:
      rawCar.vehicle_data?.additionalInformation.find((i) =>
        i && ["Single cab", "Double cab", "SUV", "Hatchback", "Sedan", "Panel van"].includes(
          i.text,
        ),
      )?.text || "Unknown",
    location:
      rawCar.vehicle_data?.listingSellerInformation?.sellerSuburbName ||
      "Eswatini",
    isFeatured: true,
    isVerified: true,
    marketRank: 1,
    valueScore: 92,
    conditionScore: 95,
    engineSize: "2.0L",
    power: "120",
    torque: "390",
    driveType: "4x4",
    doors: "4",
    seats: "5",
    acceleration: { "0-100kmh": 8.5 },
    sellerName: rawCar.vehicle_data?.listingDealer?.name || "Khazu Partner",
    sellerType: "dealer",
    fuelType:
      rawCar.vehicle_data?.summaryIcons.find((i) =>
        ["Diesel", "Petrol", "Electric", "Hybrid"].includes(i.text),
      )?.text || "Unknown",
    annualDistance: 15000,
    remainingLifespan: 8,
    majorServiceDue: "None" as const,
    tireWear: 30,
    brakeWear: 25,
  };

  return (
    <div className="min-h-dvh bg-cream/10 pb-20">
      <Navbar
        logo={
          <h1 className="text-2xl font-display font-bold text-gray-800">
            Khazu
          </h1>
        }
        links={[
          { label: "Marketplace", href: "/listings" },
          { label: "Documentation", href: "/docs" },
        ]}
      />

      {/* Breadcrumb & Top Actions */}
      <Container className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/listings"
            className="flex items-center gap-2 text-gray-800/40 hover:text-gray-800 transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <MdChevronLeft size={20} /> Back to Marketplace
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-black/5 shadow-sm"
            >
              <MdShare className="mr-2" /> Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-black/5 shadow-sm"
            >
              <MdFavoriteBorder className="mr-2" /> Save
            </Button>
          </div>
        </div>
      </Container>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visuals & Specs */}
          <div className="lg:col-span-8 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg overflow-hidden border border-black/5 shadow-sm">
              <div className="aspect-[16/9] relative group">
                <img
                  src={car.images[0]}
                  className="w-full h-full object-cover"
                  alt={car.make}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {car.isFeatured && (
                    <Badge variant="primary" className="shadow-xl">
                      Featured
                    </Badge>
                  )}
                  {car.isVerified && (
                    <Badge
                      variant="secondary"
                      className="bg-white/90 backdrop-blur text-gray-800 border-0 shadow-xl"
                    >
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1 p-1">
                {car.images.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-dark/5 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt="Gallery"
                    />
                  </div>
                ))}
                <div className="aspect-square bg-dark flex flex-col items-center justify-center text-white cursor-pointer hover:bg-dark/90 transition-colors">
                  <span className="text-xl font-bold">+12</span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Photos
                  </span>
                </div>
              </div>
            </div>

            {/* Header Info */}
            <div className="bg-white rounded-lg p-8 border border-black/5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-[#CD2C58] uppercase tracking-widest">
                      {car.year} Model
                    </span>
                    <span className="w-1 h-1 rounded-full bg-dark/10" />
                    <MarketRankBadge rank={car.marketRank} />
                  </div>
                  <Heading1 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none">
                    {car.make} {car.model}
                  </Heading1>
                  <div className="flex items-center gap-4 mt-4 text-gray-800/40 font-bold uppercase tracking-wider text-xs">
                    <span className="flex items-center gap-1.5">
                      <MdPlace className="text-[#CD2C58]" /> {car.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MdSpeed className="text-[#CD2C58]" />{" "}
                      {car.mileage.toLocaleString()} km
                    </span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-4xl md:text-5xl font-display font-black text-gray-800 tracking-tighter leading-none mb-2">
                    <span className="text-sm font-bold text-gray-800/30 mr-2 uppercase">
                      SZL
                    </span>
                    {car.price.toLocaleString()}
                  </div>
                  <ValueScoreBadge score={car.valueScore} />
                </div>
              </div>

              <Divider className="my-8" />

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <SpecItem
                  icon={<MdLocalGasStation />}
                  label="Fuel"
                  value={car.fuel}
                />
                <SpecItem
                  icon={<MdSettings />}
                  label="Transmission"
                  value={car.transmission}
                />
                <SpecItem icon={<MdHistory />} label="Owners" value="1 Owner" />
                <SpecItem
                  icon={<MdVerified />}
                  label="History"
                  value="Full Service"
                />
              </div>
            </div>

            {/* KPI Dashboard */}
            <div className="bg-dark text-white rounded-lg p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#CD2C58]/10 blur-[80px] -mr-32 -mt-32" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <MdInsights className="text-[#CD2C58]" size={24} />
                  <h3 className="text-xl font-black uppercase tracking-widest">
                    Khazu KPI Dashboard
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                  <KpiGauge
                    value={car.valueScore}
                    label="Market Value"
                    color="stroke-[#CD2C58]"
                  />
                  <KpiGauge
                    value={car.conditionScore}
                    label="Mechanical"
                    color="stroke-[#CD2C58]"
                  />
                  <KpiGauge
                    value={88}
                    label="Price History"
                    color="stroke-[#CD2C58]"
                  />
                </div>

                <div className="mt-10 p-4 bg-white/5 rounded-lg border border-white/10 flex items-start gap-4">
                  <MdInfoOutline
                    className="text-[#CD2C58] shrink-0 mt-1"
                    size={20}
                  />
                  <p className="text-sm text-white/60 leading-relaxed">
                    <b>Khazu AI Analysis:</b> This vehicle is priced{" "}
                    <span className="text-[#CD2C58]">4.2% below average</span>{" "}
                    for the Mbabane region. Given its exceptional mechanical
                    score of {car.conditionScore}%, we rate this as a{" "}
                    <b>Great Deal</b> for long-term ownership.
                  </p>
                </div>
              </div>
            </div>

            {/* Mileage Infographic */}
            <MileageInfographic {...car} />

            {/* Detailed Specs */}
            <div className="bg-white rounded-lg p-8 border border-black/5 shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                <MdBuild className="text-[#CD2C58]" /> Technical Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <SpecRow label="Engine Size" value={car.engineSize} />
                <SpecRow label="Power Output" value={`${car.power} hp`} />
                <SpecRow label="Torque" value={`${car.torque} Nm`} />
                <SpecRow label="Drive Type" value={car.driveType} />
                <SpecRow label="Body Type" value={car.bodyType} />
                <SpecRow label="Doors" value={car.doors} />
                <SpecRow label="Seats" value={car.seats} />
                <SpecRow
                  label="Acceleration"
                  value={`${car.acceleration["0-100kmh"].toFixed(1)}s (0-100)`}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Seller & Actions */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            {/* Contact Card */}
            <div className="bg-white rounded-lg p-6 border border-black/5 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-dark rounded-lg flex items-center justify-center text-white font-display font-black text-xl">
                  {car.sellerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{car.sellerName}</h4>
                  <p className="text-xs font-bold text-gray-800/40 uppercase tracking-widest">
                    {car.sellerType === "dealer"
                      ? "Premium Dealer"
                      : "Private Seller"}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge variant="success">Online</Badge>
                </div>
              </div>

              <Stack spacing="md">
                <CtaButton
                  variant="primary"
                  className="font-black uppercase tracking-widest"
                >
                  <MdPhone className="mr-2" size={18} /> Reveal Phone
                </CtaButton>
                <CtaButton
                  variant="secondary"
                  className="font-black uppercase tracking-widest bg-gray-900 hover:bg-[#1a1a1a] text-white"
                >
                  <MdEmail className="mr-2" size={18} /> Message Seller
                </CtaButton>
              </Stack>

              <div className="mt-6 pt-6 border-t border-black/5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-800/40 mb-4">
                  <span>Safety Checklist</span>
                  <span className="text-[#CD2C58]">100% Secure</span>
                </div>
                <ul className="space-y-2">
                  <CheckListItem text="Verified Vehicle Identity" />
                  <CheckListItem text="Escrow Payment Support" />
                  <CheckListItem text="Ownership Verified" />
                </ul>
              </div>
            </div>

            {/* Market Comparison */}
            <div className="bg-cream/30 rounded-lg p-6 border border-black/5">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-800 mb-4">
                Market Comparison
              </h4>
              <div className="space-y-4">
                <ComparisonBar label="Market Average" value={85} active />
                <ComparisonBar label="This Listing" value={car.valueScore} />
              </div>
              <p className="text-[10px] font-medium text-gray-800/40 mt-4 leading-relaxed">
                * Based on data from 42 similar {car.make} {car.model} listings
                in the last 90 days.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function SpecItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center p-4 bg-cream/30 rounded-lg border border-black/5">
      <div className="text-[#CD2C58] mb-2 text-2xl">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-800/40 mb-1">
        {label}
      </span>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-black/5 last:border-0">
      <span className="text-sm font-bold text-gray-800/40 uppercase tracking-widest">
        {label}
      </span>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  );
}

function CheckListItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-xs font-bold text-gray-800/60">
      <MdVerified className="text-[#CD2C58] shrink-0" /> {text}
    </li>
  );
}

function ComparisonBar({
  label,
  value,
  active = false,
}: {
  label: string;
  value: number;
  active?: boolean;
}) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
        <span className={active ? "text-[#CD2C58]" : "text-gray-800/40"}>
          {label}
        </span>
        <span className="text-gray-800">{value}%</span>
      </div>
      <div className="h-1 bg-dark/5 rounded-full overflow-hidden">
        <div
          className={twMerge(
            clsx(
              "h-full rounded-full transition-all duration-1000",
              active ? "bg-[#CD2C58]" : "bg-dark/20",
            ),
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
