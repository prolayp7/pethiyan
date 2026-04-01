"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import MegaMenu from "@/components/navigation/MegaMenu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories", hasMegaMenu: true },
  { label: "Packaging Bags", href: "/categories/packaging-bags" },
  { label: "Ziplock Pouches", href: "/categories/ziplock-pouches" },
  { label: "Standup Pouches", href: "/categories/standup-pouches" },
  { label: "Custom Packaging", href: "/categories/custom-packaging" },
  { label: "Eco Packaging", href: "/categories/eco-packaging" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function NavigationMenu() {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  return (
    <nav
      className="hidden lg:block border-b border-gray-100 bg-white relative"
      aria-label="Category navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center">
          {navItems.map((item) => (
            <li key={item.label} className="relative">
              {item.hasMegaMenu ? (
                <button
                  className={cn(
                    "flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors",
                    megaMenuOpen
                      ? "text-(--color-primary)"
                      : "text-gray-700 hover:text-(--color-primary)"
                  )}
                  onMouseEnter={() => setMegaMenuOpen(true)}
                  onMouseLeave={() => setMegaMenuOpen(false)}
                  aria-expanded={megaMenuOpen}
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      megaMenuOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-(--color-primary) transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Mega Menu */}
      {megaMenuOpen && (
        <div
          onMouseEnter={() => setMegaMenuOpen(true)}
          onMouseLeave={() => setMegaMenuOpen(false)}
        >
          <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
        </div>
      )}
    </nav>
  );
}
