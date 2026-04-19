"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, X, PackageSearch, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import CartButton from "./CartButton";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import LoginModal from "@/components/auth/LoginModal";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import type { ApiMenuItem } from "@/lib/api";

interface MainHeaderProps {
  mobileNavItems?: ApiMenuItem[];
}

export default function MainHeader({ mobileNavItems }: MainHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isLoggedIn } = useAuth();
  const { appName, logo } = useSiteSettings();
  const router = useRouter();

  const handleWishlistClick = () => {
    if (isLoggedIn) {
      router.push("/account/wishlist");
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <>
      <header
        className={cn(
          "w-full bg-white border-b border-gray-100"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 3-section row: logo | [centered search] | icons */}
          <div className="relative flex items-center justify-between py-3">

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
                aria-label={`${appName} — Home`}
              >
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    suppressHydrationWarning
                    src={logo}
                    alt={appName}
                    style={{ height: 40, width: "auto", maxWidth: 160, objectFit: "contain", display: "block" }}
                  />
                ) : (
                  <span className="text-xl font-extrabold text-(--color-secondary)">{appName}</span>
                )}
              </Link>
            </div>

            {/* ── CENTER: Search bar — absolutely centered ── */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 justify-center pointer-events-none hidden md:flex">
              <div className="w-full max-w-xl lg:max-w-4xl pl-6 pr-10 pointer-events-auto">
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
                aria-expanded={mobileSearchOpen}
              >
                {mobileSearchOpen
                  ? <X className="h-5 w-5 text-gray-700" />
                  : <Search className="h-5 w-5 text-gray-700" />
                }
              </button>

              {/* Track Order icon — mobile only */}
              <Link
                href="/track-order"
                className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Track Order"
              >
                <PackageSearch className="h-5 w-5 text-gray-700" />
              </Link>

              <span className="hidden md:contents"><UserMenu /></span>

              {/* Wishlist icon */}
              <button
                type="button"
                onClick={handleWishlistClick}
                className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 transition-colors group relative"
                aria-label="Wishlist"
              >
                <Heart className="h-7 w-7 text-gray-700 group-hover:text-red-500 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-[18px] text-center font-semibold">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Wishlist
                </span>
              </button>
              <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

              <span className="hidden md:contents"><CartButton onClick={openCart} /></span>

              {/* Track Order icon — desktop only */}
              <Link
                href="/track-order"
                className="hidden lg:flex p-2 rounded-full hover:bg-gray-100 transition-colors group relative"
                aria-label="Track Order"
              >
                <PackageSearch className="h-7 w-7 text-gray-700 group-hover:text-(--color-primary) transition-colors" />
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
        navItems={mobileNavItems}
      />
    </>
  );
}
