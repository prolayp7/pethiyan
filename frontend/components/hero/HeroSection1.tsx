"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Slide data ─────────────────────────────────────────────── */

const slides = [
  {
    id: 1,
    image: "/images/banners/1.jpg",
    eyebrow: "Premium Quality",
    heading: "Packaging That\nElevates Your Brand",
    subheading:
      "High-quality materials engineered to protect your products and leave a lasting impression on every customer.",
    cta: { label: "Explore Packaging", href: "/shop" },
    accent: "#4caf50",
  },
  {
    id: 2,
    image: "/images/banners/2.jpg",
    eyebrow: "Eco Friendly",
    heading: "Sustainable Packaging\nfor a Better Future",
    subheading:
      "Biodegradable and recyclable materials that reduce your carbon footprint without compromising on durability.",
    cta: { label: "Discover Eco Line", href: "/categories/eco-packaging" },
    accent: "#4caf50",
  },
  {
    id: 3,
    image: "/images/banners/3.jpg",
    eyebrow: "Custom Branding",
    heading: "Your Brand,\nPerfectly Packaged",
    subheading:
      "Custom printed pouches and bags designed specifically for your brand identity — from concept to courier.",
    cta: { label: "Start Custom Order", href: "/categories/custom-packaging" },
    accent: "#4caf50",
  },
  {
    id: 4,
    image: "/images/banners/4.jpg",
    eyebrow: "Standup Pouches",
    heading: "Stand Out\non Every Shelf",
    subheading:
      "Premium standup pouches with resealable zippers — built for retail visibility and maximum product freshness.",
    cta: { label: "Shop Pouches", href: "/categories/standup-pouches" },
    accent: "#4caf50",
  },
  {
    id: 5,
    image: "/images/banners/5.jpg",
    eyebrow: "Bulk & Wholesale",
    heading: "Scale Faster\nwith Bulk Orders",
    subheading:
      "Volume discounts up to 30% off. Consistent quality across every unit — whether you order 500 or 50,000.",
    cta: { label: "Get Bulk Pricing", href: "/bulk" },
    accent: "#4caf50",
  },
  {
    id: 6,
    image: "/images/banners/6.jpg",
    eyebrow: "Ziplock Solutions",
    heading: "Freshness Sealed,\nQuality Guaranteed",
    subheading:
      "Heavy-duty ziplock bags with airtight seals. Trusted by food, pharma, and lifestyle brands worldwide.",
    cta: { label: "View Ziplock Range", href: "/categories/ziplock-pouches" },
    accent: "#4caf50",
  },
];

/* ─── Dot indicator ──────────────────────────────────────────── */

function Dots({
  count,
  active,
  onDotClick,
}: {
  count: number;
  active: number;
  onDotClick: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === active}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onDotClick(i)}
          className="relative h-0.5 transition-all duration-400 rounded-full overflow-hidden"
          style={{
            width: i === active ? 28 : 12,
            background:
              i === active
                ? "rgba(255,255,255,0.9)"
                : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────── */

export default function HeroSection1() {
  const autoplay = Autoplay({ delay: 5000, stopOnInteraction: false });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 40 },
    [autoplay]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const slide = slides[activeIndex];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#050810]"
      style={{ minHeight: "clamp(480px, 78vh, 860px)" }}
      aria-label="Hero carousel"
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.reset()}
    >
      {/* ── Embla viewport ── */}
      <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
        <div className="flex h-full">
          {slides.map((s) => (
            <div
              key={s.id}
              className="relative flex-none w-full h-full"
              aria-roledescription="slide"
            >
              {/* Banner image — full bleed right half on desktop */}
              <div className="absolute inset-0 lg:left-[48%]">
                <Image
                  src={s.image}
                  alt={s.heading.replace("\n", " ")}
                  fill
                  className="object-cover"
                  priority={s.id === 1}
                  sizes="(max-width: 1024px) 100vw, 52vw"
                />
                {/* Dark overlay on mobile (image is behind text) */}
                <div
                  className="absolute inset-0 lg:hidden"
                  style={{ background: "rgba(5,8,16,0.65)" }}
                  aria-hidden="true"
                />
              </div>

              {/* Gradient bleed — desktop: fades image into left panel */}
              <div
                className="hidden lg:block absolute inset-y-0 left-[48%] w-32 z-10 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to right, #050810 0%, transparent 100%)",
                }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Left content panel — sits above the image track ── */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16">
          <div className="max-w-xl lg:max-w-2xl py-24 lg:py-0" style={{ minHeight: "clamp(480px, 78vh, 860px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>

            {/* Eyebrow */}
            <div
              key={`eyebrow-${activeIndex}`}
              className="inline-flex items-center gap-2 mb-6 animate-in fade-in-0 slide-in-from-top-2"
            >
              <span
                className="h-px w-6 shrink-0"
                style={{ background: "#4caf50" }}
                aria-hidden="true"
              />
              <span
                className="text-[10px] font-bold tracking-[0.35em] uppercase"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {slide.eyebrow}
              </span>
            </div>

            {/* Heading */}
            <h1
              key={`heading-${activeIndex}`}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.02] tracking-tight text-white mb-6 animate-in fade-in-0 slide-in-from-top-2"
              style={{ animationDelay: "60ms" }}
            >
              {slide.heading.split("\n").map((line, i) => (
                <span key={i}>
                  {i === 1 ? (
                    <span style={{ color: "#4caf50" }}>{line}</span>
                  ) : (
                    line
                  )}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>

            {/* Subheading */}
            <p
              key={`sub-${activeIndex}`}
              className="text-base sm:text-lg leading-relaxed mb-10 max-w-md animate-in fade-in-0 slide-in-from-top-2"
              style={{
                color: "rgba(255,255,255,0.5)",
                animationDelay: "120ms",
              }}
            >
              {slide.subheading}
            </p>

            {/* CTA */}
            <div
              key={`cta-${activeIndex}`}
              className="flex items-center gap-4 animate-in fade-in-0 slide-in-from-top-2"
              style={{ animationDelay: "180ms" }}
            >
              <Link
                href={slide.cta.href}
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-bold text-[#050810] transition-all duration-300 hover:gap-4 hover:shadow-lg"
                style={{
                  background: "#4caf50",
                  boxShadow: "0 0 24px rgba(76,175,80,0.3)",
                }}
              >
                {slide.cta.label}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/contact"
                className="text-sm font-medium transition-colors duration-200 hover:text-white"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Request a Quote →
              </Link>
            </div>

            {/* Slide counter + dots */}
            <div className="flex items-center gap-6 mt-14">
              <span
                className="text-[10px] font-bold tabular-nums tracking-[0.2em]"
                style={{ color: "rgba(255,255,255,0.2)" }}
                aria-live="polite"
              >
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(slides.length).padStart(2, "0")}
              </span>
              <Dots
                count={slides.length}
                active={activeIndex}
                onDotClick={scrollTo}
              />
            </div>

          </div>
        </div>
      </div>

      {/* ── Arrow controls ── */}
      <div className="absolute bottom-8 right-6 sm:right-10 lg:right-16 z-30 flex items-center gap-2">
        <button
          onClick={scrollPrev}
          aria-label="Previous slide"
          className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-110 active:scale-95"
          style={{
            borderColor: "rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          onClick={scrollNext}
          aria-label="Next slide"
          className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-110 active:scale-95"
          style={{
            borderColor: "rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* ── Progress bar — shows time until next slide ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-px z-30"
        style={{ background: "rgba(255,255,255,0.06)" }}
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
