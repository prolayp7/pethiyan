"use client";

import Link from "next/link";
import Image from "next/image";
import { X, ChevronRight, Search, HelpCircle, MapPin, Phone } from "lucide-react";
import { useEffect } from "react";

interface NavItem {
  label: string;
  href: string;
  hasSubmenu?: boolean;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories", hasSubmenu: true },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Custom Packaging", href: "/categories/custom-packaging" },
  { label: "Eco Packaging", href: "/categories/eco-packaging" },
];

const utilityItems = [
  { label: "Help Center", href: "/help", icon: HelpCircle },
  { label: "Track Order", href: "/track-order", icon: MapPin },
  { label: "Contact Us", href: "/contact", icon: Phone },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link href="/" onClick={onClose} aria-label="Pethiyan — Home">
            <Image
              src="/pethiyan-logo.png"
              alt="Pethiyan"
              width={3000}
              height={3000}
              className="h-12 w-auto object-contain"
            />
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-full border border-gray-200">
            <Search className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search products..."
              className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 text-gray-900"
              aria-label="Search products"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2" aria-label="Mobile navigation">
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-5 py-3.5 text-gray-700 hover:bg-gray-50 hover:text-(--color-primary) transition-colors"
                >
                  <span className="font-medium">{item.label}</span>
                  {item.hasSubmenu && (
                    <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Utility Links */}
        <div className="border-t border-gray-100 px-5 py-4 space-y-1">
          {utilityItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              className="flex items-center gap-2.5 py-2 text-sm text-gray-500 hover:text-(--color-primary) transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
