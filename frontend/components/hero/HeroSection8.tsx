"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Leaf, PackageCheck, Truck } from "lucide-react";

/* ─── Slide data ─────────────────────────────────────────────── */

const slides = [
  {
    id: 1,
    image: "/images/banners/1.jpg",
    tagline: "Premium Packaging Manufacturer",
    heading: "Stand-Up Pouches That\nElevate Your Brand",
    description:
      "High-quality packaging designed to protect your products while creating powerful shelf appeal.",
    primaryCta: { label: "Explore Packaging", href: "/shop" },
    secondaryCta: { label: "Request Bulk Quote", href: "/bulk" },
  },
  {
    id: 2,
    image: "/images/banners/2.jpg",
    tagline: "Sustainable Packaging",
    heading: "Eco-Friendly Packaging\nSolutions",
    description:
      "Sustainable materials designed to reduce environmental impact while maintaining strength and durability.",
    primaryCta: { label: "Explore Eco Packaging", href: "/categories/eco-packaging" },
    secondaryCta: { label: "Custom Packaging", href: "/categories/custom-packaging" },
  },
  {
    id: 3,
    image: "/images/banners/3.jpg",
    tagline: "Custom Printed Pouches",
    heading: "Packaging That\nBuilds Brand Identity",
    description:
      "Custom printed packaging designed to showcase your brand and create unforgettable customer experiences.",
    primaryCta: { label: "Start Custom Order", href: "/categories/custom-packaging" },
    secondaryCta: { label: "View Products", href: "/shop" },
  },
  {
    id: 4,
    image: "/images/banners/4.jpg",
    tagline: "Standup Pouch Specialists",
    heading: "Maximum Shelf Presence\nEvery Time",
    description:
      "Resealable standup pouches engineered for retail visibility and long-lasting product freshness.",
    primaryCta: { label: "Shop Pouches", href: "/categories/standup-pouches" },
    secondaryCta: { label: "Get Pricing", href: "/bulk" },
  },
  {
    id: 5,
    image: "/images/banners/5.jpg",
    tagline: "Bulk & Wholesale Supply",
    heading: "Scale Faster with\nSmarter Bulk Orders",
    description:
      "Volume discounts up to 30% with consistent quality guaranteed — 500 to 50,000 units.",
    primaryCta: { label: "Get Bulk Pricing", href: "/bulk" },
    secondaryCta: { label: "Contact Sales", href: "/contact" },
  },
  {
    id: 6,
    image: "/images/banners/6.jpg",
    tagline: "Ziplock Solutions",
    heading: "Airtight Seals,\nGuaranteed Freshness",
    description:
      "Heavy-duty ziplock bags trusted by food, pharma, and lifestyle brands for secure, long-lasting storage.",
    primaryCta: { label: "View Ziplock Range", href: "/categories/ziplock-pouches" },
    secondaryCta: { label: "Bulk Order", href: "/bulk" },
  },
];

/* ─── Trust badges ───────────────────────────────────────────── */

