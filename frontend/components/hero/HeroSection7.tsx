"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

/* ─── Slide data ─────────────────────────────────────────────── */

const slides = [
  {
    id: 1,
    image: "/images/banners/1.jpg",
    tagline: "Premium Packaging Manufacturer",
    heading: "High Quality\nStand-Up Pouches",
    description:
      "Durable and visually striking packaging designed to protect your products while enhancing shelf appeal at every retail touchpoint.",
    cta: { label: "Explore Packaging", href: "/shop" },
  },
  {
    id: 2,
    image: "/images/banners/2.jpg",
    tagline: "Sustainable Packaging",
    heading: "Eco Friendly\nPackaging Solutions",
    description:
      "Sustainable packaging materials that reduce environmental impact while maintaining strength, durability, and premium aesthetics.",
    cta: { label: "Discover Eco Packaging", href: "/categories/eco-packaging" },
  },
  {
    id: 3,
    image: "/images/banners/3.jpg",
    tagline: "Custom Printed Pouches",
    heading: "Packaging That\nBuilds Your Brand",
    description:
      "Create packaging that reflects your brand identity with high-quality custom printing and fully configurable pouch designs.",
    cta: { label: "Start Custom Packaging", href: "/categories/custom-packaging" },
  },
  {
    id: 4,
    image: "/images/banners/4.jpg",
    tagline: "Standup Pouch Specialists",
    heading: "Retail-Ready Pouches\nThat Demand Attention",
    description:
      "Resealable standup pouches engineered for maximum shelf presence and long-lasting product freshness.",
    cta: { label: "Shop Pouches", href: "/categories/standup-pouches" },
  },
  {
    id: 5,
    image: "/images/banners/5.jpg",
    tagline: "Bulk & Wholesale Supply",
    heading: "Scale Your Business\nwith Bulk Orders",
    description:
      "Volume discounts up to 30% with guaranteed quality consistency — whether you order 500 or 50,000 units.",
    cta: { label: "Get Bulk Pricing", href: "/bulk" },
  },
  {
    id: 6,
    image: "/images/banners/6.jpg",
    tagline: "Ziplock Solutions",
    heading: "Airtight Seals,\nGuaranteed Freshness",
    description:
      "Heavy-duty ziplock bags trusted by food, pharma, and lifestyle brands worldwide for secure, long-lasting storage.",
    cta: { label: "View Ziplock Range", href: "/categories/ziplock-pouches" },
  },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function HeroSection7() {
  const autoplay = Autoplay({ delay: 5000, stopOnInteraction: false });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 40 },
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
      style={{ height: "clamp(520px, 68vw, 640px)" }}
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
                alt={s.heading.replace("\n", " ")}
                fill
                className="object-cover"
                priority={s.id === 1}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Directional dark overlay — deeper on left, lifts on right ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(5,8,20,0.84) 0%, rgba(5,8,20,0.68) 38%, rgba(5,8,20,0.32) 62%, rgba(5,8,20,0.06) 82%, transparent 92%)",
        }}
        aria-hidden="true"
      />
      {/* Bottom dark vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(5,8,20,0.5) 0%, transparent 45%)",
        }}
        aria-hidden="true"
      />

      {/* ── Text content ── */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-[520px]">

            {/* Tagline */}
            <div
              key={`tagline-${activeIndex}`}
              className="flex items-center gap-2.5 mb-5 animate-in fade-in-0 slide-in-from-top-2"
            >
              <span
                className="inline-block w-6 h-[2px] rounded-full"
                style={{ background: "#4caf50" }}
                aria-hidden="true"
              />
              <span
                className="text-[10px] font-bold tracking-[0.3em] uppercase"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {slide.tagline}
              </span>
            </div>

            {/* Heading — blue-white → green gradient text */}
            <h1
              key={`heading-${activeIndex}`}
              className="font-extrabold leading-[1.08] tracking-tight mb-5 animate-in fade-in-0 slide-in-from-top-2"
              style={{
                fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                backgroundImage:
                  "linear-gradient(to bottom right, #ffffff 0%, #93c5fd 45%, #4caf50 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animationDelay: "55ms",
              }}
            >
              {slide.heading.split("\n").map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>

            {/* Description */}
            <p
              key={`desc-${activeIndex}`}
              className="text-sm sm:text-base leading-relaxed mb-8 animate-in fade-in-0 slide-in-from-top-2"
              style={{
                color: "rgba(255,255,255,0.58)",
                animationDelay: "110ms",
              }}
            >
              {slide.description}
            </p>

            {/* CTA */}
            <div
              key={`cta-${activeIndex}`}
              className="flex flex-wrap items-center gap-4 animate-in fade-in-0 slide-in-from-top-2"
              style={{ animationDelay: "165ms" }}
            >
              <Link
                href={slide.cta.href}
                className="btn-brand group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold transition-all duration-300 hover:gap-3.5 hover:shadow-xl hover:scale-[1.03] active:scale-100"
              >
                {slide.cta.label}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium transition-all duration-200 hover:text-white"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                Request a Quote →
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom controls bar: counter | dots | arrows ── */}
      <div className="absolute bottom-6 inset-x-0 z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">

        {/* Slide counter */}
        <span
          className="text-[10px] font-bold tabular-nums tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.28)" }}
          aria-live="polite"
        >
          {String(activeIndex + 1).padStart(2, "0")}{" "}
          <span style={{ color: "rgba(255,255,255,0.14)" }}>/</span>{" "}
          {String(slides.length).padStart(2, "0")}
        </span>

        {/* Pagination dots — center */}
        <div
          className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2"
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
                height: 3,
                width: i === activeIndex ? 24 : 6,
                background:
                  i === activeIndex
                    ? "#4caf50"
                    : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>

        {/* Prev / Next arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollPrev}
            aria-label="Previous slide"
            className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 hover:border-[#4caf50] hover:text-[#4caf50] hover:scale-110 active:scale-95"
            style={{
              borderColor: "rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next slide"
            className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 hover:border-[#4caf50] hover:text-[#4caf50] hover:scale-110 active:scale-95"
            style={{
              borderColor: "rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-[3px] z-20"
        style={{ background: "rgba(255,255,255,0.08)" }}
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
