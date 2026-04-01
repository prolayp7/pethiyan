"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Slide data ─────────────────────────────────────────────── */

const slides = [
  {
    id: 1,
    image: "/images/banners/1.jpg",
    eyebrow: "Premium Quality",
    headingBlue: "Premium Packaging",
    headingGreen: "Solutions",
    description:
      "High-quality stand-up pouches and packaging designed to protect your products while elevating your brand identity.",
    cta: { label: "Explore Packaging", href: "/shop" },
  },
  {
    id: 2,
    image: "/images/banners/2.jpg",
    eyebrow: "Eco Friendly",
    headingBlue: "Sustainable Packaging for a",
    headingGreen: "Greener Future",
    description:
      "Eco-friendly materials that reduce environmental impact while maintaining durability, protection, and visual appeal.",
    cta: { label: "Discover Eco Packaging", href: "/categories/eco-packaging" },
  },
  {
    id: 3,
    image: "/images/banners/3.jpg",
    eyebrow: "Custom Branding",
    headingBlue: "Custom Packaging That",
    headingGreen: "Builds Your Brand",
    description:
      "Create packaging that reflects your brand identity with high-quality printing and fully customisable pouch designs.",
    cta: { label: "Start Custom Packaging", href: "/categories/custom-packaging" },
  },
  {
    id: 4,
    image: "/images/banners/4.jpg",
    eyebrow: "Standup Pouches",
    headingBlue: "Maximum Shelf Presence,",
    headingGreen: "Every Time",
    description:
      "Premium standup pouches with resealable zippers built for retail visibility and long-lasting product freshness.",
    cta: { label: "Shop Pouches", href: "/categories/standup-pouches" },
  },
  {
    id: 5,
    image: "/images/banners/5.jpg",
    eyebrow: "Bulk & Wholesale",
    headingBlue: "Scale Your Business with",
    headingGreen: "Smarter Bulk Orders",
    description:
      "Volume discounts up to 30% off with consistent quality guaranteed — whether you order 500 or 50,000 units.",
    cta: { label: "Get Bulk Pricing", href: "/bulk" },
  },
  {
    id: 6,
    image: "/images/banners/6.jpg",
    eyebrow: "Ziplock Solutions",
    headingBlue: "Airtight Seals,",
    headingGreen: "Guaranteed Freshness",
    description:
      "Heavy-duty ziplock bags trusted by food, pharma, and lifestyle brands worldwide to keep products safe and fresh.",
    cta: { label: "View Ziplock Range", href: "/categories/ziplock-pouches" },
  },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function HeroSection5() {
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
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(420px, 52vw, 520px)" }}
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
                alt={`${s.headingBlue} ${s.headingGreen}`}
                fill
                className="object-cover"
                priority={s.id === 1}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Left-to-center gradient overlay (light) for text readability ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(247,249,252,0.97) 0%, rgba(247,249,252,0.92) 30%, rgba(247,249,252,0.65) 52%, rgba(247,249,252,0.1) 70%, transparent 82%)",
        }}
        aria-hidden="true"
      />

      {/* ── Bottom gradient for depth ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(15,47,95,0.12) 0%, transparent 40%)",
        }}
        aria-hidden="true"
      />

      {/* ── Text content — left side, sits above image ── */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-xl">

            {/* Eyebrow */}
            <div
              key={`eyebrow-${activeIndex}`}
              className="inline-flex items-center gap-2 mb-5 animate-in fade-in-0 slide-in-from-top-2"
            >
              <span
                className="w-5 h-px shrink-0"
                style={{ background: "#4caf50" }}
                aria-hidden="true"
              />
              <span
                className="text-[10px] font-bold tracking-[0.32em] uppercase"
                style={{ color: "#4caf50" }}
              >
                {slide.eyebrow}
              </span>
            </div>

            {/* Heading — blue line + green line */}
            <h1
              key={`heading-${activeIndex}`}
              className="font-extrabold leading-[1.1] tracking-tight mb-4 animate-in fade-in-0 slide-in-from-top-2"
              style={{
                fontSize: "clamp(1.9rem, 3.8vw, 3.4rem)",
                animationDelay: "50ms",
              }}
            >
              <span className="block" style={{ color: "#0f2f5f" }}>
                {slide.headingBlue}
              </span>
              <span className="block" style={{ color: "#4caf50" }}>
                {slide.headingGreen}
              </span>
            </h1>

            {/* Description */}
            <p
              key={`desc-${activeIndex}`}
              className="text-sm sm:text-base leading-relaxed mb-7 max-w-sm animate-in fade-in-0 slide-in-from-top-2"
              style={{
                color: "rgba(15,47,95,0.55)",
                animationDelay: "100ms",
              }}
            >
              {slide.description}
            </p>

            {/* CTA */}
            <div
              key={`cta-${activeIndex}`}
              className="flex flex-wrap items-center gap-4 animate-in fade-in-0 slide-in-from-top-2"
              style={{ animationDelay: "150ms" }}
            >
              <Link
                href={slide.cta.href}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.03] active:scale-100"
                style={{
                  background: "#4caf50",
                  boxShadow: "0 6px 20px rgba(76,175,80,0.3)",
                }}
              >
                {slide.cta.label}
                <span
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold transition-colors duration-200 hover:underline underline-offset-4"
                style={{ color: "rgba(15,47,95,0.45)" }}
              >
                Request a Quote
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── Prev arrow ── */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: "rgba(255,255,255,0.82)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          color: "#0f2f5f",
        }}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* ── Next arrow ── */}
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: "rgba(255,255,255,0.82)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          color: "#0f2f5f",
        }}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* ── Pagination dots — bottom center ── */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5"
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
              height: 5,
              width: i === activeIndex ? 22 : 5,
              background:
                i === activeIndex
                  ? "#4caf50"
                  : "rgba(255,255,255,0.6)",
              boxShadow: i === activeIndex ? "0 0 8px rgba(76,175,80,0.5)" : "none",
            }}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
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

    </section>
  );
}
