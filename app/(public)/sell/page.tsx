"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Container,
  Grid,
  Flex,
  Card,
  CardBody,
  CardHeader,
  Heading2,
  Heading3,
  Heading4,
  Small,
  CtaButton,
  Accordion,
  PublicHeader,
  PublicFooter,
} from "@/components/ui";
import {
  FaCar,
  FaClock,
  FaShieldAlt,
  FaArrowRight,
  FaMoneyBillWave,
  FaHandshake,
  FaSmile,
} from "react-icons/fa";

export default function SellMyCarPage() {
  const [reg, setReg] = useState("");

  const scrollToListForm = () => {
    document
      .getElementById("list-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <PublicHeader />

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[420px] py-16 sm:py-20 md:min-h-[600px] md:py-0">
        <div className="absolute inset-0 z-0">
          <Image
            fill
            src="/sell-bg.jpg"
            alt="Sell your car"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#1a1a1a]/60" />
        </div>
        <Container className="relative z-10 h-full">
          <div className="md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-3xl mx-auto text-center px-2">
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4 text-balance">
              Sell your car. <span className="text-primary">It&apos;s free</span>
            </h1>
            <p className="max-w-xl text-base sm:text-lg text-white/85 mx-auto mb-8">
              List your car for buyers and dealers across Eswatini to see —
              you set the price, we help you find the sale.
            </p>
            <CtaButton
              fullWidth={false}
              className="shadow-lg px-6 sm:px-10 whitespace-nowrap"
              onClick={scrollToListForm}
            >
              Get started for free <FaArrowRight className="ml-2" />
            </CtaButton>
          </div>
        </Container>
      </section>

      {/* ─── How It Works (3 Steps) ─── */}
      <section className="py-10 md:py-14 bg-white">
        <Container>
          <div className="text-center mb-8">
            <Heading2 className="mb-2">
              Just 3 steps to sell your car with Khazu
            </Heading2>
          </div>
          <Grid cols={3} gap="lg">
            {[
              {
                title: "List your car",
                description:
                  "Enter your registration and car details, then set the asking price yourself — no appraisal, no waiting.",
                icon: <FaCar size={32} />,
                image: "/sell/step1.jpg",
                tooltip: "Post your car for free",
              },
              {
                title: "We find a buyer",
                description:
                  "We match your car to dealers across Eswatini who are actively searching for vehicles like yours.",
                icon: <FaHandshake size={32} />,
                image: "/sell/step2.jpg",
                tooltip: "Listing completes instantly",
              },
              {
                title: "Get paid & collected",
                description:
                  "Dealer collects from your home. You get paid quickly and securely via bank transfer or cash.",
                icon: <FaMoneyBillWave size={32} />,
                image: "/sell/step3.jpg",
                tooltip: "Connect with buyers",
              },
            ].map((item, i) => (
              <Card
                key={i}
                padding="none"
                hover
                className="text-center border-none overflow-hidden"
              >
                <div className="relative w-full h-48 sm:h-60">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute flex items-center gap-2 bottom-3 right-3 left-3 sm:left-auto bg-[#a72346] text-white rounded-md px-3 py-2">
                    <span className="shrink-0 flex items-center justify-center text-sm">
                      {item.icon}
                    </span>
                    <span className="text-xs sm:text-sm font-medium truncate">
                      {item.tooltip}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <Heading3 className="mb-1">{item.title}</Heading3>
                  <p className="text-gray-800 text-sm sm:text-base">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      {/* ─── List Your Car Form ─── */}
      <section
        className="py-10 md:py-14 relative"
        id="list-form"
      >
        <div className="absolute inset-0 z-0">
          <Image
            fill
            src="/sell-bg3.jpg"
            alt="Sell your car"
            quality={100}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#1a1a1a]/40" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto">
            <Card padding="lg" className="shadow-xl bg-white/90 backdrop-blur-xl">
              <CardHeader>
                <Heading3 className="text-dark">
                  Ready to list your car?
                </Heading3>
                <p className="text-gray-600">
                  No hidden fees. You choose the price.
                </p>
              </CardHeader>
              <CardBody>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Plate Number"
                    value={reg}
                    onChange={(e) => setReg(e.target.value.toUpperCase())}
                    className="w-full md:flex-1 min-w-0 h-14 rounded-md placeholder:text-gray-400 border border-gray-200 bg-white text-black uppercase font-black font-mono text-2xl sm:text-3xl md:text-4xl text-center px-3"
                  />
                  <Link
                    href={`/sell/upload?reg=${encodeURIComponent(reg)}`}
                    className="w-full md:flex-1"
                  >
                    <CtaButton className="hover:bg-[#a72346]">
                      Sell My Car
                    </CtaButton>
                  </Link>
                </div>
                <Small muted className="block text-center mt-3">
                  Enter your registration number to get started.
                </Small>
              </CardBody>
            </Card>
          </div>
        </Container>
      </section>

      {/* ─── Why Sell With Khazu ─── */}
      <section className="py-10 md:py-14 bg-white">
        <Container>
          <div className="text-center mb-8">
            <Heading2 className="mb-2 text-balance">
              We make selling your car faster, safer, and more rewarding
            </Heading2>
          </div>
          <Grid cols={4} gap="md">
            {[
              {
                icon: <FaMoneyBillWave size={48} />,
                title: "You set the price",
                description:
                  "List at the price you want to sell for — no appraisal, no waiting on someone else's estimate.",
              },
              {
                icon: <FaClock size={48} />,
                title: "Sell fast",
                description:
                  "From listing to collection, we move fast. Most sellers receive an offer within minutes.",
              },
              {
                icon: <FaShieldAlt size={48} />,
                title: "Safe & secure payments",
                description:
                  "All transactions are protected. You get paid before the car leaves your home.",
              },
              {
                icon: <FaSmile size={48} />,
                title: "Zero hidden fees",
                description:
                  "No listing fees, no commission. We only charge when you successfully sell.",
              },
            ].map((item, i) => (
              <Card key={i} padding="lg" hover className="border-none">
                <Flex direction="col" justify="center" gap="md" items="center">
                  <div className="text-black text-3xl sm:text-4xl shrink-0">
                    {item.icon}
                  </div>
                  <div className="space-y-2 flex items-center flex-col">
                    <Heading4 className="mb-0.5 text-center">
                      {item.title}
                    </Heading4>
                    <p className="text-gray-800 text-sm sm:text-base text-center">
                      {item.description}
                    </p>
                  </div>
                </Flex>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-10 md:py-14 bg-white">
        <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Heading2 className="text-center mb-6">
              Frequently asked questions
            </Heading2>
            <Accordion
              className="border border-gray-200 rounded-md"
              items={[
                {
                  id: "1",
                  title: "How does Khazu work?",
                  content:
                    "Simply enter your car's registration and details to list it at the price you choose. We'll match you with a verified dealer who can collect your car and pay you — often within 24 hours.",
                },
                {
                  id: "2",
                  title: "Is it really free?",
                  content:
                    "Yes! Listing your car on Khazu is completely free. We only charge dealers to access your contact details when you sell.",
                },
                {
                  id: "3",
                  title: "How do I get paid?",
                  content:
                    "You can choose between secure bank transfer or cash payment – whichever is most convenient for you. Payment is made before the car is collected.",
                },
                {
                  id: "4",
                  title: "What if I change my mind?",
                  content:
                    "No problem. There is no obligation at any stage. You can reject any offer or withdraw your listing at any time at no cost.",
                },
              ]}
            />
          </div>
        </Container>
      </section>

      <PublicFooter />
    </>
  );
}
