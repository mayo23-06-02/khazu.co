// components/ui/Hero/MainHero.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Autocomplete,
  Container,
  Grid,
  Flex,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Body,
  Small,
  Caption,
  InputText,
  Select,
  Button,
  Badge,
  IconButton,
  Avatar,
  Divider,
  Spacer,
  Stack,
  CtaButton,
  SearchBar,
} from "@/components/ui";
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
  { label: "Toyota", value: "Toyota", icon: ToyotaIcon },
  { label: "Volkswagen", value: "Volkswagen", icon: VolkswagenIcon },
  { label: "Ford", value: "Ford", icon: FordIcon },
  { label: "Nissan", value: "Nissan", icon: NissanIcon },
  { label: "Honda", value: "Honda", icon: HondaIcon },
  { label: "Mercedes-Benz", value: "Mercedes-Benz", icon: MBIcon },
  { label: "BMW", value: "BMW", icon: BMWIcon },
  { label: "Audi", value: "Audi", icon: AudiIcon },
  { label: "Hyundai", value: "Hyundai", icon: HyundaiIcon },
  { label: "Kia", value: "Kia", icon: KiaIcon },
  { label: "Mazda", value: "Mazda", icon: MazdaIcon },
  { label: "Lexus", value: "Lexus", icon: LexusIcon },
  { label: "Land Rover", value: "Land Rover", icon: LandroverIcon },
  { label: "Jeep", value: "Jeep", icon: JeepIcon },
  { label: "Tesla", value: "Tesla", icon: TeslaIcon },
  { label: "Porsche", value: "Porsche", icon: PorscheIcon },
  { label: "Ferrari", value: "Ferrari", icon: FerrariIcon },
  { label: "Lamborghini", value: "Lamborghini", icon: LamborghiniIcon },
  { label: "Maserati", value: "Maserati", icon: MaseratiIcon },
  { label: "Aston Martin", value: "Aston Martin", icon: AstonMartinIcon },
  { label: "Bentley", value: "Bentley", icon: BentleyIcon },
  { label: "Jaguar", value: "Jaguar", icon: JaguarIcon },
  { label: "Volvo", value: "Volvo", icon: VolvoIcon },
  { label: "Fiat", value: "Fiat", icon: FiatIcon },
  { label: "Mitsubishi", value: "Mitsubishi", icon: MitsubishiIcon },
  { label: "Subaru", value: "Subaru", icon: SubaruIcon },
  { label: "Chevrolet", value: "Chevrolet", icon: ChevroletIcon },
  { label: "Dodge", value: "Dodge", icon: DodgeIcon },
  { label: "Alfa Romeo", value: "Alfa Romeo", icon: AlfaRomeoIcon },
  { label: "BYD", value: "BYD", icon: BYDIcon },
];
import {
  FaSearch,
  FaHeart,
  FaUser,
  FaCar,
  FaMotorcycle,
  FaChevronRight,
  FaChevronDown,
  FaClock,
  FaStar,
  FaShieldAlt,
  FaArrowRight,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTag,
  FaPercentage,
} from "react-icons/fa";
import { FaVanShuttle } from "react-icons/fa6";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { useRouter } from "next/navigation";

interface MainHeroProps {
  className?: string;
  /** Real count of active listings — shown instead of a made-up figure. */
  listingCount?: number;
}

