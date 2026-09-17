"use client";
import { useState, useEffect, useRef } from "react";
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
  FaSpinner,
} from "react-icons/fa";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Container } from "../../Layout/Container/Container";
import { Button } from "../../Buttons/Button/Button";
import { Badge } from "../../Badges/Badge/Badge";
import { Logo } from "../../Shared/Logo/Logo";
import { InputText } from "../../Inputs/InputText/InputText";
import { Avatar } from "../../Shared/Avatar/Avatar";

// Mock search suggestions
const SEARCH_SUGGESTIONS = [
  "Toyota Hilux",
  "Ford Ranger",
  "Volkswagen Amarok",
  "Nissan Navara",
  "Toyota Land Cruiser",
  "Mercedes-Benz G-Class",
  "BMW X5",
  "Audi Q5",
  "Honda CR-V",
  "Hyundai Tucson",
  "Kia Sportage",
  "Mitsubishi Pajero",
];

interface PublicHeaderWithSearchProps {
  className?: string;
  user?: {
    name: string;
    avatar?: string;
  } | null;
}

export function PublicHeaderWithSearch({
  className = "",
  user = null,
}: PublicHeaderWithSearchProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Scroll listener
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Click outside for search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter suggestions based on input
  const filteredSuggestions = searchValue
    ? SEARCH_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : SEARCH_SUGGESTIONS;

  const navLinks = [
    { label: "Buy a Car", href: "/listings", icon: <FaCar size={14} /> },
    { label: "Sell a Car", href: "/sell", icon: <FaTag size={14} /> },
    { label: "Finance", href: "/finance", icon: null },
    { label: "News & Reviews", href: "/news", icon: <FaNewspaper size={14} /> },
    { label: "Car Reviews", href: "/reviews", icon: <FaStar size={14} /> },
  ];

  return (
    <>
      <header
        className={twMerge(
          clsx(
            "bg-white border-b border-black/5 sticky top-0 z-50 transition-shadow duration-200",
            isScrolled && "shadow-md",
            className,
          ),
        )}
      >
        <Container>
          {/* Main Header Bar */}
          <div className="flex items-center justify-between h-16 md:h-20 gap-2">
            {/* Logo */}
            <div className="shrink-0">
              <Logo className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-[#CD2C58]">Khazu</span>
                <span className="text-gray-800 font-normal text-sm hidden sm:inline">
                  • cars
                </span>
              </Logo>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 mx-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-800/70 hover:text-gray-800 hover:bg-dark/5 rounded-lg transition-colors"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {user ? (
                <div className="flex items-center gap-3">
                  <Avatar
                    src={user.avatar}
                    initials={user.name.charAt(0)}
                    size="sm"
                  />
                  <span className="text-sm text-gray-800/70">{user.name}</span>
                  <button className="text-gray-800/40 hover:text-gray-800 transition-colors">
                    <FaChevronDown size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-gray-800/70 hover:text-gray-800 transition-colors px-2 py-1.5"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-medium text-gray-800/70 hover:text-gray-800 transition-colors px-2 py-1.5"
                  >
                    Register
                  </Link>
                </>
              )}
              <Button variant="primary" size="sm" className="ml-1">
                Sell My Car
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-dark/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Search Bar with Suggestions */}
          <div
            className="hidden md:flex pb-3 pt-3 border-t border-black/5 relative"
            ref={searchRef}
          >
            <div className="flex-1 max-w-2xl mx-auto relative">
              <div className="relative">
                <InputText
                  placeholder="Search cars by make, model, or keyword..."
                  icon={<FaSearch size={16} />}
                  className="pr-12"
                  fullWidth
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                />
                <Button
                  variant="primary"
                  size="sm"
                  className="absolute right-1 top-1 px-3 py-1.5"
                  onClick={() => setIsSearching(true)}
                >
                  {isSearching ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>

              {/* Search Suggestions Dropdown */}
              {searchFocused && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-black/5 py-1 z-50 max-h-60 overflow-y-auto">
                  {filteredSuggestions.map((suggestion) => (
                    <Link
                      key={suggestion}
                      href={`/listings?search=${encodeURIComponent(suggestion)}`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-dark/5 transition-colors"
                      onClick={() => setSearchFocused(false)}
                    >
                      <FaSearch size={12} className="text-gray-800/30" />
                      {suggestion}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-black/5">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-800/70 hover:text-gray-800 hover:bg-dark/5 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-dark/5 my-2" />
                {user ? (
                  <>
                    <div className="px-4 py-2 flex items-center gap-3">
                      <Avatar
                        src={user.avatar}
                        initials={user.name.charAt(0)}
                        size="sm"
                      />
                      <span className="text-sm text-gray-800/70">
                        {user.name}
                      </span>
                    </div>
                    <Link
                      href="/profile"
                      className="px-4 py-2.5 text-gray-800/70 hover:text-gray-800 hover:bg-dark/5 rounded-lg transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/saved"
                      className="px-4 py-2.5 text-gray-800/70 hover:text-gray-800 hover:bg-dark/5 rounded-lg transition-colors"
                    >
                      Saved Cars
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="px-4 py-2.5 text-gray-800/70 hover:text-gray-800 hover:bg-dark/5 rounded-lg transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2.5 text-gray-800/70 hover:text-gray-800 hover:bg-dark/5 rounded-lg transition-colors"
                    >
                      Register
                    </Link>
                  </>
                )}
                <Button variant="primary" size="sm" fullWidth className="mt-2">
                  Sell My Car
                </Button>
              </div>
            </div>
          )}
        </Container>
      </header>

      {/* Mobile Search Bar (visible on mobile only) */}
      <div className="md:hidden bg-white border-b border-black/5 px-4 py-2">
        <div className="relative">
          <InputText
            placeholder="Search cars..."
            icon={<FaSearch size={16} />}
            className="pr-12 text-sm"
            fullWidth
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
