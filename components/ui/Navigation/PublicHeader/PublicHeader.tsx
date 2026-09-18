"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaBell,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaCar,
  FaTag,
  FaNewspaper,
  FaStar,
  FaTruck,
  FaMoneyBill,
  FaUserAlt,
} from "react-icons/fa";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Container } from "../../Layout/Container/Container";
import { Button } from "../../Buttons/Button/Button";
import { Logo } from "../../Shared/Logo/Logo";
import { InputText } from "../../Inputs/InputText/InputText";
import { FaBagShopping, FaShop } from "react-icons/fa6";

interface PublicHeaderProps {
  className?: string;
}

export function PublicHeader({ className = "" }: PublicHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll listener
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const navLinks = [
    { label: "New", href: "/listings?condition=new", icon: null },
    { label: "Used", href: "/listings?condition=used", icon: null },
    { label: "Sedans", href: "/listings?bodyType=Sedan", icon: null },
    { label: "Vans", href: "/listings?bodyType=Van", icon: null },
    { label: "Trucks", href: "/listings?bodyType=Truck", icon: null },
    { label: "Dealers", href: "/dealers", icon: null },
    { label: "Pricing", href: "/pricing", icon: null },
  ];

  return (
    <header
      className={twMerge(
        clsx(
          "bg-white  sticky border border-gray-200 top-0 z-50  duration-200",

          className,
        ),
      )}
    >
      <Container>
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-16 md:h-20 gap-2">
          {/* Logo */}
          <div className="shrink-0">
            <Logo />
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 lg:gap-2 mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-black  hover:text-dark hover:bg-dark/5 rounded-lg transition-colors"
              >
                {link.icon}
                <h1 className="font-medium">{link.label}</h1>
              </Link>
            ))}
          </nav>
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link
              href="/dashboard/personal"
              className="text-sm font-bold flex items-center space-x-2  text-black hover:text-dark hover:bg-dark/5 rounded-sm transition-colors px-4 py-2"
            >
            Login
            </Link>
            <Link href="/sell/upload">
              <Button variant="primary" size="sm" className="ml-1">
                <FaBagShopping className="mr-2" size={16} />
                Sell My Car
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle - covers both phone and tablet widths, since
              the full desktop nav only has room from lg: up. */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-dark/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-black/5">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2.5 text-dark/70 hover:text-dark hover:bg-dark/5 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-dark/5 my-2" />
              <Link
                href="/auth/login"
                className="px-4 py-2.5 text-dark/70 hover:text-dark hover:bg-dark/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2.5 text-dark/70 hover:text-dark hover:bg-dark/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
              <Link href="/sell/upload" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" size="sm" fullWidth className="mt-2">
                  Sell My Car
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