export function MainHero({ className = "", listingCount = 0 }: MainHeroProps) {
  const formattedCount = new Intl.NumberFormat("en-SZ").format(listingCount);
  const carWord = listingCount === 1 ? "car" : "cars";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchData, setSearchData] = useState({
    make: "",
    model: "",
    postcode: "",
    maxPrice: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.make) params.append("make", searchData.make);
    if (searchData.maxPrice) params.append("maxPrice", searchData.maxPrice);
    if (activeTab !== "all") params.append("condition", activeTab);

    router.push(`/listings?${params.toString()}`);
  };

  const handleQuickSearch = (query: string) => {
    if (!query) return;
    router.push(`/listings?make=${encodeURIComponent(query)}`);
  };

  const tabs = [
    {
      id: "all",
      label: "All",
      icon: <FaCar size={14} />,
    },
    {
      id: "used",
      label: "Used",
      icon: <FaPercentage size={14} />,
    },
    {
      id: "new",
      label: "New",
      icon: <FaTag size={14} />,
      isNew: true,
    },
  ];

  return (
    <section
      className={twMerge(
        clsx("bg-[#a72346] py-10 md:py-14 flex flex-col", className),
      )}
    >
      <Container className="flex-1 flex flex-col">
        {/* ─── Main Hero Content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 py-4 md:py-8 flex-1 items-start">
          {/* Left Column: Search Card */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-white rounded-md overflow-hidden shadow-lg">
              {/* Custom Tab Bar */}
              <div className="flex bg-[#f4f7f5]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={twMerge(
                      clsx(
                        "flex-1 flex flex-col items-center justify-center py-3 px-1 transition-all relative",
                        activeTab === tab.id
                          ? "bg-white rounded-t-md shadow-[0_-8px_20px_rgba(0,0,0,0.05)] z-10"
                          : "bg-gray-100 text-gray-800/40 hover:text-gray-800/60",
                      ),
                    )}
                  >
                    <div className="h-6 mb-0.5 flex items-center justify-center relative">
                      {tab.icon}
                      {tab.isNew && (
                        <span className="absolute -top-2 -right-6 bg-[#CD2C58] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md border border-[#11382b]/10">
                          New
                        </span>
                      )}
                    </div>
                    <span
                      className={clsx(
                        "text-sm md:text-base tracking-tight",
                        activeTab === tab.id
                          ? "text-gray-800"
                          : "text-gray-800/70",
                      )}
                    >
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-display text-gray-800 tracking-tight">
                    Find used cars for sale
                  </h2>
                  <p className="text-gray-800/60 font-medium text-sm mt-0.5">
                    From 500+ dealers nationwide
                  </p>
                </div>

                <div className=" gap-2 md:gap-2">
                  <div className="space-y-3 md:space-y-4 flex flex-col w-full">
                    <Autocomplete
                      options={manufacturers}
                      value={searchData.make}
                      onChange={(value) =>
                        setSearchData({ ...searchData, make: value })
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Select make"
                      className="rounded-lg font-medium text-gray-800"
                    />
                    <Select
                      options={[
                        { value: "", label: "Max price" },
                        { value: "25000", label: "SZL25,000" },
                        { value: "40000", label: "SZL40,000" },
                        { value: "60000", label: "SZL60,000" },
                        { value: "100000", label: "SZL100,000" },
                        { value: "250000", label: "SZL250,000" },
                        { value: "500000", label: "SZL500,000" },
                        { value: "750000", label: "SZL750,000" },
                        { value: "1000000", label: "SZL1,000,000" },
                        { value: "1500000", label: "SZL1,500,000" },
                        { value: "2000000", label: "SZL2,000,000" },
                      ]}
                      value={searchData.maxPrice}
                      onChange={(e) =>
                        setSearchData({
                          ...searchData,
                          maxPrice: e.target.value,
                        })
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      fullWidth
                    />
                  </div>
                </div>

                <CtaButton
                  className="text-white h-12 md:h-14 text-sm md:text-base"
                  onClick={handleSearch}
                >
                  Search {formattedCount} {carWord}
                  <div className="w-8 h-8 md:w-10 md:h-10 ml-2 md:ml-4 rounded-full flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                    <FaSearch size={14} />
                  </div>
                </CtaButton>
              </div>
            </div>
          </div>

          {/* Right Column: Headline + Image */}
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-10 justify-center">
            {/* Search Bar - hidden on mobile since it's in the card */}
            <div className="hidden lg:block">
              <SearchBar onSearch={handleQuickSearch} />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="flex-1">
                <div className="mb-4 md:mb-6">
                  <Heading1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-100 tracking-tight leading-[1.1] mb-3 md:mb-4">
                    Welcome to the <br /> all-new Khazu.co
                  </Heading1>

                  <p className="text-gray-300 text-base sm:text-lg md:text-xl font-light max-w-2xl mb-4 md:mb-6 leading-relaxed">
                    From verified dealers to private sellers, we bring you the
                    widest selection of quality vehicles across Eswatini — all
                    in one trusted marketplace.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-gray-100 text-gray-100 rounded-full px-6 md:px-8 py-2 md:py-3 hover:bg-dark hover:text-white transition-all text-sm md:text-base"
                    onClick={() => router.push("/listings")}
                  >
                    Browse cars for sale
                  </Button>
                  <div className="mt-4 md:mt-6 border-t border-gray-50/20 pt-4 md:pt-5 flex flex-wrap items-center gap-3 md:gap-4">
                    <div className="flex text-white gap-1">
                      {[...Array(4)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={16}
                          className="text-yellow-500 fill-current"
                        />
                      ))}
                      <FaStar size={16} className="text-gray-200" />
                    </div>
                    <span className="text-gray-100 text-xs md:text-sm flex items-center gap-1">
                      <FaStar
                        className="text-green-600 fill-current"
                        size={14}
                      />
                      1,914 reviews on{" "}
                      <span className="text-green-500 font-bold">
                        Trustpilot
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative flex-1 max-w-full lg:max-w-[30vw] xl:max-w-[20vw] overflow-hidden rounded-lg ">
                {/* Using a placeholder image; replace with your actual image */}
                <div className="relative lg:aspect-4/3 aspect-16/10">
                  <Image
                    src="/home-banner.png"
                    alt="Interior of a car with passengers"
                    width={800}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur rounded-lg px-2 py-1 sm:px-4 sm:py-2 shadow-lg">
                    <Flex gap="sm" items="center">
                      <FaCar className="text-[#ff4c29] text-xs sm:text-sm" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800">
                        {formattedCount} {carWord} listed
                      </span>
                    </Flex>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
