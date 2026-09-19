"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  CtaButton,
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
  StatsCard,
  EmptyState,
  Toast,
  ToastContainer,
} from "@/components/ui";
import {
  FaCheckCircle,
  FaCar,
  FaRocket,
  FaClock,
  FaChartLine,
  FaUsers,
  FaInfinity,
  FaTag,
  FaShieldAlt,
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaArrowRight,
  FaQuestionCircle,
  FaStore,
  FaUser,
  FaNewspaper,
  FaTv,
  FaMapMarkerAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaHandshake,
  FaMoneyBillWave,
} from "react-icons/fa";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PublicHeader, PublicFooter } from "@/components/ui";
import { CheckoutDrawer } from "@/components/subscription/CheckoutDrawer";
import type { PlanId, PlanRole } from "@/components/subscription/plans-data";

export default function PricingPage() {
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // ─── Toggle State ─────────────────────────────────────────
  const [view, setView] = useState<"private" | "dealer">("dealer");

  // ─── Dealer Plans ─────────────────────────────────────────
  const dealerPlans = [
    {
      id: "basic",
      planId: "dealer_starter" as PlanId,
      name: "Starter",
      price: 375,
      listings: 15,
      features: [
        "15 active listings",
        "Verified dealer badge",
        "Lead inbox",
        "Basic analytics",
        "Email support",
      ],
      popular: false,
    },
    {
      id: "standard",
      planId: "dealer_growth" as PlanId,
      name: "Growth",
      price: 550,
      listings: 25,
      features: [
        "25 active listings",
        "Verified dealer badge",
        "Lead inbox",
        "Advanced analytics",
        "1 free boost per month",
        "Priority email support",
      ],
      popular: true,
    },
    {
      id: "premium",
      planId: "dealer_premium" as PlanId,
      name: "Premium",
      price: 725,
      listings: 35,
      features: [
        "35 active listings",
        "Verified dealer badge",
        "Lead inbox",
        "Advanced analytics",
        "2 free boosts per month",
        "WhatsApp support",
        "Featured in dealer spotlight",
      ],
      popular: false,
    },
    {
      id: "enterprise",
      planId: "dealer_unlimited" as PlanId,
      name: "Unlimited",
      price: 1250,
      listings: 9999,
      features: [
        "Unlimited active listings",
        "Verified dealer badge",
        "Lead inbox",
        "Advanced analytics",
        "5 free boosts per month",
        "Dedicated account manager",
        "Featured in spotlight",
      ],
      popular: false,
    },
  ];

  // ─── Listing Plans (Private Sellers) ──────────────────────
  const boostOptions = [
    {
      id: "basic",
      planId: "individual_14" as PlanId,
      name: "14-Day Pass",
      days: 14,
      price: 45,
      label: "14 days – SZL 45",
      description: "One listing, live for 14 days",
    },
    {
      id: "standard",
      planId: "individual_28" as PlanId,
      name: "28-Day Pass",
      days: 28,
      price: 75,
      label: "28 days – SZL 75",
      description: "Better value for a longer sale window",
    },
  ];

  // ─── Checkout ────────────────────────────────────────────
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutRole, setCheckoutRole] = useState<PlanRole>("dealer");
  const [checkoutPlanId, setCheckoutPlanId] = useState<PlanId | null>(null);

  const handleSubscribe = (planId: PlanId) => {
    setCheckoutRole("dealer");
    setCheckoutPlanId(planId);
    setCheckoutOpen(true);
  };

  const handleBoost = (planId: PlanId) => {
    setCheckoutRole("individual");
    setCheckoutPlanId(planId);
    setCheckoutOpen(true);
  };

  return (
    <>
      <PublicHeader />

      {/* ─── Hero Section ─── */}
      <section className="bg-cream relative h-[600px] overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            fill
            src="/pricing.jpg"
            alt="Pricing background"
            className="object-cover object-center filter brightness-[0.4]"
            priority
          />
        </div>
        <Container className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full animate-fade-in">
            <span className="text-white tracking-wider">
              No hidden fees, no hassle – just results
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase text-white mb-6 leading-tight drop-shadow-md">
            Choose the right plan for{" "}
            <span className="bg-[#a72346] text-white lg:px-4 px-2 py-0.5 rounded-md inline-block transform -rotate-1">
              your journey
            </span>
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-white/90 mx-auto mb-8 font-medium">
            Whether you are selling a single vehicle or managing a high-volume
            dealership, Khazu offers plans tailored to help you scale fast.
          </p>
        </Container>
      </section>

      {/* ─── Toggle Pill ────────────────────────────────────── */}
      <section className="bg-white py-6 border-b border-gray-100">
        <Container>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-gray-50 p-1.5 rounded-md border border-gray-200 ">
              <button
                onClick={() => setView("private")}
                className={twMerge(
                  clsx(
                    "flex items-center gap-2 px-6 py-2.5 rounded-md transition-all duration-300 font-bold text-xs uppercase tracking-wider",
                    view === "private"
                      ? "bg-[#a72346] text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
                  ),
                )}
              >
                <FaUser size={14} /> Private Seller
              </button>
              <button
                onClick={() => setView("dealer")}
                className={twMerge(
                  clsx(
                    "flex items-center gap-2 px-6 py-2.5 rounded-md transition-all duration-300 font-bold text-xs uppercase tracking-wider",
                    view === "dealer"
                      ? "bg-[#a72346] text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
                  ),
                )}
              >
                <FaStore size={14} /> Dealership
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Private Seller Section ────────────────────────── */}
      {view === "private" && (
        <section className="py-8 bg-cream/35 border-y border-gray-100">
          <Container>
            <div className="text-center mb-16">
              <span className="text-[#a72346] font-semibold block mb-2">
                For Private Sellers
              </span>
              <Heading2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                List Your Car
              </Heading2>
              <div className="w-12 h-1 bg-[#a72346] mx-auto mt-4 rounded-full"></div>
              <Body
                muted
                className="mt-4 text-gray-500 max-w-lg mx-auto font-medium"
              >
                Your first listing is free for 14 days. After that, choose a
                14 or 28-day listing pass to stay live.
              </Body>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto px-4">
              {boostOptions.map((opt) => (
                <Card
                  key={opt.days}
                  padding="lg"
                  hover
                  className="flex flex-col justify-between border border-gray-200 bg-radial from-red-50 to-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 text-center"
                >
                  <CardBody className="pt-6">
                    <Heading3 className="text-xl mb-2 font-bold uppercase tracking-wide text-gray-800">
                      {opt.name}
                    </Heading3>
                    <div className="text-4xl font-display font-black text-[#a72346] flex items-center justify-center gap-0.5 mb-2">
                      <span className="text-sm font-bold text-gray-400 align-top">
                        <Heading5 className="text-gray-600">SZL</Heading5>
                      </span>
                      <Heading2 className="text-2xl text-[#a72346] font-bold">
                        {opt.price}
                      </Heading2>
                    </div>
                    <p className="text-sm text-gray-500 font-semibold uppercase mt-1  ">
                      {opt.days} Days Listing
                    </p>
                    <ul className="mt-6 space-y-3 text-sm text-left border-t border-gray-50 pt-6">
                      <li className="flex items-start gap-2.5">
                        <FaCheckCircle
                          className="text-[#a72346] shrink-0 mt-0.5"
                          size={14}
                        />
                        <span className="text-gray-600 font-medium">
                          Appear in search results
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <FaCheckCircle
                          className="text-[#a72346] shrink-0 mt-0.5"
                          size={14}
                        />
                        <span className="text-gray-600 font-medium">
                          Distinctive "Featured" badge
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <FaCheckCircle
                          className="text-[#a72346] shrink-0 mt-0.5"
                          size={14}
                        />
                        <span className="text-gray-600 font-medium">
                          Targeted buyers match notifications
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <FaCheckCircle
                          className="text-[#a72346] shrink-0 mt-0.5"
                          size={14}
                        />
                        <span className="text-gray-600 font-medium">
                          14-day free trial for new sellers
                        </span>
                      </li>
                    </ul>
                  </CardBody>
                  <CardFooter className="pt-6 pb-2">
                    <CtaButton onClick={() => handleBoost(opt.planId)}>
                      Subscribe
                    </CtaButton>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center text-xs text-gray-400">
              <p>
                ✨ New sellers get 14 days free before their first listing
                needs a plan.
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* ─── Dealer Section ─────────────────────────────────── */}
      {view === "dealer" && (
        <section className="py-16 md:py-24 bg-gray-50 relative">
          <Container>
            <div className="text-center mb-16">
              <span className="text-[#a72346] font-semibold block mb-2">
                For Dealerships
              </span>
              <Heading2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Dealer Subscription Plans
              </Heading2>
              <div className="w-12 h-1 bg-[#a72346] mx-auto mt-4 rounded-full"></div>
              <Body
                muted
                className="mt-4 text-gray-500 max-w-lg mx-auto font-medium"
              >
                Choose the tier that matches your inventory size and marketing
                goals.
              </Body>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dealerPlans.map((plan) => (
                <Card
                  key={plan.id}
                  padding="lg"
                  className={twMerge(
                    clsx(
                      "relative flex flex-col justify-between border border-gray-200 bg-radial from-red-50 to-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white rounded-lg",
                      plan.popular &&
                        "border-2 border-[#a72346] shadow-xl scale-[1.03] lg:scale-[1.05] z-10",
                    ),
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#a72346] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md z-20">
                      Most Popular
                    </div>
                  )}
                  <div>
                    <CardHeader className="text-center pt-4 pb-6">
                      <Heading3 className="text-xl font-bold uppercase tracking-wide text-gray-800">
                        {plan.name}
                      </Heading3>
                      <div className="text-4xl font-display font-black text-[#a72346] mt-4 flex items-center justify-center gap-1">
                        <span className="text-sm font-bold text-gray-400 align-top mt-1">
                          <Heading4 className="text-gray-600">SZL</Heading4>
                        </span>
                        <Heading2 className="text-[#a72346] font-bold">
                          {plan.price}
                        </Heading2>
                        <span className="text-xs font-semibold text-gray-400 tracking-normal lowercase font-sans">
                          <Heading5 className="text-gray-600"> /mo</Heading5>
                        </span>
                      </div>
                      <div className="mt-2 text-xs font-bold text-gray-600 uppercase ">
                        {plan.listings === 9999 ? "Unlimited" : plan.listings}{" "}
                        Listings
                      </div>
                    </CardHeader>
                    <Divider className="opacity-50" />
                    <CardBody className="py-6">
                      <ul className="space-y-3.5 text-sm text-left">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <FaCheckCircle
                              className="text-[#a72346] shrink-0 mt-0.5"
                              size={14}
                            />
                            <span className="text-gray-600 font-medium leading-tight">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                  </div>
                  <CardFooter className="pt-2 pb-4">
                    <CtaButton
                      variant={plan.popular ? "primary" : "outline"}
                      className={twMerge(
                        clsx(
                          plan.popular
                            ? "bg-[#a72346] hover:bg-[#8e1c3a] text-white"
                            : "border-gray-300 bg-[#1a1a1a] text-white",
                        ),
                      )}
                      onClick={() => handleSubscribe(plan.planId)}
                    >
                      {plan.popular ? "Subscribe Now" : "Choose Plan"}
                    </CtaButton>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─── How It Works (3 Steps) ──────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center mb-12">
            <span className="text-[#a72346] font-bold text-xs uppercase tracking-widest block mb-2">
              Simple Process
            </span>
            <Heading2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Just 3 steps to sell your car with Khazu
            </Heading2>
            <div className="w-12 h-1 bg-[#a72346] mx-auto mt-4 rounded-full"></div>
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
                  <div className="absolute flex items-center justify-center gap-2 bottom-3 right-3 bg-[#a72346] text-white rounded-md p-2">
                    <div className="text-primary flex justify-center">
                      <p className="text-sm">{item.icon}</p>
                    </div>
                    <p className="text-sm">{item.tooltip}</p>
                  </div>
                </div>

                <div className="p-4">
                  <Heading3 className="mb-1">{item.title}</Heading3>
                  <p className="text-gray-800">{item.description}</p>
                </div>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      {/* ─── Why Sell on Khazu ─────────────────────────────── */}
      <section className="py-16 md:py-24 bg-cream/35 border-t bg-[#a72346] border-gray-100">
        <Container>
          <div className="text-center mb-16">
            <span className="text-white font-bold text-xs uppercase tracking-widest block mb-2">
              Why Choose Khazu?
            </span>
            <Heading2 className="text-3xl md:text-4xl font-black text-gray-100 tracking-tight">
              More reasons to sell on Khazu
            </Heading2>
            <div className="w-12 h-1 bg-white mx-auto mt-4 rounded-full"></div>
          </div>

          <Grid cols={3} gap="lg">
            <Card
              padding="lg"
              hover
              className="text-center border-none bg-white   transition-all"
            >
              <div className="text-4xl text-[#a72346] mb-4 flex justify-center">
                <FaShieldAlt size={48} />
              </div>
              <Heading4 className="mb-2">No Commission</Heading4>
              <Body muted className="text-gray-600">
                We never take a cut of your sale. You keep 100% of what your car
                is worth. Only pay for listing subscription.
              </Body>
            </Card>

            <Card
              padding="lg"
              hover
              className="text-center border-none bg-white   transition-all"
            >
              <div className="text-4xl text-[#a72346] mb-4 flex justify-center">
                <FaClock size={48} />
              </div>
              <Heading4 className="mb-2">Sell Fast</Heading4>
              <Body muted className="text-gray-600">
                Boosted listings appear at the top of searches and go directly
                to thousands of active buyers across Eswatini.
              </Body>
            </Card>

            <Card
              padding="lg"
              hover
              className="text-center border-none bg-white  transition-all"
            >
              <div className="text-4xl text-[#a72346] mb-4 flex justify-center">
                <FaUsers size={48} />
              </div>
              <Heading4 className="mb-2">Verified Buyers</Heading4>
              <Body muted className="text-gray-600">
                Every buyer is verified. No time wasters, no spam. Just real
                people looking for the right car.
              </Body>
            </Card>

            <Card
              padding="lg"
              hover
              className="text-center border-none bg-white  transition-all"
            >
              <div className="text-4xl text-[#a72346] mb-4 flex justify-center">
                <FaChartLine size={48} />
              </div>
              <Heading4 className="mb-2">Real Analytics</Heading4>
              <Body muted className="text-gray-600">
                Track views, contacts, and conversions. Know exactly how your
                listing is performing.
              </Body>
            </Card>

            <Card
              padding="lg"
              hover
              className="text-center border-none bg-white  transition-all"
            >
              <div className="text-4xl text-[#a72346] mb-4 flex justify-center">
                <FaCheckCircle size={48} />
              </div>
              <Heading4 className="mb-2">Trust & Safety</Heading4>
              <Body muted className="text-gray-600">
                Verified dealers, fraud detection, and secure payments. We
                protect every transaction.
              </Body>
            </Card>

            <Card
              padding="lg"
              hover
              className="text-center border-none bg-white  transition-all"
            >
              <div className="text-4xl text-[#a72346] mb-4 flex justify-center">
                <FaPhone size={48} />
              </div>
              <Heading4 className="mb-2">Local Support</Heading4>
              <Body muted className="text-gray-600">
                Built for Eswatini. WhatsApp support, MoMo payments, and a team
                that understands the local market.
              </Body>
            </Card>
          </Grid>
        </Container>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-16 md:py-24 bg-cream/35 border-t border-gray-100">
        <Container className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#a72346] font-bold text-xs uppercase tracking-widest block mb-2">
              Help Center
            </span>
            <Heading2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Frequently Asked Questions
            </Heading2>
            <div className="w-12 h-1 bg-[#a72346] mx-auto mt-4 rounded-full"></div>
          </div>

          <Accordion
            className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden"
            items={[
              {
                id: "1",
                title: "Can I switch plans later?",
                content:
                  "Absolutely. You can upgrade, downgrade, or cancel your dealer subscription at any point from your dashboard. Upgrades are effective instantly and prorated.",
              },
              {
                id: "2",
                title: "What payment methods do you accept?",
                content:
                  "We support MTN MoMo, eSwatini Mobile Money, debit/credit cards, and direct bank EFT transfers.",
              },
              {
                id: "3",
                title: "Is there a free trial for dealerships?",
                content:
                  "Yes, new dealerships get a 28-day free trial to explore our lead management features and list up to 5 cars before choosing a plan.",
              },
              {
                id: "4",
                title: "What happens if I exceed my listing allocation?",
                content:
                  "If you hit your listing limit, you can easily upgrade to the next tier or archive old/sold listings to free up slots.",
              },
              {
                id: "5",
                title: "How do boosts work for private sellers?",
                content:
                  "Boosts are one-time upgrades that place your vehicle at the top of organic searches and send instant email notifications to matches for 7, 14, or 28 days. New users get 7 days free on their first boost.",
              },
              {
                id: "6",
                title: "Does Khazu charge commission on sales?",
                content:
                  "No. Khazu does not take any commission. We only charge fixed fees for optional boosts and dealer subscriptions. All of your sale proceeds are yours.",
              },
            ]}
          />
        </Container>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a72346]/10 blur-[100px] -mr-48 -mt-48" />
        <Container className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <Heading2 className="text-3xl md:text-5xl font-black uppercase text-white mb-4 tracking-tight">
            Ready to Accelerate Sales?
          </Heading2>
          <p className="text-gray-300 text-base md:text-lg mb-8 font-medium">
            Join hundreds of trusted sellers and premier dealerships across
            Eswatini who list with Khazu.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <Link href="/signup" className="w-full sm:w-auto">
              <CtaButton
                variant="primary"
                className="bg-[#a72346] hover:bg-[#8e1c3a] font-bold uppercase tracking-wider shadow-lg shadow-[#a72346]/20"
              >
                Sign Up Free <FaArrowRight className="ml-2" />
              </CtaButton>
            </Link>
            <Link href="/docs" className="w-full sm:w-auto">
              <CtaButton variant="inverse" className="font-bold uppercase tracking-wider">
                Contact Sales
              </CtaButton>
            </Link>
          </div>
        </Container>
      </section>

      <PublicFooter />

      {checkoutPlanId && (
        <CheckoutDrawer
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          role={checkoutRole}
          planId={checkoutPlanId}
          addonIds={[]}
          onSuccess={(message) => setToast({ type: "success", message })}
        />
      )}

      <ToastContainer>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </ToastContainer>
    </>
  );
}
