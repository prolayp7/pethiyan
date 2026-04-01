"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Check, Leaf, PackageCheck, Truck, ShieldCheck } from "lucide-react";

/* ─── Slide data ─────────────────────────────────────────────── */

const slides = [
  {
    id: 1,
    image: "/images/banners/1.jpg",
    tagline: "Premium Packaging Manufacturer",
    heading: ["Stand-Up Pouches That", "Elevate Your Brand"],
    description:
      "High-quality packaging designed for durability, shelf appeal, and lasting brand impact at every touchpoint.",
    primaryCta: { label: "Shop Packaging", href: "/shop" },
    secondaryCta: { label: "Request Bulk Quote", href: "/bulk" },
    features: ["Food Grade Materials", "Barrier Protection", "Bulk Orders"],
  },
  {
    id: 2,
    image: "/images/banners/2.jpg",
    tagline: "Eco Friendly Packaging",
    heading: ["Sustainable Packaging", "for a Greener Future"],
    description:
      "Eco-conscious materials designed to reduce environmental impact while protecting your products beautifully.",
    primaryCta: { label: "Explore Eco Packaging", href: "/categories/eco-packaging" },
    secondaryCta: { label: "Custom Packaging", href: "/categories/custom-packaging" },
    features: ["100% Recyclable", "Biodegradable Options", "Carbon Savings"],
  },
  {
    id: 3,
    image: "/images/banners/3.jpg",
    tagline: "Custom Printed Packaging",
    heading: ["Packaging That", "Builds Brand Identity"],
    description:
      "Custom printed pouches that transform ordinary packaging into powerful, shelf-stopping branding tools.",
    primaryCta: { label: "Start Custom Order", href: "/categories/custom-packaging" },
    secondaryCta: { label: "View Products", href: "/shop" },
    features: ["Full Colour Print", "Logo Ready", "7-Day Turnaround"],
  },
  {
    id: 4,
    image: "/images/banners/4.jpg",
    tagline: "Standup Pouch Specialists",
    heading: ["Retail Presence That", "Demands Attention"],
    description:
      "Resealable standup pouches engineered for maximum shelf visibility and product freshness — order ready.",
    primaryCta: { label: "Shop Pouches", href: "/categories/standup-pouches" },
    secondaryCta: { label: "Get Pricing", href: "/bulk" },
    features: ["Resealable Zipper", "50+ Sizes", "In-Stock Ready"],
  },
  {
    id: 5,
    image: "/images/banners/5.jpg",
    tagline: "Bulk & Wholesale Supply",
    heading: ["Scale Your Brand with", "Smarter Bulk Orders"],
    description:
      "Volume discounts up to 30% with guaranteed quality across every unit — from 500 to 50,000 pieces.",
    primaryCta: { label: "Get Bulk Pricing", href: "/bulk" },
    secondaryCta: { label: "Contact Sales", href: "/contact" },
    features: ["Volume Discounts", "Consistent Quality", "Dedicated Support"],
  },
  {
    id: 6,
    image: "/images/banners/6.jpg",
    tagline: "Ziplock Solutions",
    heading: ["Airtight Seals,", "Guaranteed Freshness"],
    description:
      "Heavy-duty ziplock bags trusted by food, pharma, and lifestyle brands worldwide for secure, long-lasting storage.",
    primaryCta: { label: "View Ziplock Range", href: "/categories/ziplock-pouches" },
    secondaryCta: { label: "Bulk Order", href: "/bulk" },
    features: ["Airtight Seal", "Food Safe", "Global Distribution"],
  },
];

/* ─── Trust badges (static) ─────────────────────────────────── */

