"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package, Lock, Box, Droplets, Wind, Layers, Palette, Leaf, ChevronRight, ArrowRight
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import MegaMenuBestSellers from "./MegaMenuBestSellers";

interface SubLink {
  label: string;
  href: string;
}

interface Featured {
  image: string;
  badge: string;
  title: string;
  desc: string;
  href: string;
}

interface SidebarCategory {
  label: string;
  href: string;
  Icon: LucideIcon;
  subHeading: string;
  subLinks: SubLink[];
  featured: Featured;
}

const sidebarCategories: SidebarCategory[] = [
  {
    label: "Stand-Up Pouches",
    href: "/categories/standup-pouches",
    Icon: Package,
    subHeading: "Browse Stand-Up Pouches",
    subLinks: [
      { label: "Resealable Pouches", href: "/categories/standup-pouches/resealable" },
      { label: "Clear Stand-Up Pouches", href: "/categories/standup-pouches/clear" },
      { label: "Kraft Stand-Up Pouches", href: "/categories/standup-pouches/kraft" },
      { label: "Matte Black Pouches", href: "/categories/standup-pouches/matte" },
      { label: "Window Stand-Up Pouches", href: "/categories/standup-pouches/window" },
      { label: "Foil Lined Pouches", href: "/categories/standup-pouches/foil" },
      { label: "Custom Printed Pouches", href: "/categories/standup-pouches/custom" },
      { label: "Child-Resistant Pouches", href: "/categories/standup-pouches/child-resistant" },
      { label: "Eco Stand-Up Bags", href: "/categories/standup-pouches/eco" },
    ],
    featured: {
      image: "/images/banners/1.jpg",
      badge: "Best Seller",
      title: "Premium Resealable Stand-Up Pouches",
      desc: "Retail-ready with zipper seal and high-barrier protection.",
      href: "/categories/standup-pouches",
    },
  },
  {
    label: "Ziplock Bags",
    href: "/categories/ziplock-pouches",
    Icon: Lock,
    subHeading: "Browse Ziplock Bags",
    subLinks: [
      { label: "Clear Ziplock Bags", href: "/categories/ziplock-pouches/clear" },
      { label: "Frosted Ziplock Bags", href: "/categories/ziplock-pouches/frosted" },
      { label: "Heavy Duty Ziplock", href: "/categories/ziplock-pouches/heavy-duty" },
      { label: "Food Grade Ziplock", href: "/categories/ziplock-pouches/food-grade" },
      { label: "Stand-Up Ziplock Bags", href: "/categories/ziplock-pouches/standup" },
      { label: "Mini Ziplock Pouches", href: "/categories/ziplock-pouches/mini" },
      { label: "Bulk Ziplock Bags", href: "/categories/ziplock-pouches/bulk" },
      { label: "Anti-Static Ziplock", href: "/categories/ziplock-pouches/anti-static" },
    ],
    featured: {
      image: "/images/banners/2.jpg",
      badge: "Popular",
      title: "Heavy-Duty Ziplock Bags",
      desc: "Airtight seal — trusted by food & pharma brands globally.",
      href: "/categories/ziplock-pouches",
    },
  },
  {
    label: "Flat Bottom Bags",
    href: "/categories/flat-bottom-bags",
    Icon: Box,
    subHeading: "Browse Flat Bottom Bags",
    subLinks: [
      { label: "Kraft Flat Bottom", href: "/categories/flat-bottom-bags/kraft" },
      { label: "Matte Flat Bottom", href: "/categories/flat-bottom-bags/matte" },
      { label: "Glossy Flat Bottom", href: "/categories/flat-bottom-bags/glossy" },
      { label: "Window Flat Bottom", href: "/categories/flat-bottom-bags/window" },
      { label: "Custom Print Flat Bottom", href: "/categories/flat-bottom-bags/custom" },
      { label: "Eco Flat Bottom Bags", href: "/categories/flat-bottom-bags/eco" },
      { label: "Coffee Flat Bottom Bags", href: "/categories/flat-bottom-bags/coffee" },
      { label: "Bulk Flat Bottom", href: "/categories/flat-bottom-bags/bulk" },
    ],
    featured: {
      image: "/images/banners/3.jpg",
      badge: "Premium",
      title: "Custom Flat Bottom Bags",
      desc: "Sturdy, self-standing bags perfect for coffee and gourmet food.",
      href: "/categories/flat-bottom-bags",
    },
  },
  {
    label: "Spout Pouches",
    href: "/categories/spout-pouches",
    Icon: Droplets,
    subHeading: "Browse Spout Pouches",
    subLinks: [
      { label: "Liquid Spout Pouches", href: "/categories/spout-pouches/liquid" },
      { label: "Juice Spout Pouches", href: "/categories/spout-pouches/juice" },
      { label: "Baby Food Pouches", href: "/categories/spout-pouches/baby" },
      { label: "Laundry Detergent Pouches", href: "/categories/spout-pouches/laundry" },
      { label: "Sports Drink Pouches", href: "/categories/spout-pouches/sports" },
      { label: "Sauce Pouches", href: "/categories/spout-pouches/sauce" },
      { label: "Custom Spout Pouches", href: "/categories/spout-pouches/custom" },
    ],
    featured: {
      image: "/images/banners/4.jpg",
      badge: "Versatile",
      title: "Spout Pouches for Every Liquid",
      desc: "From juice to laundry — leak-proof spout pouches for any application.",
      href: "/categories/spout-pouches",
    },
  },
  {
    label: "Vacuum Pouches",
    href: "/categories/vacuum-pouches",
    Icon: Wind,
    subHeading: "Browse Vacuum Pouches",
    subLinks: [
      { label: "Food Vacuum Bags", href: "/categories/vacuum-pouches/food" },
      { label: "Industrial Vacuum Bags", href: "/categories/vacuum-pouches/industrial" },
      { label: "Retort Pouches", href: "/categories/vacuum-pouches/retort" },
      { label: "Barrier Vacuum Pouches", href: "/categories/vacuum-pouches/barrier" },
      { label: "Recyclable Vacuum Bags", href: "/categories/vacuum-pouches/recyclable" },
      { label: "Clear Vacuum Bags", href: "/categories/vacuum-pouches/clear" },
      { label: "Bulk Vacuum Pouches", href: "/categories/vacuum-pouches/bulk" },
    ],
    featured: {
      image: "/images/banners/5.jpg",
      badge: "Industrial",
      title: "High-Barrier Vacuum Pouches",
      desc: "Extend shelf life and protect products from moisture and oxidation.",
      href: "/categories/vacuum-pouches",
    },
  },
  {
    label: "Window Bags",
    href: "/categories/window-bags",
    Icon: Layers,
    subHeading: "Browse Window Bags",
    subLinks: [
      { label: "Clear Window Stand-Up", href: "/categories/window-bags/standup" },
      { label: "Small Window Pouches", href: "/categories/window-bags/small" },
      { label: "Large Window Bags", href: "/categories/window-bags/large" },
      { label: "Bottom Window Bags", href: "/categories/window-bags/bottom" },
      { label: "Three-Side Seal Window", href: "/categories/window-bags/three-side" },
      { label: "Kraft Window Bags", href: "/categories/window-bags/kraft" },
      { label: "Custom Window Pouches", href: "/categories/window-bags/custom" },
    ],
    featured: {
      image: "/images/banners/6.jpg",
      badge: "Retail",
      title: "Window Bags — Let Your Product Shine",
      desc: "Clear window displays for maximum retail shelf visibility.",
      href: "/categories/window-bags",
    },
  },
  {
    label: "Custom Packaging",
    href: "/categories/custom-packaging",
    Icon: Palette,
    subHeading: "Custom Packaging Services",
    subLinks: [
      { label: "Custom Logo Pouches", href: "/categories/custom-packaging/logo" },
      { label: "Private Label Packaging", href: "/categories/custom-packaging/private-label" },
      { label: "Bespoke Design Service", href: "/categories/custom-packaging/design" },
      { label: "Branded Packaging", href: "/categories/custom-packaging/branded" },
      { label: "Custom Print Bags", href: "/categories/custom-packaging/print" },
      { label: "Minimum 500 Units", href: "/categories/custom-packaging/moq" },
      { label: "7-Day Turnaround", href: "/categories/custom-packaging/express" },
      { label: "Request Sample First", href: "/contact" },
    ],
    featured: {
      image: "/images/banners/1.jpg",
      badge: "Custom",
      title: "Build Your Brand with Custom Packaging",
      desc: "Logo to label — fully branded packaging from design to delivery.",
      href: "/categories/custom-packaging",
    },
  },
  {
    label: "Eco Packaging",
    href: "/categories/eco-packaging",
    Icon: Leaf,
    subHeading: "Eco-Friendly Packaging",
    subLinks: [
      { label: "Compostable Pouches", href: "/categories/eco-packaging/compostable" },
      { label: "Recyclable Bags", href: "/categories/eco-packaging/recyclable" },
      { label: "Kraft Paper Bags", href: "/categories/eco-packaging/kraft" },
      { label: "Biodegradable Pouches", href: "/categories/eco-packaging/biodegradable" },
      { label: "Sustainable Laminates", href: "/categories/eco-packaging/laminates" },
      { label: "Paper Stand-Up Bags", href: "/categories/eco-packaging/paper-standup" },
      { label: "PCR Packaging", href: "/categories/eco-packaging/pcr" },
      { label: "Carbon Neutral Options", href: "/categories/eco-packaging/carbon-neutral" },
    ],
    featured: {
      image: "/images/banners/2.jpg",
      badge: "Eco",
      title: "Sustainable Packaging Solutions",
      desc: "Certified eco materials that reduce your brand's carbon footprint.",
      href: "/categories/eco-packaging",
    },
  },
];

