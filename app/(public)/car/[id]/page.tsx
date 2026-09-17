"use client";
import { useState, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Container,
  Grid,
  Flex,
  Card,
  Heading2,
  Heading3,
  Heading5,
  Body,
  Small,
  Button,
  IconButton,
  Badge,
  Avatar,
  TagList,
  RatingStars,
  CarCard,
  CarCardGrid,
  Separator,
  Heading4,
} from "@/components/ui";
import {
  FaChevronLeft,
  FaHeart,
  FaShare,
  FaCalendarAlt,
  FaTachometerAlt,
  FaGasPump,
  FaCog,
  FaCar,
  FaCheckCircle,
  FaClock,
  FaCalculator,
  FaChevronDown,
  FaChevronUp,
  FaFlag,
  FaBookmark,
  FaShieldAlt,
  FaUser,
  FaPhone,
} from "react-icons/fa";
import { cars } from "@/lib/data/carData";
import clsx from "clsx";

interface DealPageProps {
  params: Promise<{ id: string }>;
}

export default function DealPage({ params }: DealPageProps) {
  const { id } = use(params);

  // Find the specific car by ID
  const rawCar = cars.find((c) => c.vehicle_data?.header?.listingId?.toString() === id);
  if (!rawCar) return notFound();

  const car = {
    id: rawCar.vehicle_data.header.listingId.toString(),
    make: rawCar.vehicle_data.header.registrationYearMakeModel.split(" ")[1] || "Unknown Make",
    model: rawCar.vehicle_data.header.variant || "Unknown Model",
    year: parseInt(rawCar.vehicle_data.header.registrationYearMakeModel.split(" ")[0]) || new Date().getFullYear(),
    price: parseInt(rawCar.vehicle_data.header.listingPrice.replace(/\D/g, "")) || 0,
    mileage: parseInt(rawCar.vehicle_data.summaryIcons.find((i) => i.text.includes("km"))?.text.replace(/\D/g, "") || "0"),
    images: rawCar.vehicle_data.gallery.galleryImages.map((img) => img.imageUrl),
    fuel: rawCar.vehicle_data.summaryIcons.find((i) => ["Diesel", "Petrol", "Electric", "Hybrid"].includes(i.text))?.text || "Unknown",
    transmission: rawCar.vehicle_data.summaryIcons.find((i) => ["Manual", "Automatic"].includes(i.text))?.text || "Unknown",
    bodyType: rawCar.vehicle_data.additionalInformation.find((i) => i && ["Single cab", "Double cab", "SUV", "Hatchback", "Sedan", "Panel van"].includes(i.text))?.text || "Unknown",
    color: rawCar.vehicle_data.additionalInformation.length >= 3 ? rawCar.vehicle_data.additionalInformation[2]?.text || "Unknown" : "Unknown",
    features: rawCar.vehicle_data.listingSpecifications?.specificationCategories?.flatMap((cat) => cat?.categoryItems?.map((item) => item?.value || "") || []) || [],
    location: rawCar.vehicle_data.listingSellerInformation?.sellerSuburbName || "Eswatini",
  };

  // Simulate deal data based on the real car
  const deal = {
    id: id,
    car: car,
    rrp: Math.round(car.price * 1.15), // 15% above price as original RRP
    discount: Math.round(car.price * 0.15),
    finalPrice: car.price,
    savingPercentage: "15%",
    monthlyPayment: Math.round(car.price * 0.018),
    deposit: Math.round(car.price * 0.1),
    termMonths: 48,
    apr: 6.9,
    offerValidUntil: "30 June 2026",
    dealerName: "Mbabane Motor Group",
    dealerRating: 4.8,
    dealerReviews: 342,
    distance: "3.2 km away",
    stockId: `KHAZU-${id.toUpperCase()}`,
    availability: "In stock",
    condition: car.mileage < 100 ? "Brand new" : "Used",
    colour: car.color || "Glossy Black",
    registration: "Pending",
    warranty: "3 years / 100,000 km",
  };

  const [saved, setSaved] = useState(false);
  const [showFinanceDetails, setShowFinanceDetails] = useState(false);

  // Similar cars (same make, similar price range)
  const similarCars = cars
    .filter((c) => c.vehicle_data?.header?.listingId?.toString() !== car.id)
    .map(rawCar => ({
      id: rawCar.vehicle_data.header.listingId.toString(),
      make: rawCar.vehicle_data.header.registrationYearMakeModel.split(" ")[1] || "Unknown",
      model: rawCar.vehicle_data.header.variant || "Unknown",
      year: parseInt(rawCar.vehicle_data.header.registrationYearMakeModel.split(" ")[0]) || 2024,
      price: parseInt(rawCar.vehicle_data.header.listingPrice.replace(/\D/g, "")) || 0,
      mileage: parseInt(rawCar.vehicle_data.summaryIcons.find((i) => i.text.includes("km"))?.text.replace(/\D/g, "") || "0"),
      images: rawCar.vehicle_data.gallery.galleryImages.map((img) => img.imageUrl),
      fuel: rawCar.vehicle_data.summaryIcons.find((i) => ["Diesel", "Petrol", "Electric", "Hybrid"].includes(i.text))?.text || "Unknown",
      transmission: rawCar.vehicle_data.summaryIcons.find((i) => ["Manual", "Automatic"].includes(i.text))?.text || "Unknown",
      bodyType: rawCar.vehicle_data.additionalInformation.find((i) => i && ["Single cab", "Double cab", "SUV", "Hatchback", "Sedan", "Panel van"].includes(i.text))?.text || "Unknown",
      location: rawCar.vehicle_data.listingSellerInformation?.sellerSuburbName || "Eswatini",
      isFeatured: false,
      isVerified: true,
      sellerType: "dealer" as const,
      valueScore: 85,
      conditionScore: 90,
      dealRating: "Great" as const,
      marketRank: 1
    }))
    .filter(
      (c) =>
        c.make === car.make ||
        Math.abs(c.price - car.price) < car.price * 0.2
    )
    .slice(0, 4);

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-cream/30 py-3 border-b border-gray-300">
        <Container>
          <Flex gap="sm" items="center" className="text-sm text-dark/60">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Separator orientation="horizontal" variant="dot" />
            <Link
              href="/listings"
              className="hover:text-primary transition-colors"
            >
              Inventory
            </Link>
            <Separator orientation="horizontal" variant="dot" />
            <span className="text-dark font-medium">
              {deal.car.make} {deal.car.model}
            </span>
          </Flex>
        </Container>
      </section>

      {/* Main Deal Section */}
      <section className="py-8 md:py-12 bg-white">
        <Container>
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-dark/60 hover:text-primary mb-6 transition-colors"
          >
            <FaChevronLeft size={12} /> Back to marketplace
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column – Gallery & Specs */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative rounded-lg overflow-hidden shadow-2xl border border-gray-300">
                <div className="aspect-[16/9] bg-dark/5">
                  <Image
                    src={deal.car.images[0]}
                    alt={`${deal.car.make} ${deal.car.model}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge className="bg-[#ff4c29] text-white border-none shadow-lg">
                    Best Price
                  </Badge>
                  <Badge className="bg-primary text-white border-none shadow-lg">
                    Save {deal.savingPercentage}
                  </Badge>
                </div>
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <IconButton
                    label={saved ? "Remove from saved" : "Save this car"}
                    variant="secondary"
                    size="md"
                    onClick={() => setSaved(!saved)}
                    className="bg-white/90 backdrop-blur hover:bg-white shadow-xl"
                  >
                    <FaHeart
                      className={saved ? "text-danger" : "text-dark/40"}
                      size={18}
                    />
                  </IconButton>
                  <IconButton
                    label="Share this car"
                    variant="secondary"
                    size="md"
                    className="bg-white/90 backdrop-blur hover:bg-white shadow-xl"
                  >
                    <FaShare size={18} />
                  </IconButton>
                </div>
                {/* Availability tag */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-lg shadow-xl border border-white/20">
                  <Flex gap="sm" items="center">
                    <FaClock size={12} className="text-primary" />
                    <Small className="font-bold text-dark">
                      {deal.availability}
                    </Small>
                  </Flex>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {deal.car.images.map((img, i) => (
                  <button
                    key={i}
                    className="w-20 h-16 sm:w-28 sm:h-20 shrink-0 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all shadow-md"
                  >
                    <Image
                      src={img}
                      alt={`View ${i + 1}`}
                      width={160}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Specs Grid */}
              <Card className="p-6 border-gray-300 shadow-sm">
                <Heading5 className="mb-4 font-bold">
                  Key Specifications
                </Heading5>
                <Grid cols={2} gap="lg">
                  <div className="flex items-center gap-3 p-3 bg-cream/30 rounded-lg">
                    <FaCalendarAlt className="text-primary" size={20} />
                    <div>
                      <Small
                        muted
                        className="uppercase text-[10px] tracking-widest font-bold"
                      >
                        Year
                      </Small>
                      <Body size="sm" className="font-bold">
                        {deal.car.year}
                      </Body>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-cream/30 rounded-lg">
                    <FaTachometerAlt className="text-primary" size={20} />
                    <div>
                      <Small
                        muted
                        className="uppercase text-[10px] tracking-widest font-bold"
                      >
                        Mileage
                      </Small>
                      <Body size="sm" className="font-bold">
                        {deal.car.mileage.toLocaleString()} km
                      </Body>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-cream/30 rounded-lg">
                    <FaGasPump className="text-primary" size={20} />
                    <div>
                      <Small
                        muted
                        className="uppercase text-[10px] tracking-widest font-bold"
                      >
                        Fuel
                      </Small>
                      <Body size="sm" className="font-bold">
                        {deal.car.fuel}
                      </Body>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-cream/30 rounded-lg">
                    <FaCog className="text-primary" size={20} />
                    <div>
                      <Small
                        muted
                        className="uppercase text-[10px] tracking-widest font-bold"
                      >
                        Transmission
                      </Small>
                      <Body size="sm" className="font-bold">
                        {deal.car.transmission}
                      </Body>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-cream/30 rounded-lg">
                    <FaCar className="text-primary" size={20} />
                    <div>
                      <Small
                        muted
                        className="uppercase text-[10px] tracking-widest font-bold"
                      >
                        Body
                      </Small>
                      <Body size="sm" className="font-bold">
                        {deal.car.bodyType}
                      </Body>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-cream/30 rounded-lg">
                    <FaCheckCircle className="text-green-600" size={20} />
                    <div>
                      <Small
                        muted
                        className="uppercase text-[10px] tracking-widest font-bold"
                      >
                        Condition
                      </Small>
                      <Body size="sm" className="font-bold">
                        {deal.condition}
                      </Body>
                    </div>
                  </div>
                </Grid>
              </Card>

              {/* Features */}
              <Card className="p-6 border-gray-300 shadow-sm">
                <Heading5 className="mb-4 font-bold">
                  Included Features
                </Heading5>
                <TagList tags={deal.car.features.slice(0, 10)} />
              </Card>
            </div>

            {/* Right Column – Price & Deal Info */}
            <div className="relative">
              <Card className="p-8 sticky top-4 shadow-2xl border-2 border-primary/10 rounded-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none" />

                {/* Deal Header */}
                <div className="flex items-start justify-between mb-6 relative">
                  <div>
                    <Heading3 className="text-3xl font-black tracking-tighter text-dark mb-1">
                      {deal.car.make} {deal.car.model}
                    </Heading3>
                    <Flex gap="md" items="center" className="text-dark/50">
                      <Small className="font-bold">{deal.car.year}</Small>
                      <Separator orientation="horizontal" variant="dot" />
                      <Small className="font-bold">{deal.car.location}</Small>
                    </Flex>
                  </div>
                  <Badge className="bg-[#ff4c29] text-white text-[10px] font-black uppercase px-3 py-1 border-none tracking-widest">
                    Deal
                  </Badge>
                </div>

                {/* Price Breakdown */}
                <div className="p-6 bg-gray-50 rounded-lg mb-6 relative border border-gray-300">
                  <Flex justify="between" items="center" className="mb-2">
                    <Small
                      muted
                      className="font-bold uppercase tracking-wider text-[10px]"
                    >
                      RRP
                    </Small>
                    <Small className="line-through text-dark/40 font-bold">
                      SZL {deal.rrp.toLocaleString()}
                    </Small>
                  </Flex>
                  <Flex justify="between" items="center" className="mb-4">
                    <Small
                      muted
                      className="font-bold uppercase tracking-wider text-[10px]"
                    >
                      Khazu Savings
                    </Small>
                    <Small className="text-[#ff4c29] font-black text-sm">
                      - SZL {deal.discount.toLocaleString()}
                    </Small>
                  </Flex>
                  <div className="border-t border-dark/10 pt-4 flex items-baseline justify-between">
                    <Body weight="semibold" className="text-dark/60">
                      Final Price
                    </Body>
                    <div className="text-right">
                      <Heading2 className="text-4xl font-black text-[#ff4c29] tracking-tighter">
                        SZL {deal.finalPrice.toLocaleString()}
                      </Heading2>
                      <Small muted className="block font-medium">
                        Includes all fees & taxes
                      </Small>
                    </div>
                  </div>
                </div>

                {/* Monthly Payment Highlight */}
                <div
                  className="flex items-center justify-between p-5 bg-primary/5 hover:bg-primary/10 rounded-lg mb-6 cursor-pointer transition-all border border-primary/10 group"
                  onClick={() => setShowFinanceDetails(!showFinanceDetails)}
                >
                  <Flex gap="md" items="center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <FaCalculator size={18} />
                    </div>
                    <div>
                      <Body size="sm" className="font-bold text-dark">
                        Monthly payment
                      </Body>
                      <Small muted className="font-medium">
                        {deal.termMonths} months • {deal.apr}% APR
                      </Small>
                    </div>
                  </Flex>
                  <Flex gap="md" items="center">
                    <Heading4 className="text-primary font-black">
                      SZL {deal.monthlyPayment.toLocaleString()}
                    </Heading4>
                    {showFinanceDetails ? (
                      <FaChevronUp size={14} className="text-primary" />
                    ) : (
                      <FaChevronDown size={14} className="text-primary" />
                    )}
                  </Flex>
                </div>

                {/* Finance Details (Expandable) */}
                {showFinanceDetails && (
                  <div className="p-5 bg-white border border-gray-300 rounded-lg mb-6 shadow-inner space-y-4">
                    <Grid cols={2} gap="lg">
                      <div>
                        <Small
                          muted
                          className="uppercase text-[9px] font-black tracking-widest mb-1"
                        >
                          Deposit
                        </Small>
                        <Body size="sm" className="font-bold text-dark">
                          SZL {deal.deposit.toLocaleString()}
                        </Body>
                      </div>
                      <div>
                        <Small
                          muted
                          className="uppercase text-[9px] font-black tracking-widest mb-1"
                        >
                          Term
                        </Small>
                        <Body size="sm" className="font-bold text-dark">
                          {deal.termMonths} months
                        </Body>
                      </div>
                      <div>
                        <Small
                          muted
                          className="uppercase text-[9px] font-black tracking-widest mb-1"
                        >
                          APR
                        </Small>
                        <Body size="sm" className="font-bold text-dark">
                          {deal.apr}%
                        </Body>
                      </div>
                      <div>
                        <Small
                          muted
                          className="uppercase text-[9px] font-black tracking-widest mb-1"
                        >
                          Total Payable
                        </Small>
                        <Body size="sm" className="font-bold text-dark">
                          SZL{" "}
                          {Math.round(
                            deal.monthlyPayment * deal.termMonths +
                              deal.deposit,
                          ).toLocaleString()}
                        </Body>
                      </div>
                    </Grid>
                  </div>
                )}

                {/* Dealer Info */}
                <div className="bg-gray-50 rounded-lg border border-gray-300 p-5 mb-6">
                  <Flex gap="lg" items="center">
                    <Avatar
                      initials={deal.dealerName.charAt(0)}
                      className="w-12 h-12 bg-dark text-white font-bold"
                    />
                    <div className="flex-1">
                      <Flex gap="sm" items="center">
                        <Body weight="semibold" className="text-dark">
                          {deal.dealerName}
                        </Body>
                        <Badge className="bg-green-100 text-green-700 border-none text-[9px] px-2">
                          Verified
                        </Badge>
                      </Flex>
                      <Flex items="center" gap="sm">
                        <RatingStars rating={deal.dealerRating} size="sm" />
                        <Small muted className="font-bold">
                          ({deal.dealerReviews} reviews)
                        </Small>
                      </Flex>
                    </div>
                    <Small muted className="font-bold text-[10px]">
                      {deal.distance}
                    </Small>
                  </Flex>
                </div>

                {/* Stock Info */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-dark/5 text-dark/70 border-none text-[9px] font-bold">
                    Stock: {deal.stockId}
                  </Badge>
                  <Badge className="bg-dark/5 text-dark/70 border-none text-[9px] font-bold">
                    Warranty: {deal.warranty}
                  </Badge>
                  <Badge className="bg-dark/5 text-dark/70 border-none text-[9px] font-bold">
                    Colour: {deal.colour}
                  </Badge>
                </div>

                {/* Offer Validity */}
                <div className="flex items-center gap-3 text-sm text-dark/60 mb-8 p-3 bg-red-50 rounded-lg border border-red-100">
                  <FaClock size={16} className="text-[#ff4c29]" />
                  <span className="font-medium">
                    Offer valid until{" "}
                    <strong className="text-dark">
                      {deal.offerValidUntil}
                    </strong>
                  </span>
                </div>

                {/* Main Actions */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="bg-[#ff4c29] hover:bg-[#e54424] text-white font-black py-6 rounded-lg shadow-xl transform active:scale-95 transition-all text-lg"
                  >
                    Get this deal
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    className="rounded-lg border-2 font-bold hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <FaPhone size={16} /> Call dealer
                  </Button>
                </div>

                {/* Trust Signals */}
                <div className="mt-8 pt-6 border-t border-dark/10 flex items-center gap-4 flex-wrap justify-center text-[10px] font-black uppercase tracking-widest text-dark/40">
                  <Flex gap="sm" items="center">
                    <FaCheckCircle className="text-green-600" /> Price match
                  </Flex>
                  <Separator orientation="horizontal" variant="dot" />
                  <Flex gap="sm" items="center">
                    <FaShieldAlt className="text-blue-600" /> 7 day return
                  </Flex>
                  <Separator orientation="horizontal" variant="dot" />
                  <Flex gap="sm" items="center">
                    <FaUser className="text-purple-600" /> Verified Seller
                  </Flex>
                </div>

                {/* Lower actions */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-dark/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-dark/40 hover:text-dark font-bold"
                  >
                    <FaFlag size={14} className="mr-2" /> Report
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={clsx(
                      "flex-1 font-bold",
                      saved ? "text-primary" : "text-dark/40 hover:text-dark",
                    )}
                    onClick={() => setSaved(!saved)}
                  >
                    <FaBookmark size={14} className="mr-2" />
                    {saved ? "Saved" : "Save Deal"}
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Similar Deals */}
          <div className="mt-20">
            <div className="flex items-baseline gap-4 mb-8">
              <Heading2 className="text-3xl font-black tracking-tighter">
                Similar Deals
              </Heading2>
              <div className="h-0.5 flex-1 bg-dark/5" />
            </div>

            <CarCardGrid>
              {similarCars.length > 0 ? (
                similarCars.map((c) => (
                  <CarCard
                    key={c.id}
                    id={c.id}
                    make={c.make}
                    model={c.model}
                    year={c.year}
                    price={c.price}
                    mileage={c.mileage}
                    fuel={c.fuel}
                    transmission={c.transmission}
                    bodyType={c.bodyType}
                    location={c.location}
                    image={c.images[0]}
                    isFeatured={c.isFeatured}
                    isVerified={c.isVerified}
                    sellerType={c.sellerType}
                    valueScore={c.valueScore}
                    conditionScore={c.conditionScore}
                    dealRating={c.dealRating}
                    marketRank={c.marketRank}
                    onSave={() => console.log(`Saved ${c.id}`)}
                    onContact={() => console.log(`Contact ${c.id}`)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16 bg-gray-50 rounded-lg border border-dashed border-dark/10">
                  <Body className="text-dark/40 font-bold">
                    No similar deals available right now.
                  </Body>
                </div>
              )}
            </CarCardGrid>
          </div>
        </Container>
      </section>
    </>
  );
}
