"use client";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronRight,
} from "react-icons/fa";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Container } from "../../Layout/Container/Container";
import { Button } from "../../Buttons/Button/Button";
import { Badge } from "../../Badges/Badge/Badge";
import { Logo } from "../../Shared/Logo/Logo";
import { InputText } from "../../Inputs/InputText/InputText";

interface PublicFooterProps {
  className?: string;
}

export function PublicFooter({ className = "" }: PublicFooterProps) {
  const currentYear = new Date().getFullYear();

  const popularBrands = [
    "Toyota",
    "Volkswagen",
    "Ford",
    "Nissan",
    "Honda",
    "Mercedes-Benz",
    "BMW",
    "Audi",
    "Hyundai",
    "Kia",
  ];

  const quickLinks = [
    { label: "Buy a Car", href: "/listings" },
    { label: "Sell a Car", href: "/sell" },
    { label: "Car Finance", href: "/finance" },
    { label: "Car Insurance", href: "/insurance" },
    { label: "Car Reviews", href: "/reviews" },
    { label: "News & Articles", href: "/news" },
  ];

  const aboutLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Advertise", href: "/advertise" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ];

  const contactInfo = [
    { icon: <FaPhone size={14} />, label: "Call us", value: "+268 2400 0000" },
    {
      icon: <FaEnvelope size={14} />,
      label: "Email",
      value: "info@khazu.co.sz",
    },
    {
      icon: <FaMapMarkerAlt size={14} />,
      label: "Visit",
      value: "Mbabane, Eswatini",
    },
  ];

  const socialLinks = [
    { icon: <FaFacebookF size={18} />, href: "#", label: "Facebook" },
    { icon: <FaTwitter size={18} />, href: "#", label: "Twitter" },
    { icon: <FaInstagram size={18} />, href: "#", label: "Instagram" },
    { icon: <FaYoutube size={18} />, href: "#", label: "YouTube" },
    { icon: <FaWhatsapp size={18} />, href: "#", label: "WhatsApp" },
  ];

  return (
    <footer className={twMerge(clsx("bg-[#1a1a1a]/80 text-white/80", className))}>
      {/* Top Section – Newsletter & Trust Badges */}
      <div className="bg-dark/50 border-b border-white/10">
        <Container>
          <div className="py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-white mb-1">
                Get the best deals straight to your inbox
              </h3>
              <p className="text-sm text-white/60">
                Subscribe to our newsletter for the latest car listings and
                offers.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <InputText
                placeholder="Enter your email"
                className="bg-white/10 border-white/10 text-white placeholder:text-white/40 min-w-[240px]"
                fullWidth
              />
              <Button variant="primary" size="md" className="shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Middle Section – Main Footer Content */}
      <Container>
        <div className="py-10 md:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & About */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Logo className="text-2xl font-bold text-white flex items-center gap-2 mb-3">
              <span className="text[#CD2C58]">Khazu</span>
              <span className="text-white/50 font-normal text-sm">• cars</span>
            </Logo>
            <p className="text-sm text-white/60 mb-4 max-w-xs">
              Eswatini's trusted car marketplace. Find the best deals on new and
              used cars from private sellers and dealers across the country.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-display text-white font-semibold mb-3 text-sm tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <FaChevronRight size={10} className="text[#CD2C58]/60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Brands */}
          <div>
            <h4 className="font-display text-white font-semibold mb-3 text-sm tracking-wider uppercase">
              Popular Brands
            </h4>
            <ul className="grid grid-cols-2 gap-1">
              {popularBrands.map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/listings?make=${brand}`}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: About Khazu */}
          <div>
            <h4 className="font-display text-white font-semibold mb-3 text-sm tracking-wider uppercase">
              About Khazu
            </h4>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <FaChevronRight size={10} className="text[#CD2C58]/60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div>
            <h4 className="font-display text-white font-semibold mb-3 text-sm tracking-wider uppercase">
              Contact Us
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text[#CD2C58]/80 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-xs text-white/40">{item.label}</p>
                    <p className="text-sm text-white/80">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <Badge variant="primary" className="text-[10px]">
                Safe & Secure
              </Badge>
              <Badge
                variant="secondary"
                className="text-[10px] bg-white/10 text-white/60 border-white/10"
              >
                Verified
              </Badge>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Section – Copyright & Legal */}
      <div className="border-t border-white/10">
        <Container>
          <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-white/40">
              © {currentYear} <span className="text[#CD2C58]/60">Khazu</span>.
              All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-white/40">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Use
              </Link>
              <span>•</span>
              <Link
                href="/cookies"
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
