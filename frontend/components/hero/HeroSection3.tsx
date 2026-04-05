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
    eyebrow: "Premium Quality",
    heading: ["Premium", "Packaging", "Solutions"],
    subheading:
      "High-quality materials engineered to protect your products and elevate your brand identity at every touchpoint.",
    cta: { label: "Explore Packaging", href: "/shop" },
    stats: [
      { value: "500+", label: "Brand Partners" },
      { value: "10M+", label: "Units Shipped" },
    ],
  },
  {
    id: 2,
    image: "/images/banners/2.jpg",
    eyebrow: "Eco Friendly",
    heading: ["Sustainable", "Packaging for", "the Planet"],
    subheading:
      "Eco-conscious materials that reduce environmental impact while maintaining strength and durability.",
    cta: { label: "Discover Eco Packaging", href: "/categories/eco-packaging" },
    stats: [
      { value: "100%", label: "Recyclable" },
      { value: "40%", label: "Carbon Savings" },
    ],
  },
  {
    id: 3,
    image: "/images/banners/3.jpg",
    eyebrow: "Custom Branding",
    heading: ["Custom Printed", "Packaging for", "Modern Brands"],
    subheading:
      "Create packaging that reflects your brand personality and stands out on every shelf.",
    cta: { label: "Start Custom Packaging", href: "/categories/custom-packaging" },
    stats: [
      { value: "7 Days", label: "Turnaround" },
      { value: "1,000+", label: "Designs Made" },
    ],
  },
  {
    id: 4,
    image: "/images/banners/4.jpg",
    eyebrow: "Standup Pouches",
    heading: ["Stand Out", "on Every", "Retail Shelf"],
    subheading:
      "Premium standup pouches with resealable zippers — built for retail visibility and maximum product freshness.",
    cta: { label: "Shop Pouches", href: "/categories/standup-pouches" },
    stats: [
      { value: "99%", label: "Seal Success Rate" },
      { value: "50+", label: "Sizes Available" },
    ],
  },
  {
    id: 5,
    image: "/images/banners/5.jpg",
    eyebrow: "Bulk & Wholesale",
    heading: ["Scale Faster", "with Smarter", "Bulk Orders"],
    subheading:
      "Volume discounts up to 30% off. Consistent quality across every unit — whether you order 500 or 50,000.",
    cta: { label: "Get Bulk Pricing", href: "/bulk" },
    stats: [
      { value: "30%", label: "Volume Discount" },
      { value: "50K+", label: "Max Order Size" },
    ],
  },
  {
    id: 6,
    image: "/images/banners/6.jpg",
    eyebrow: "Ziplock Solutions",
    heading: ["Freshness", "Sealed, Quality", "Guaranteed"],
    subheading:
      "Heavy-duty ziplock bags with airtight seals trusted by food, pharma, and lifestyle brands worldwide.",
    cta: { label: "View Ziplock Range", href: "/categories/ziplock-pouches" },
    stats: [
      { value: "#1", label: "Rated Ziplock" },
      { value: "Global", label: "Distribution" },
    ],
  },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function HeroSection3() {
  const autoplay = Autoplay({ delay: 5000, stopOnInteraction: false });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 38 },
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
      style={{ minHeight: "clamp(560px, 80vh, 920px)" }}
      aria-label="Hero carousel"
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.reset()}
    >
      <div
        className="relative h-full flex flex-col lg:flex-row"
        style={{ minHeight: "clamp(560px, 80vh, 920px)" }}
      >

        {/* ════════════════════════════════════════
            LEFT — Dark navy text content panel
        ════════════════════════════════════════ */}
        <div
          className="relative z-10 flex flex-col justify-center lg:w-[45%] px-8 sm:px-12 lg:px-14 xl:px-18 py-20 lg:py-0 order-2 lg:order-1 overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #07111f 0%, #0e1e35 55%, #162840 100%)",
          }}
        >
          {/* Decorative large background number */}
          <div
            className="absolute pointer-events-none select-none"
            aria-hidden="true"
            style={{
              fontSize: "clamp(10rem, 20vw, 20rem)",
              fontWeight: 900,
              lineHeight: 1,
              color: "rgba(255,255,255,0.028)",
              letterSpacing: "-0.06em",
              right: "-1.5rem",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {String(activeIndex + 1).padStart(2, "0")}
          </div>

          {/* Left green accent edge line */}
          <div
            className="absolute left-0 top-12 bottom-12 w-[3px] rounded-r-full"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, #4caf50 30%, #4caf50 70%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {/* Slide counter + dot indicators */}
          <div className="flex items-center gap-3 mb-8">
            <span
              className="text-[10px] font-bold tabular-nums tracking-widest"
              style={{ color: "#4caf50" }}
            >
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="transition-all duration-500 rounded-full"
                  style={{
                    height: 2,
                    width: i === activeIndex ? 28 : 8,
                    background:
                      i === activeIndex ? "#4caf50" : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>
            <span
              className="text-[10px] font-bold tabular-nums tracking-widest"
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* Eyebrow */}
          <div
            key={`eyebrow-${activeIndex}`}
            className="inline-flex items-center gap-2 mb-5 animate-in fade-in-0 slide-in-from-top-2"
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "#4caf50" }}
              aria-hidden="true"
            />
            <span
              className="text-[10px] font-bold tracking-[0.35em] uppercase"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {slide.eyebrow}
            </span>
          </div>

          {/* Heading — first line in green accent */}
          <h1
            key={`heading-${activeIndex}`}
            className="font-extrabold leading-[1.06] tracking-tight text-white mb-6 animate-in fade-in-0 slide-in-from-top-2"
            style={{
              fontSize: "clamp(2.4rem, 4.8vw, 4.2rem)",
              animationDelay: "60ms",
            }}
          >
            {slide.heading.map((line, i) => (
              <span key={i} className="block">
                {i === 0 ? (
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
            className="text-sm sm:text-base leading-relaxed mb-8 max-w-sm animate-in fade-in-0 slide-in-from-top-2"
            style={{
              color: "rgba(255,255,255,0.42)",
              animationDelay: "120ms",
            }}
          >
            {slide.subheading}
          </p>

          {/* CTA buttons */}
          <div
            key={`cta-${activeIndex}`}
            className="flex flex-wrap items-center gap-4 mb-10 animate-in fade-in-0 slide-in-from-top-2"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              href={slide.cta.href}
              className="btn-brand group inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:gap-4 hover:shadow-xl"
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
              style={{ color: "rgba(255,255,255,0.32)" }}
            >
              Request a Quote →
            </Link>
          </div>

          {/* Stats */}
          <div
            key={`stats-${activeIndex}`}
            className="flex items-center gap-8 animate-in fade-in-0 slide-in-from-top-2"
            style={{ animationDelay: "240ms" }}
          >
            {slide.stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span
                  className="text-xl font-black"
                  style={{ color: "#4caf50" }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-[9px] font-semibold tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
            {/* Divider between stats */}
            <div
              className="w-px self-stretch"
              style={{ background: "rgba(255,255,255,0.08)" }}
              aria-hidden="true"
            />
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-2 mt-12">
            <button
              onClick={scrollPrev}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:border-[#4caf50] hover:text-[#4caf50] hover:scale-110 active:scale-95"
              style={{
                borderColor: "rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:border-[#4caf50] hover:text-[#4caf50] hover:scale-110 active:scale-95"
              style={{
                borderColor: "rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT — Image carousel panel
        ════════════════════════════════════════ */}
        <div
          className="relative lg:w-[55%] order-1 lg:order-2"
          style={{ minHeight: "clamp(280px, 52vw, 920px)" }}
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
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />

                  {/* Dark gradient overlay — bottom fade for depth */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 35%, rgba(0,0,0,0.28) 100%)",
                    }}
                    aria-hidden="true"
                  />

                  {/* Left bleed — blends into dark left panel on desktop */}
                  <div
                    className="hidden lg:block absolute inset-y-0 left-0 w-28 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to right, #162840 0%, transparent 100%)",
                    }}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Floating category tag — top right */}
          <div className="absolute top-6 right-6 z-10">
            <span
              key={`tag-${activeIndex}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm animate-in fade-in-0"
              style={{
                background: "rgba(7,17,31,0.78)",
                color: "#4caf50",
                border: "1px solid rgba(76,175,80,0.28)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#4caf50" }}
                aria-hidden="true"
              />
              {slide.eyebrow}
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="absolute bottom-0 inset-x-0 h-0.5 z-10"
            style={{ background: "rgba(255,255,255,0.1)" }}
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
        style={{ background: "rgba(76,175,80,0.12)" }}
        aria-hidden="true"
      />
    </section>
  );
}
