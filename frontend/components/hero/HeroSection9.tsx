"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Leaf, PackageCheck, Truck } from "lucide-react";

/* ─── Slide data ─────────────────────────────────────────────── */

const slides = [
  {
    id: 1,
    image: "/images/banners/1.jpg",
    eyebrow: "Premium Packaging Excellence",
    headingWhite: "Packaging That Protects,",
    headingGradient: "Presents, and Performs",
    description:
      "Discover high-quality stand-up pouches and flexible packaging solutions designed to elevate your products and strengthen brand impact.",
    primaryCta: { label: "Explore Products", href: "/shop" },
    secondaryCta: { label: "Request Quote", href: "/contact" },
  },
  {
    id: 2,
    image: "/images/banners/2.jpg",
    eyebrow: "Sustainable Innovation",
    headingWhite: "Eco-Friendly Packaging",
    headingGradient: "for Modern Brands",
    description:
      "Reduce environmental impact with sustainable packaging solutions crafted for durability, presentation, and responsible growth.",
    primaryCta: { label: "Discover Eco Packaging", href: "/categories/eco-packaging" },
    secondaryCta: { label: "View Solutions", href: "/shop" },
  },
  {
    id: 3,
    image: "/images/banners/3.jpg",
    eyebrow: "Custom Brand Presence",
    headingWhite: "Custom Printed Packaging",
    headingGradient: "That Builds Recognition",
    description:
      "Transform ordinary packaging into a brand asset with premium custom printing designed to stand out on every shelf.",
    primaryCta: { label: "Start Custom Order", href: "/categories/custom-packaging" },
    secondaryCta: { label: "See Packaging Options", href: "/shop" },
  },
  {
    id: 4,
    image: "/images/banners/4.jpg",
    eyebrow: "Standup Pouch Specialists",
    headingWhite: "Retail Presence That",
    headingGradient: "Demands Attention",
    description:
      "Resealable standup pouches engineered for maximum shelf visibility, consistent freshness, and brand-first design.",
    primaryCta: { label: "Shop Pouches", href: "/categories/standup-pouches" },
    secondaryCta: { label: "Get Pricing", href: "/bulk" },
  },
  {
    id: 5,
    image: "/images/banners/5.jpg",
    eyebrow: "Bulk & Wholesale Supply",
    headingWhite: "Scale Your Business",
    headingGradient: "with Smarter Bulk Orders",
    description:
      "Volume discounts up to 30% with guaranteed quality on every unit — whether you order 500 or 50,000 pieces.",
    primaryCta: { label: "Get Bulk Pricing", href: "/bulk" },
    secondaryCta: { label: "Contact Sales", href: "/contact" },
  },
  {
    id: 6,
    image: "/images/banners/6.jpg",
    eyebrow: "Ziplock Solutions",
    headingWhite: "Airtight Seals,",
    headingGradient: "Guaranteed Freshness",
    description:
      "Heavy-duty ziplock bags built for food, pharma, and lifestyle brands that demand secure, long-lasting product integrity.",
    primaryCta: { label: "View Ziplock Range", href: "/categories/ziplock-pouches" },
    secondaryCta: { label: "Bulk Order", href: "/bulk" },
  },
];

/* ─── Trust badges ───────────────────────────────────────────── */

