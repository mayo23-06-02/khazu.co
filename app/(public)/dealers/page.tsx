import Link from "next/link";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { MdVerified, MdStore } from "react-icons/md";
import {
  Container,
  Heading1,
  Body,
  Badge,
  Avatar,
  Card,
  CardBody,
  PublicHeader,
  PublicFooter,
} from "@/components/ui";
import { getDealerDirectory } from "@/lib/marketplace/dealers";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Car Dealers in Eswatini",
  description:
    "Find registered car dealerships across Eswatini on Khazu. Browse dealer profiles, current stock and contact details.",
  alternates: { canonical: absoluteUrl("/dealers") },
  openGraph: {
    title: "Car Dealers in Eswatini | Khazu",
    description:
      "Find registered car dealerships across Eswatini. Browse dealer profiles, current stock and contact details.",
    url: absoluteUrl("/dealers"),
  },
};

export const dynamic = "force-dynamic";

function toWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("268") ? digits : `268${digits}`;
}

export default async function DealersPage() {
  const dealers = await getDealerDirectory();

  return (
    <>
      <PublicHeader />
      <main className="bg-cream/30 min-h-dvh py-8">
        <Container>
          <div className="mb-8">
            <Heading1 className="text-dark">Dealerships</Heading1>
            <Body className="text-gray-500 mt-2">
              Browse dealerships on Khazu and see what they have in stock.
            </Body>
          </div>

          {dealers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealers.map((dealer) => {
                const name = dealer.business_name || dealer.full_name || "Dealership";
                const waPhone = dealer.phone ? toWhatsAppNumber(dealer.phone) : null;

                return (
                  <Card
                    key={dealer.id}
                    padding="none"
                    className="border border-black/5 overflow-hidden"
                  >
                    <CardBody className="p-5">
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={dealer.avatar_url || undefined}
                          initials={name.charAt(0)}
                          size="lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-display font-bold text-gray-900 truncate">
                              {name}
                            </h3>
                            {dealer.is_registered_business && (
                              <MdVerified
                                className="text-[#CD2C58] shrink-0"
                                size={18}
                              />
                            )}
                          </div>
                          {dealer.city && (
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                              <FaMapMarkerAlt size={12} />
                              {dealer.city}
                            </p>
                          )}
                        </div>
                      </div>

                      {dealer.bio && (
                        <Body size="sm" className="text-gray-600 mt-3 line-clamp-2">
                          {dealer.bio}
                        </Body>
                      )}

                      <div className="flex items-center flex-wrap gap-2 mt-4">
                        <Badge variant="secondary">
                          <MdStore className="mr-1" size={14} />
                          {dealer.activeListings}{" "}
                          {dealer.activeListings === 1 ? "car" : "cars"} in stock
                        </Badge>
                        {dealer.years_in_operation != null && (
                          <Badge variant="secondary">
                            {dealer.years_in_operation}+ yrs in business
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Link
                          href={`/listings?sellerId=${dealer.id}`}
                          className="flex-1 text-center text-sm font-bold text-white bg-[#CD2C58] hover:bg-[#a72346] rounded-xl h-10 flex items-center justify-center"
                        >
                          View inventory
                        </Link>
                        {waPhone && (
                          <a
                            href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                              `Hi ${name}, I'd like to know more about your stock on Khazu.`,
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#25D366] text-white shrink-0"
                            aria-label={`Chat with ${name} on WhatsApp`}
                          >
                            <FaWhatsapp size={18} />
                          </a>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <Body muted>No dealerships listed yet.</Body>
              <Link
                href="/listings"
                className="text-[#CD2C58] font-bold underline"
              >
                Browse marketplace
              </Link>
            </div>
          )}
        </Container>
      </main>
      <PublicFooter />
    </>
  );
}
