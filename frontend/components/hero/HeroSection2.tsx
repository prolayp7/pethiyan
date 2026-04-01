"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";

/* ─── Slide data ─────────────────────────────────────────────── */

const slides = [
  {
    id: 1,
    image: "/images/banners/1.jpg",
    label: "Premium Quality",
    heading: ["Packaging That", "Speaks for", "Your Brand"],
    body: "High-quality materials engineered to protect your products and leave a lasting impression at every touchpoint.",
    cta: { label: "Explore Packaging", href: "/shop" },
    tag: "New Collection",
  },
  {
    id: 2,
    image: "/images/banners/2.jpg",
    label: "Eco Friendly",
    heading: ["Sustainable", "Packaging for a", "Better Future"],
    body: "Biodegradable and recyclable solutions that reduce your carbon footprint without compromising on quality or aesthetics.",
    cta: { label: "Discover Eco Line", href: "/categories/eco-packaging" },
    tag: "Green Range",
  },
  {
    id: 3,
    image: "/images/banners/3.jpg",
    label: "Custom Branding",
    heading: ["Your Identity,", "Perfectly", "Packaged"],
    body: "From logo to label — custom printed packaging designed to make your brand instantly recognisable on any shelf.",
    cta: { label: "Start Custom Order", href: "/categories/custom-packaging" },
    tag: "Bespoke",
  },
  {
    id: 4,
    image: "/images/banners/4.jpg",
    label: "Standup Pouches",
    heading: ["Stand Out", "on Every", "Retail Shelf"],
    body: "Premium standup pouches with resealable zippers — built for maximum shelf presence and long-lasting freshness.",
    cta: { label: "Shop Pouches", href: "/categories/standup-pouches" },
    tag: "Best Seller",
  },
  {
    id: 5,
    image: "/images/banners/5.jpg",
    label: "Bulk & Wholesale",
    heading: ["Scale Faster", "with Smarter", "Bulk Orders"],
    body: "Volume discounts up to 30% — consistent quality across every unit whether you order 500 or 50,000 pieces.",
    cta: { label: "Get Bulk Pricing", href: "/bulk" },
    tag: "Save More",
  },
  {
    id: 6,
    image: "/images/banners/6.jpg",
    label: "Ziplock Solutions",
    heading: ["Freshness Sealed,", "Quality", "Guaranteed"],
    body: "Heavy-duty ziplock bags with airtight seals, trusted by food, pharma, and lifestyle brands across the globe.",
    cta: { label: "View Ziplock Range", href: "/categories/ziplock-pouches" },
    tag: "Top Rated",
  },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function HeroSection2() {
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

  const current = slides[activeIndex];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#f7f9fc]"
      style={{ minHeight: "clamp(520px, 80vh, 900px)" }}
      aria-label="Hero carousel"
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.reset()}
    >

      {/* ── Two-column layout ── */}
      <div className="relative h-full flex flex-col lg:flex-row" style={{ minHeight: "clamp(520px, 80vh, 900px)" }}>

        {/* ════════════════════════════════════════
            LEFT — Text content panel
        ════════════════════════════════════════ */}
        <div className="relative z-10 flex flex-col justify-center lg:w-[48%] px-6 sm:px-10 lg:px-16 xl:px-20 py-16 lg:py-0 order-2 lg:order-1">

          {/* Slide index marker */}
          <div className="flex items-center gap-3 mb-8">
            <span
              className="text-[10px] font-black tabular-nums"
              style={{ color: "#1f4f8a" }}
            >
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    height: 3,
                    width: i === activeIndex ? 24 : 8,
                    background: i === activeIndex ? "#1f4f8a" : "rgba(31,79,138,0.2)",
                  }}
                />
              ))}
            </div>
            <span
              className="text-[10px] font-black tabular-nums"
              style={{ color: "rgba(31,79,138,0.3)" }}
            >
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* Label */}
          <div
            key={`label-${activeIndex}`}
            className="inline-flex items-center gap-2 mb-5 animate-in fade-in-0 slide-in-from-top-2"
          >
            <span
              className="text-[9px] font-bold tracking-[0.35em] uppercase px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(76,175,80,0.1)",
                color: "#4caf50",
                border: "1px solid rgba(76,175,80,0.2)",
              }}
            >
              {current.tag}
            </span>
            <span
              className="text-[10px] font-bold tracking-[0.25em] uppercase"
              style={{ color: "rgba(15,47,95,0.4)" }}
            >
              {current.label}
            </span>
          </div>

          {/* Heading */}
          <h1
            key={`heading-${activeIndex}`}
            className="font-extrabold leading-[1.0] tracking-tight mb-6 animate-in fade-in-0 slide-in-from-top-2"
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)",
              animationDelay: "50ms",
              color: "#0f2f5f",
            }}
          >
            {current.heading.map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? (
                  <em
                    className="not-italic"
                    style={{ color: "#4caf50" }}
                  >
                    {line}
                  </em>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          {/* Body */}
          <p
            key={`body-${activeIndex}`}
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-md animate-in fade-in-0 slide-in-from-top-2"
            style={{
              color: "rgba(15,47,95,0.55)",
              animationDelay: "100ms",
            }}
          >
            {current.body}
          </p>

          {/* CTAs */}
          <div
            key={`cta-${activeIndex}`}
            className="flex flex-wrap items-center gap-4 animate-in fade-in-0 slide-in-from-top-2"
            style={{ animationDelay: "150ms" }}
          >
            <Link
              href={current.cta.href}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:gap-3.5 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #1f4f8a 0%, #0f2f5f 100%)",
                boxShadow: "0 8px 24px rgba(31,79,138,0.3)",
              }}
            >
              {current.cta.label}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/contact"
              className="text-sm font-semibold transition-colors duration-200 hover:underline underline-offset-4"
              style={{ color: "rgba(31,79,138,0.5)" }}
            >
              Request a Quote
            </Link>
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-2 mt-14">
            <button
              onClick={scrollPrev}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 active:scale-95 hover:border-[#1f4f8a] hover:text-[#1f4f8a]"
              style={{
                borderColor: "rgba(31,79,138,0.2)",
                color: "rgba(31,79,138,0.4)",
              }}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 active:scale-95 hover:border-[#1f4f8a] hover:text-[#1f4f8a]"
              style={{
                borderColor: "rgba(31,79,138,0.2)",
                color: "rgba(31,79,138,0.4)",
              }}
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

        </div>

        {/* ════════════════════════════════════════
            RIGHT — Image carousel (full height)
        ════════════════════════════════════════ */}
        <div className="relative lg:w-[52%] order-1 lg:order-2" style={{ minHeight: "clamp(260px, 50vw, 900px)" }}>

          {/* Embla viewport */}
          <div ref={emblaRef} className="absolute inset-0 overflow-hidden lg:rounded-bl-[3rem]">
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
                    sizes="(max-width: 1024px) 100vw, 52vw"
                  />

                  {/* Subtle vignette */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)",
                    }}
                    aria-hidden="true"
                  />

                  {/* Left bleed — desktop only */}
                  <div
                    className="hidden lg:block absolute inset-y-0 left-0 w-20 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to right, #f7f9fc 0%, transparent 100%)",
                    }}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Floating tag on image */}
          <div className="absolute top-6 right-6 z-10">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.18em] uppercase backdrop-blur-sm"
              style={{
                background: "rgba(255,255,255,0.85)",
                color: "#0f2f5f",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#4caf50" }}
                aria-hidden="true"
              />
              {current.tag}
            </span>
          </div>

          {/* Progress bar on image bottom */}
          <div
            className="absolute bottom-0 inset-x-0 h-0.5 z-10"
            style={{ background: "rgba(255,255,255,0.2)" }}
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

      {/* Subtle bottom border */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "rgba(31,79,138,0.08)" }}
        aria-hidden="true"
      />

    </section>
  );
}