const trustBadges = [
  { icon: ShieldCheck, label: "Food-Safe" },
  { icon: Leaf, label: "Eco-Friendly" },
  { icon: PackageCheck, label: "Custom Print" },
  { icon: Truck, label: "Fast Delivery" },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function HeroSection8() {
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
      className="relative w-full overflow-hidden bg-[#07111f]"
      style={{ height: "clamp(520px, 68vw, 640px)" }}
      aria-label="Hero carousel"
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.reset()}
    >

      {/* ── Full-bleed image carousel (sits behind glass panel) ── */}
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

      {/* ── Subtle right-edge darkening to blend with section bg ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent 50%, rgba(7,17,31,0.35) 80%, rgba(7,17,31,0.65) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ════════════════════════════════════════════════════════════
          FROSTED GLASS PANEL — left side on desktop, bottom on mobile
      ════════════════════════════════════════════════════════════ */}
      <div
        className="absolute z-10
                   bottom-0 inset-x-0 top-auto
                   lg:inset-y-0 lg:left-0 lg:right-auto lg:bottom-auto
                   flex flex-col justify-between
                   lg:w-[46%]"
        style={{
          background: "rgba(255, 255, 255, 0.91)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          borderTop: "1px solid rgba(255,255,255,0.6)",
          borderRight: "1px solid rgba(255,255,255,0.5)",
        }}
      >
        {/* Green left accent bar — desktop only */}
        <div
          className="hidden lg:block absolute left-0 top-8 bottom-8 w-[3px] rounded-r-full"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #4ea85f, transparent)",
          }}
          aria-hidden="true"
        />

        {/* ── Main text content ── */}
        <div className="flex flex-col justify-center flex-1 px-7 sm:px-10 lg:px-12 xl:px-14 pt-8 pb-4 lg:py-0">

          {/* Tagline */}
          <div
            key={`tagline-${activeIndex}`}
            className="flex items-center gap-2 mb-5 animate-in fade-in-0 slide-in-from-top-2"
          >
            <span
              className="inline-block w-5 h-[2px] rounded-full shrink-0"
              style={{ background: "#4ea85f" }}
              aria-hidden="true"
            />
            <span
              className="text-[9px] font-bold tracking-[0.3em] uppercase"
              style={{ color: "#2e7c8a" }}
            >
              {slide.tagline}
            </span>
          </div>

          {/* Heading — brand gradient text */}
          <h1
            key={`heading-${activeIndex}`}
            className="font-extrabold leading-[1.07] tracking-tight mb-5 animate-in fade-in-0 slide-in-from-top-2"
            style={{
              fontSize: "clamp(1.9rem, 3.6vw, 3.2rem)",
              backgroundImage:
                "linear-gradient(135deg, #2c4f88 0%, #2e7c8a 52%, #4ea85f 100%)",
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
            className="text-sm sm:text-base leading-relaxed mb-7 max-w-[380px] animate-in fade-in-0 slide-in-from-top-2"
            style={{
              color: "rgba(15,47,95,0.58)",
              animationDelay: "110ms",
            }}
          >
            {slide.description}
          </p>

          {/* CTA buttons */}
          <div
            key={`cta-${activeIndex}`}
            className="flex flex-wrap items-center gap-3 mb-7 animate-in fade-in-0 slide-in-from-top-2"
            style={{ animationDelay: "165ms" }}
          >
            <Link
              href={slide.primaryCta.href}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.03] active:scale-100"
              style={{
                background: "#4ea85f",
                boxShadow: "0 8px 22px rgba(78,168,95,0.3)",
              }}
            >
              {slide.primaryCta.label}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href={slide.secondaryCta.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:text-white"
              style={{
                border: "1.5px solid rgba(44,79,136,0.3)",
                color: "#2c4f88",
                background: "rgba(44,79,136,0.04)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#2c4f88";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(44,79,136,0.04)";
              }}
            >
              {slide.secondaryCta.label}
            </Link>
          </div>

          {/* Navigation dots + arrows — inside glass panel */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Slide indicators">
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
                    width: i === activeIndex ? 22 : 6,
                    background:
                      i === activeIndex
                        ? "#4ea85f"
                        : "rgba(44,79,136,0.2)",
                  }}
                />
              ))}
            </div>
            <span
              className="text-[9px] font-bold tabular-nums tracking-widest ml-1"
              style={{ color: "rgba(44,79,136,0.3)" }}
            >
              {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={scrollPrev}
                aria-label="Previous slide"
                className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 hover:border-[#4ea85f] hover:text-[#4ea85f] hover:scale-110 active:scale-95"
                style={{
                  borderColor: "rgba(44,79,136,0.2)",
                  color: "rgba(44,79,136,0.45)",
                }}
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next slide"
                className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 hover:border-[#4ea85f] hover:text-[#4ea85f] hover:scale-110 active:scale-95"
                style={{
                  borderColor: "rgba(44,79,136,0.2)",
                  color: "rgba(44,79,136,0.45)",
                }}
              >
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Trust badges strip — bottom of glass panel ── */}
        <div
          className="px-7 sm:px-10 lg:px-12 xl:px-14 py-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-2.5"
          style={{ borderTop: "1px solid rgba(44,79,136,0.08)" }}
        >
          {trustBadges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: "#4ea85f" }}
                aria-hidden="true"
              />
              <span
                className="text-[9px] font-semibold tracking-wide uppercase whitespace-nowrap"
                style={{ color: "rgba(15,47,95,0.45)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-[3px] z-20"
        style={{ background: "rgba(255,255,255,0.1)" }}
        aria-hidden="true"
      >
        <div
          key={activeIndex}
          className="h-full"
          style={{
            background: "#4ea85f",
            animation: "progress-bar 5s linear forwards",
          }}
        />
      </div>

    </section>
  );
}
