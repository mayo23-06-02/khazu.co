"use client";

import { Container, Heading2, Accordion } from "@/components/ui";

const faqs = [
  {
    id: "faq-1",
    title: "What is Khazu?",
    content:
      "Khazu is Eswatini's premium automotive marketplace, connecting buyers and sellers with verified listings and advanced valuation tools.",
  },
  {
    id: "faq-2",
    title: "How does Khazu work?",
    content:
      "Sellers list their cars with detailed specs and images. Buyers can browse verified listings, use our Khazu KPI to evaluate deals, and contact sellers directly.",
  },
  {
    id: "faq-3",
    title: "Does it cost me anything to use Khazu?",
    content:
      "Browsing and searching is completely free. We offer free listings for individual sellers, with optional premium features for faster sales.",
  },
];

export function FaqSection() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="max-w-3xl">
          <Heading2 className="mb-8">FAQ</Heading2>
          <Accordion
            items={faqs}
            className="bg-white rounded-lg border border-gray-300"
          />
        </div>
      </Container>
    </section>
  );
}