const trustBadges = [
  { icon: ShieldCheck, label: "Food Safe Certified" },
  { icon: Leaf, label: "Eco Friendly" },
  { icon: PackageCheck, label: "Custom Printing" },
  { icon: Truck, label: "Fast Delivery" },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function HeroSection6() {
  const autoplay = Autoplay({ delay: 5000, stopOnInteraction: false });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 36 },
    [autoplay]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const slide = slides[activeIndex];

  return (
    <section
      className="relative w-full overflow-hidden bg-white"
      style={{ minHeight: "clamp(460px, 58vw, 580px)" }}
      aria-label="Hero carousel"
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.reset()}
    >
      <div
        className="relative flex flex-col lg:flex-row h-full"
        style={{ minHeight: "clamp(460px, 58vw, 580px)" }}
      >

        {/* ════════════════════════════════════════
            LEFT — Text Content Panel
        ════════════════════════════════════════ */}
        <div className="relative z-10 flex flex-col justify-between lg:w-[44%] px-7 sm:px-10 lg:px-12 xl:px-14 pt-10 pb-6 lg:py-10 order-2 lg:order-1 bg-white">

          {/* Top: tagline + heading + desc + features + CTAs */}
          <div className="flex flex-col flex-1 justify-center">

            {/* Tagline */}
            <div
              key={`tag-${activeIndex}`}
              className="inline-flex items-center gap-2 mb-4 animate-in fade-in-0 slide-in-from-top-2"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "#4caf50" }}
                aria-hidden="true"
              />
              <span
                className="text-[9px] font-bold tracking-[0.32em] uppercase"
                style={{ color: "#4caf50" }}
              >
                {slide.tagline}
              </span>
            </div>

            {/* Heading — line 2 in green */}
            <h1
              key={`heading-${activeIndex}`}
              className="font-extrabold leading-[1.08] tracking-tight mb-4 animate-in fade-in-0 slide-in-from-top-2"
              style={{
                fontSize: "clamp(1.75rem, 3.2vw, 2.8rem)",
                animationDelay: "50ms",
              }}
            >
              <span className="block" style={{ color: "#0f2f5f" }}>
                {slide.heading[0]}
              </span>
              <span className="block" style={{ color: "#4caf50" }}>
                {slide.heading[1]}
              </span>
            </h1>

            {/* Description */}
            <p
              key={`desc-${activeIndex}`}
              className="text-sm leading-relaxed mb-5 max-w-sm animate-in fade-in-0 slide-in-from-top-2"
              style={{
                color: "rgba(15,47,95,0.52)",
                animationDelay: "100ms",
              }}
            >
              {slide.description}
            </p>

            {/* Feature chips */}
            <div
              key={`feat-${activeIndex}`}
              className="flex flex-wrap gap-2 mb-6 animate-in fade-in-0 slide-in-from-top-2"
              style={{ animationDelay: "140ms" }}
            >
              {slide.features.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(76,175,80,0.08)",
                    color: "#388e3c",
                    border: "1px solid rgba(76,175,80,0.18)",
                  }}
                >
                  <Check className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                  {f}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div
              key={`cta-${activeIndex}`}
              className="flex flex-wrap items-center gap-3 animate-in fade-in-0 slide-in-from-top-2"
              style={{ animationDelay: "180ms" }}
            >
              <Link
                href={slide.primaryCta.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.03] active:scale-100"
                style={{
                  background: "#4caf50",
                  boxShadow: "0 6px 18px rgba(76,175,80,0.28)",
                }}
              >
                {slide.primaryCta.label}
              </Link>
              <Link
                href={slide.secondaryCta.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#0f2f5f] hover:text-white"
                style={{
                  border: "1.5px solid rgba(15,47,95,0.2)",
                  color: "#0f2f5f",
                }}
              >
                {slide.secondaryCta.label}
              </Link>
            </div>
          </div>

          {/* Bottom: trust badges + slide dots */}
          <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(15,47,95,0.07)" }}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="inline-flex items-center gap-1.5">
                  <Icon
                    className="h-3 w-3 shrink-0"
                    style={{ color: "#4caf50" }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[9px] font-semibold tracking-wide uppercase"
                    style={{ color: "rgba(15,47,95,0.4)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT — Image Carousel
        ════════════════════════════════════════ */}
        <div
          className="relative lg:w-[56%] order-1 lg:order-2"
          style={{ minHeight: "clamp(240px, 50vw, 580px)" }}
        >
          {/* Embla viewport */}
          <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
            <div className="flex h-full">
              {slides.map((s) => (
                <div
                  key={s.id}
                  className="relative flex-none w-full h-full"
                  aria-roledescription="slide"
                >
                  <Image
                    src={s.image}
                    alt={s.heading.join(" ")}
                    fill
                    className="object-cover"
                    priority={s.id === 1}
                    sizes="(max-width: 1024px) 100vw, 56vw"
                  />
                  {/* Bottom gradient for depth */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)",
                    }}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Diagonal bleed — overlays left edge to create angled divider on desktop */}
          <div
            className="hidden lg:block absolute inset-y-0 left-0 w-14 z-10 pointer-events-none"
            style={{
              background: "white",
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
            }}
            aria-hidden="true"
          />

          {/* Prev/Next arrows */}
          <button
            onClick={scrollPrev}
            aria-label="Previous slide"
            className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.82)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
              color: "#0f2f5f",
            }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.82)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
              color: "#0f2f5f",
            }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>

          {/* Pagination dots — bottom right */}
          <div
            className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5"
            role="tablist"
            aria-label="Slide indicators"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className="transition-all duration-400 rounded-full"
                style={{
                  height: 4,
                  width: i === activeIndex ? 20 : 4,
                  background:
                    i === activeIndex
                      ? "#4caf50"
                      : "rgba(255,255,255,0.55)",
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div
            className="absolute bottom-0 inset-x-0 h-[3px] z-20"
            style={{ background: "rgba(255,255,255,0.15)" }}
            aria-hidden="true"
          >
            <div
              key={activeIndex}
              className="h-full"
              style={{
                background: "#4caf50",
                animation: "progress-bar 5s linear forwards",
              }}
            />
          </div>
        </div>

      </div>

      {/* Bottom border */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "rgba(15,47,95,0.08)" }}
        aria-hidden="true"
      />
    </section>
  );
}