export default function MegaMenuContent({ onClose }: { onClose: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sidebarCategories[activeIndex];

  return (
    <div className="bg-white" style={{ borderTop: "3px solid #4ea85f" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── TOP: Sidebar + Right fly-out panel ── */}
        <div className="flex" style={{ minHeight: 340 }}>

          {/* LEFT SIDEBAR */}
          <div
            className="w-56 shrink-0 py-6 pr-0"
            style={{ borderRight: "1px solid #e8edf5" }}
          >
            <p
              className="text-[9px] font-black tracking-[0.28em] uppercase mb-4 px-3"
              style={{ color: "#123f7a" }}
            >
              Shop by Categories
            </p>
            <ul>
              {sidebarCategories.map((cat, i) => {
                const Icon = cat.Icon;
                const isActive = i === activeIndex;
                return (
                  <li key={cat.label}>
                    <button
                      className="w-full flex items-center justify-between px-3 py-2.5 text-left transition-all duration-150 group"
                      style={{
                        background: isActive ? "rgba(18,63,122,0.07)" : "transparent",
                        color: isActive ? "#123f7a" : "#4b5563",
                        borderLeft: isActive ? "3px solid #4ea85f" : "3px solid transparent",
                      }}
                      onMouseEnter={() => setActiveIndex(i)}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                          style={{
                            background: isActive ? "rgba(18,63,122,0.1)" : "rgba(75,85,99,0.07)",
                          }}
                        >
                          <Icon
                            className="h-3.5 w-3.5"
                            style={{ color: isActive ? "#123f7a" : "#9ca3af" }}
                          />
                        </span>
                        <span className="text-[13px] font-medium">{cat.label}</span>
                      </span>
                      <ChevronRight
                        className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "#4ea85f" }}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* CTA */}
            <div className="px-3 mt-4 pt-4" style={{ borderTop: "1px solid #e8edf5" }}>
              <Link
                href="/shop"
                className="group flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-[12px] font-black tracking-wider text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #123f7a 0%, #0f2f5f 100%)" }}
                onClick={onClose}
              >
                <span>All Packaging</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* RIGHT PANEL — fly-out content */}
          <div className="flex-1 py-6 pl-7 flex gap-5">

            {/* Sub-links (3 columns) */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-[9px] font-black tracking-[0.25em] uppercase" style={{ color: "#123f7a" }}>
                  {active.subHeading}
                </p>
                <div className="flex-1 h-px" style={{ background: "#e8edf5" }} />
                <Link
                  href={active.href}
                  className="text-[10px] font-semibold flex items-center gap-1 whitespace-nowrap"
                  style={{ color: "#4ea85f" }}
                  onClick={onClose}
                >
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
                {active.subLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[12px] text-gray-500 py-1.5 transition-colors duration-150 hover:text-[#123f7a] flex items-center gap-1 group"
                    onClick={onClose}
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-200 group-hover:bg-[#4ea85f] transition-colors shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured card */}
            <Link
              href={active.featured.href}
              className="group shrink-0 w-[200px] rounded-xl overflow-hidden self-start"
              style={{
                background: "#0f2f5f",
                boxShadow: "0 4px 20px rgba(15,47,95,0.15)",
              }}
              onClick={onClose}
            >
              <div className="relative w-full h-[130px] overflow-hidden">
                <Image
                  src={active.featured.image}
                  alt={active.featured.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="200px"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(15,47,95,0.65) 100%)" }}
                />
                <span
                  className="absolute top-2 left-2 text-[8px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#4ea85f", color: "white" }}
                >
                  {active.featured.badge}
                </span>
              </div>
              <div className="p-3.5">
                <p className="text-[11px] font-bold text-white leading-snug mb-1.5">
                  {active.featured.title}
                </p>
                <p className="text-[10px] leading-snug mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {active.featured.desc}
                </p>
                <span
                  className="inline-flex items-center gap-1.5 text-[9px] font-bold px-3 py-1.5 rounded-full transition-all duration-200 group-hover:gap-2"
                  style={{ background: "#4ea85f", color: "white" }}
                >
                  Shop Now <ArrowRight className="h-2.5 w-2.5" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM — Best sellers */}
      <MegaMenuBestSellers onClose={onClose} />
    </div>
  );
}
