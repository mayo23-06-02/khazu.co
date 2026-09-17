"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Container,
  Grid,
  Flex,
  Stack,
  Section,
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
  Button,
  IconButton,
  Badge,
  Divider,
  Spacer,
  Avatar,
  TagList,
  RatingStars,
  Separator,
  ProgressBar,
  Tabs,
  Accordion,
  InputText,
  Select,
  Checkbox,
  RadioGroup,
  ToggleSwitch,
  Slider,
  SearchBar,
  Autocomplete,
  FormGroup,
  Fieldset,
  Textarea,
  FileUpload,
  ImageUpload,
  DatePicker,
  SellYourCarAd,
} from "@/components/ui";
import {
  FaCar,
  FaHeart,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaStar,
  FaShieldAlt,
  FaArrowRight,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaCalculator,
  FaTag,
  FaMoneyBillWave,
  FaTrophy,
  FaChartLine,
  FaHome,
  FaKey,
  FaHandshake,
  FaSmile,
  FaThumbsUp,
  FaCamera,
  FaPencilAlt,
  FaCreditCard,
} from "react-icons/fa";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PublicHeader, PublicFooter } from "@/components/ui";

export default function SellMyCarPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    reg: "",
    mileage: "",
    condition: "good",
    colour: "",
    postcode: "",
    name: "",
    email: "",
    phone: "",
    pickupMethod: "collection",
  });

  const [valuation, setValuation] = useState<number | null>(null);

  const handleValuation = () => {
    // Simulate valuation call
    const basePrice = 250000;
    const mileageDeduction = parseInt(formData.mileage || "0") * 0.5;
    const conditionMultiplier =
      formData.condition === "excellent"
        ? 1.1
        : formData.condition === "good"
          ? 1.0
          : 0.85;
    const estimatedValue = Math.round(
      (basePrice - mileageDeduction) * conditionMultiplier,
    );
    setValuation(estimatedValue);
  };

  return (
    <>
      <PublicHeader />

      {/* ─── Hero Section ─── */}
      <section className="bg-cream relative min-h-[480px] py-16 md:h-[600px] md:py-0">
        <span className=" top-0 left-0 right-0 h-1 bg-primary/10 z-0">
          <Image
            fill
            src="/sell-bg.jpg"
            alt="Sell your car"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#1a1a1a]/50"></div>
        </span>
        <Container>
          <div className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-5xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl bg-white  font-extrabold uppercase md:text-7xl text-black px-4 rounded-md mb-4">
              Sell your car.{" "}
              <span className="bg-[#a72346] text-white lg:px-6 px-2 rounded-md">
                It's FREE
              </span>
            </h1>
            <p className="max-w-2xl text-md text-base sm:text-lg text-white mx-auto mb-8">
              Sell to thousands of dealers across Eswatini or choose a buyer
              who'll collect from your home.
            </p>
            <Button
              variant="primary"
              size="md"
              className="shadow-lg px-6 sm:px-10 text-sm sm:text-base whitespace-nowrap"
              onClick={() => window.scrollTo({ top: 1100, behavior: "smooth" })}
            >
              Get started for FREE <FaArrowRight className="ml-2" />
            </Button>
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
                step: 1,
                title: "Get a valuation",
                description:
                  "Enter your car details and we'll give you an instant, free estimate based on thousands of recent sales.",
                icon: <FaCar size={32} />,
                image: "/sell/step1.jpg",
                tooltip: "Post your car for free",
              },
              {
                step: 2,
                title: "We find a buyer",
                description:
                  "We match your car to dealers across Eswatini who are actively searching for vehicles like yours.",
                icon: <FaHandshake size={32} />,
                image: "/sell/step2.jpg",
                tooltip: "Listing completes instantly",
              },
              {
                step: 3,
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
                className="text-center border-none"
              >
                <div className="relative w-full h-60">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded-lg w-full h-full"
                  />
                  <div className="absolute flex  items-center justify-center gap-2 bottom-3 right-3 bg-[#a72346] text-white rounded-md p-2">
                    <div className="text-primary  flex justify-center">
                      <p className="text-sm"> {item.icon}</p>
                    </div>
                    <p className="">{item.tooltip}</p>
                  </div>
                </div>

                <div className="p-4">
                  <Heading3 className="mb-1">{item.title}</Heading3>
                  <p className=" text-gray-800">{item.description}</p>
                </div>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      {/* ─── Valuation Form ─── */}
      <section
        className="py-10 h-[90vh] flex justify-center relative md:py-14"
        id="valuation-form"
      >
        <span className=" top-0 left-0 right-0 h- bg-primary/10 z-0">
          <Image
            fill
            src="/sell-bg3.jpg"
            alt="Sell your car"
            quality={100}
            className="object-cover"
          />
          <div className="absolute inset-0 "></div>
        </span>
        <Container className="absolute max-w-[1400px] bottom-24 mx-auto  w-full - z-10  flex justify-start items-center">
          <div className="max-w-4xl mx-auto">
            <Card
              padding="lg"
              className="shadow-xl bg-white/60 backdrop-blur-xl"
            >
              <CardHeader>
                <Heading3 className="text-dark">
                  Claim your free 45 days
                </Heading3>
                <p>No hidden fees. No obligation.</p>
              </CardHeader>
              <CardBody>
                <div className="space-y-4 flex">
                  <div className="w-full grid lg:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Plate Number"
                      value={formData.reg}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          reg: e.target.value.toUpperCase(),
                        }))
                      }
                      className="w-full h-15 rounded-md placeholder:gray-300 border border-gray-200 bg-white text-black uppercase font-black font-mono text-4xl text-center"
                    />
                    <Link
                      href={`/sell/upload?reg=${encodeURIComponent(formData.reg)}`}
                    >
                      <Button className=" w-full text-white hover:bg-[#a72346] rounded-md px-10 py-4 text-lg font-bold transition-all transform active:scale-95">
                        Sell My Car
                      </Button>
                    </Link>
                  </div>
                </div>
                <Small muted className="block text-center mt-2">
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
            <Heading2 className="mb-2">
              We make selling your car faster, safer, and more rewarding
            </Heading2>
          </div>
          <Grid cols={4} gap="md">
            {[
              {
                icon: <FaMoneyBillWave size={64} />,
                title: "Get the best price",
                description:
                  "Our valuation engine compares thousands of recent sales to give you an accurate, fair price.",
              },
              {
                icon: <FaClock size={64} />,
                title: "Sell in 24 hours",
                description:
                  "From valuation to collection, we move fast. Most sellers receive an offer within minutes.",
              },
              {
                icon: <FaShieldAlt size={64} />,
                title: "Safe & secure payments",
                description:
                  "All transactions are protected. You get paid before the car leaves your home.",
              },
              {
                icon: <FaSmile size={64} />,
                title: "Zero hidden fees",
                description:
                  "No listing fees, no commission. We only charge when you successfully sell.",
              },
            ].map((item, i) => (
              <Card key={i} padding="lg" hover className="border-none">
                <Flex direction="col" justify="center" gap="md" items="center">
                  <div className="text-black text-4xl shrink-0">
                    {item.icon}
                  </div>
                  <div className="space-y-2 flex items-center flex-col">
                    <Heading4 className="mb-0.5">{item.title}</Heading4>
                    <p className=" text-gray-800 text-center">
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
          <div className="max-w-3xl mx-auto ">
            <Heading2 className="text-center mb-6">
              Frequently asked questions
            </Heading2>
            <Accordion
              className="border border-gray-200  rounded-md"
              items={[
                {
                  id: "1",
                  title: "How does Khazu work?",
                  content:
                    "Simply enter your car details to get an instant valuation. If you accept the price, we'll match you with a verified dealer who will collect your car and pay you – all within 24 hours.",
                },
                {
                  id: "2",
                  title: "Is it really free?",
                  content:
                    "Yes! Getting a valuation and listing your car on Khazu is completely free. We only charge dealers to access your contact details when you sell.",
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