const trustBadges = [
  { icon: ShieldCheck, label: "Food Safe" },
  { icon: Leaf, label: "Eco Friendly" },
  { icon: PackageCheck, label: "Custom Print" },
  { icon: Truck, label: "Bulk Supply" },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function HeroSection9() {
  const autoplay = Autoplay({ delay: 5000, stopOnInteraction: false });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 42 },
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
      className="relative w-full overflow-hidden bg-[#050c1a]"
      style={{ minHeight: "clamp(600px, 75vw, 720px)" }}
      aria-label="Hero carousel"
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.reset()}
    >

      {/* ── Full-bleed image carousel ── */}
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
                alt={`${s.headingWhite} ${s.headingGradient}`}
                fill
                className="object-cover"
                priority={s.id === 1}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Cinematic overlay — deep blue-black from left, lifts right ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, rgba(5,12,26,0.95) 0%, rgba(5,12,26,0.82) 32%, rgba(5,12,26,0.48) 58%, rgba(5,12,26,0.12) 78%, transparent 90%)",
        }}
        aria-hidden="true"
      />
      {/* Subtle bottom vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(5,12,26,0.55) 0%, transparent 40%)",
        }}
        aria-hidden="true"
      />

      {/* ── Text content ── */}
      <div
        className="absolute inset-0 z-10 flex items-center"
        style={{ paddingRight: "3.5rem" }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-[600px]">

            {/* Eyebrow — left-border bracket style */}
            <div
              key={`eyebrow-${activeIndex}`}
              className="flex items-center mb-6 animate-in fade-in-0 slide-in-from-top-2"
              style={{
                borderLeft: "2px solid #4ea85f",
                paddingLeft: "12px",
              }}
            >
              <span
                className="text-[9px] font-bold tracking-[0.38em] uppercase"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {slide.eyebrow}
              </span>
            </div>

            {/* Heading — white line + gradient line */}
            <h1
              key={`heading-${activeIndex}`}
              className="font-extrabold tracking-tight mb-6 animate-in fade-in-0 slide-in-from-top-2"
              style={{
                fontSize: "clamp(2.6rem, 5.8vw, 5.2rem)",
                lineHeight: 1.06,
                animationDelay: "55ms",
              }}
            >
              <span className="block text-white">
                {slide.headingWhite}
              </span>
              <span
                className="block"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #2c4f88 0%, #2e7c8a 45%, #4ea85f 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {slide.headingGradient}
              </span>
            </h1>

            {/* Description — with subtle left accent */}
            <p
              key={`desc-${activeIndex}`}
              className="text-sm sm:text-base leading-relaxed mb-8 max-w-[440px] animate-in fade-in-0 slide-in-from-top-2"
              style={{
                color: "rgba(255,255,255,0.5)",
                animationDelay: "110ms",
                borderLeft: "1px solid rgba(255,255,255,0.1)",
                paddingLeft: "14px",
              }}
            >
              {slide.description}
            </p>

            {/* CTA row */}
            <div
              key={`cta-${activeIndex}`}
              className="flex flex-wrap items-center gap-3 mb-8 animate-in fade-in-0 slide-in-from-top-2"
              style={{ animationDelay: "165ms" }}
            >
              <Link
                href={slide.primaryCta.href}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.04] active:scale-100"
                style={{
                  background: "linear-gradient(135deg, #2e7c8a 0%, #4ea85f 100%)",
                  boxShadow: "0 8px 28px rgba(78,168,95,0.28)",
                }}
              >
                {slide.primaryCta.label}
                <span
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>

              <Link
                href={slide.secondaryCta.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-white/10"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                {slide.secondaryCta.label}
              </Link>
            </div>

            {/* Trust badges */}
            <div
              className="flex flex-wrap items-center gap-3 animate-in fade-in-0"
              style={{ animationDelay: "220ms" }}
            >
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Icon
                    className="h-3 w-3 shrink-0"
                    style={{ color: "#4ea85f" }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[9px] font-semibold tracking-wider uppercase"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          VERTICAL BAR INDICATORS — right edge (unique nav style)
      ════════════════════════════════════════════════════════ */}
      <div
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2"
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
            className="rounded-full transition-all duration-500"
            style={{
              width: 2,
              height: i === activeIndex ? 36 : 10,
              background:
                i === activeIndex
                  ? "#4ea85f"
                  : "rgba(255,255,255,0.22)",
              boxShadow:
                i === activeIndex
                  ? "0 0 10px rgba(78,168,95,0.5)"
                  : "none",
            }}
          />
        ))}
      </div>

      {/* ── Prev / Next arrows — bottom right ── */}
      <div className="absolute bottom-7 right-12 z-20 flex items-center gap-2">
        <button
          onClick={scrollPrev}
          aria-label="Previous slide"
          className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-110 active:scale-95"
          style={{
            borderColor: "rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          aria-label="Next slide"
          className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-110 active:scale-95"
          style={{
            borderColor: "rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>

      {/* ── Slide counter — bottom left ── */}
      <div className="absolute bottom-7 left-6 sm:left-10 lg:left-16 z-20">
        <span
          className="text-[9px] font-bold tabular-nums tracking-[0.25em]"
          style={{ color: "rgba(255,255,255,0.22)" }}
          aria-live="polite"
        >
          {String(activeIndex + 1).padStart(2, "0")}
          <span style={{ margin: "0 4px", color: "rgba(255,255,255,0.1)" }}>/</span>
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Progress bar — thicker, premium green ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-[4px] z-20"
        style={{ background: "rgba(255,255,255,0.07)" }}
        aria-hidden="true"
      >
        <div
          key={activeIndex}
          className="h-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, #2e7c8a, #4ea85f)",
            animation: "progress-bar 5s linear forwards",
          }}
        />
      </div>

    </section>
  );
}
