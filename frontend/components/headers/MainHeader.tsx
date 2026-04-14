"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, Search, X, PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import CartButton from "./CartButton";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import { useCart } from "@/context/CartContext";

export default function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "w-full bg-white/95 backdrop-blur-sm transition-shadow duration-300",
          isScrolled && "shadow-md"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 3-section row: logo | [centered search] | icons */}
          <div className="flex items-center py-3 lg:py-4">

            {/* ── LEFT: Logo + mobile hamburger ── */}
            <div className="flex items-center gap-2 shrink-0 z-10">
              <button
                className="lg:hidden p-2 -ml-1 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </button>

              <Link
                href="/"
                className="flex items-center"
                aria-label="Pethiyan — Home"
              >
                <Image
                  src="/pethiyan-logo.png"
                  alt="Pethiyan"
                  width={3000}
                  height={3000}
                  className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* ── CENTER: Search bar ── */}
            <div className="hidden md:flex flex-1 justify-start px-6">
              <div className="w-full max-w-[260px] lg:max-w-[320px]">
                <SearchBar />
              </div>
            </div>

            {/* ── RIGHT: Action icons ── */}
            <div className="flex items-center gap-1 shrink-0 z-10">
              {/* Search / Close icon — mobile only */}
              <button
                className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setMobileSearchOpen((s) => !s)}
                aria-label={mobileSearchOpen ? "Close search" : "Search"}
                aria-expanded={mobileSearchOpen ? "true" : "false"}
              >
                {mobileSearchOpen
                  ? <X className="h-5 w-5 text-gray-700" />
                  : <Search className="h-5 w-5 text-gray-700" />
                }
              </button>

              <UserMenu />
              <CartButton onClick={openCart} />

              {/* Track Order icon — desktop only */}
              <Link
                href="/track-order"
                className="hidden lg:flex p-2 rounded-full hover:bg-gray-100 transition-colors group relative"
                aria-label="Track Order"
              >
                <PackageSearch className="h-5 w-5 text-gray-700 group-hover:text-(--color-primary) transition-colors" />
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Track Order
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile expanded search */}
          {mobileSearchOpen && (
            <div className="md:hidden pb-3 px-1">
              <div className="flex items-center gap-2 bg-gray-50 rounded-full border border-gray-200 px-4 py-2.5">
                <Search className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search for products, packaging, pouches..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 text-gray-900"
                  aria-label="Search products"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
