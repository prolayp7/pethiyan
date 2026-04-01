"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/* ─── Slide data ─────────────────────────────────────────────── */

const slides = [
  {
    id: 1,
    image: "/images/banners/1.jpg",
    eyebrow: "Premium Quality",
    heading: ["Premium", "Packaging", "Solutions"],
    subheading:
      "High-quality packaging designed to protect products and elevate your brand presentation at every touchpoint.",
    cta: { label: "Explore Packaging", href: "/shop" },
  },
  {
    id: 2,
    image: "/images/banners/2.jpg",
    eyebrow: "Eco Friendly",
    heading: ["Sustainable", "Packaging for a", "Greener Future"],
    subheading:
      "Eco-friendly materials that reduce environmental impact while maintaining strength, durability, and visual appeal.",
    cta: { label: "Discover Eco Packaging", href: "/categories/eco-packaging" },
  },
  {
    id: 3,
    image: "/images/banners/3.jpg",
    eyebrow: "Custom Branding",
    heading: ["Custom Packaging", "That Builds", "Your Brand"],
    subheading:
      "Stand out with fully customised packaging designed to reflect your brand identity on every shelf.",
    cta: { label: "Start Custom Packaging", href: "/categories/custom-packaging" },
  },
  {
    id: 4,
    image: "/images/banners/4.jpg",
    eyebrow: "Standup Pouches",
    heading: ["Retail-Ready", "Pouches Built", "to Impress"],
    subheading:
      "Premium standup pouches with resealable zippers engineered for maximum shelf presence and lasting freshness.",
    cta: { label: "Shop Pouches", href: "/categories/standup-pouches" },
  },
  {
    id: 5,
    image: "/images/banners/5.jpg",
    eyebrow: "Bulk & Wholesale",
    heading: ["Volume Orders,", "Unbeatable", "Value"],
    subheading:
      "Up to 30% volume discounts with guaranteed consistency — whether you order 500 or 50,000 units.",
    cta: { label: "Get Bulk Pricing", href: "/bulk" },
  },
  {
    id: 6,
    image: "/images/banners/6.jpg",
    eyebrow: "Ziplock Solutions",
    heading: ["Airtight Seals,", "Guaranteed", "Freshness"],
    subheading:
      "Heavy-duty ziplock bags trusted by food, pharma, and lifestyle brands to keep products fresh and secure.",
    cta: { label: "View Ziplock Range", href: "/categories/ziplock-pouches" },
  },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function HeroSection4() {
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

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const slide = slides[activeIndex];

  return (
    <section
      className="relative w-full bg-white overflow-hidden"
      style={{ minHeight: "clamp(580px, 82vh, 960px)" }}
      aria-label="Hero carousel"
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.reset()}
    >
      <div
        className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 h-full flex flex-col lg:flex-row items-center gap-10 lg:gap-0"
        style={{ minHeight: "clamp(580px, 82vh, 960px)" }}
      >

        {/* ════════════════════════════════════════
            LEFT — Text content
        ════════════════════════════════════════ */}
        <div className="relative z-10 flex flex-col justify-center lg:w-[48%] lg:pr-12 xl:pr-16 py-14 lg:py-0 order-2 lg:order-1 w-full">

          {/* Eyebrow */}
          <div
            key={`eyebrow-${activeIndex}`}
            className="inline-flex items-center gap-2 mb-6 animate-in fade-in-0 slide-in-from-top-2"
          >
            <span
              className="text-[10px] font-bold tracking-[0.32em] uppercase px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(31,79,138,0.07)",
                color: "#1f4f8a",
                border: "1px solid rgba(31,79,138,0.12)",
              }}
            >
              {slide.eyebrow}
            </span>
          </div>

          {/* Heading — last line in green accent */}
          <h1
            key={`heading-${activeIndex}`}
            className="font-extrabold leading-[1.06] tracking-tight mb-6 animate-in fade-in-0 slide-in-from-top-2"
            style={{
              fontSize: "clamp(2.6rem, 5vw, 4.4rem)",
              color: "#0f2f5f",
              animationDelay: "60ms",
            }}
          >
            {slide.heading.map((line, i) => (
              <span key={i} className="block">
                {i === slide.heading.length - 1 ? (
                  <span style={{ color: "#4caf50" }}>{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          {/* Subheading */}
          <p
            key={`sub-${activeIndex}`}
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-[420px] animate-in fade-in-0 slide-in-from-top-2"
            style={{
              color: "#6b7280",
              animationDelay: "120ms",
            }}
          >
            {slide.subheading}
          </p>

          {/* CTAs */}
          <div
            key={`cta-${activeIndex}`}
            className="flex flex-wrap items-center gap-4 mb-10 animate-in fade-in-0 slide-in-from-top-2"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              href={slide.cta.href}
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:gap-3 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #1f4f8a 0%, #0f2f5f 100%)",
                boxShadow: "0 8px 24px rgba(31,79,138,0.28)",
              }}
            >
              {slide.cta.label}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold transition-colors duration-200 hover:underline underline-offset-4"
              style={{ color: "rgba(15,47,95,0.45)" }}
            >
              Request a Quote
            </Link>
          </div>

          {/* Thumbnail navigation */}
          <div
            className="flex items-center gap-2.5 animate-in fade-in-0"
            style={{ animationDelay: "240ms" }}
            role="tablist"
            aria-label="Slide navigation"
          >
            {slides.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className="relative overflow-hidden rounded-lg transition-all duration-400 shrink-0"
                style={{
                  width: 52,
                  height: 38,
                  outline: i === activeIndex ? "2px solid #4caf50" : "2px solid transparent",
                  outlineOffset: 2,
                  opacity: i === activeIndex ? 1 : 0.38,
                  transform: i === activeIndex ? "scale(1.1)" : "scale(1)",
                }}
              >
                <Image
                  src={s.image}
                  alt={`Slide ${i + 1} thumbnail`}
                  fill
                  className="object-cover"
                  sizes="52px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT — Image carousel
        ════════════════════════════════════════ */}
        <div
          className="relative lg:w-[52%] w-full order-1 lg:order-2 shrink-0"
          style={{ minHeight: "clamp(260px, 52vw, 760px)" }}
        >
          {/* Embla viewport — fills the rounded card */}
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              minHeight: "clamp(260px, 52vw, 760px)",
              borderRadius: "1.5rem",
              boxShadow:
                "0 24px 64px rgba(15,47,95,0.13), 0 4px 16px rgba(15,47,95,0.07)",
            }}
          >
            <div ref={emblaRef} className="absolute inset-0 overflow-hidden rounded-[1.5rem]">
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
                    {/* Bottom gradient for depth */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, transparent 40%, rgba(0,0,0,0.18) 100%)",
                      }}
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar at image bottom */}
            <div
              className="absolute bottom-0 inset-x-0 h-0.5 z-10 rounded-b-[1.5rem]"
              style={{ background: "rgba(255,255,255,0.18)" }}
              aria-hidden="true"
            >
              <div
                key={activeIndex}
                className="h-full rounded-full"
                style={{
                  background: "#4caf50",
                  animation: "progress-bar 5s linear forwards",
                }}
              />
            </div>

            {/* Slide counter chip — bottom left of image */}
            <div className="absolute bottom-4 left-4 z-10">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tabular-nums backdrop-blur-sm"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                {String(activeIndex + 1).padStart(2, "0")}
                <span style={{ color: "rgba(255,255,255,0.45)" }}>
                  / {String(slides.length).padStart(2, "0")}
                </span>
              </span>
            </div>
          </div>

          {/* Decorative dot — behind the card, top-right */}
          <div
            className="absolute -top-4 -right-4 w-24 h-24 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(76,175,80,0.14) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          {/* Decorative dot — behind card, bottom-left */}
          <div
            className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(31,79,138,0.1) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
        </div>

      </div>

      {/* Subtle bottom border */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "rgba(31,79,138,0.07)" }}
        aria-hidden="true"
      />
    </section>
  );
}
