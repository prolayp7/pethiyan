"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck, Leaf, PackageCheck, Truck,
  Star, CheckCircle, Award, Zap, Globe, Heart,
  ChevronLeft, ChevronRight, type LucideIcon,
} from "lucide-react";
import type { ApiHeroSlide, ApiHeroBadge } from "@/lib/api";

/* ─── Icon name → Lucide component map ──────────────────────────── */

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck, Leaf, PackageCheck, Truck,
  Star, CheckCircle, Award, Zap, Globe, Heart,
};


/* ─── Props ──────────────────────────────────────────────────── */

interface Props {
  slides?: ApiHeroSlide[];
  badges?: ApiHeroBadge[];
  settings?: { autoplayEnabled?: boolean; autoplayDelay?: number; heroHeight?: number };
}

/* ─── Component ──────────────────────────────────────────────── */

export default function HeroSection10({ slides: apiSlides, badges: apiBadges, settings }: Props) {
  const activeSlides = (apiSlides ?? []).filter((s) => s.image);
  const activeBadges = apiBadges ?? [];
  const autoplayDelay = Number(settings?.autoplayDelay ?? 5000) || 5000;
  const heroHeight = Number(settings?.heroHeight ?? 620) || 620;
  const heroMinHeight = `clamp(320px, 65vw, ${heroHeight}px)`;
  const heightScale = Math.max(0.72, Math.min(heroHeight / 620, 1));
  const headingFontSize = `clamp(${(1.5 * heightScale).toFixed(2)}rem, ${(3.2 * heightScale).toFixed(2)}vw, ${(3.6 * heightScale).toFixed(2)}rem)`;
  const contentTopPadding = `${Math.round(56 * heightScale)}px`;
  const contentBottomPadding = `${Math.round(36 * heightScale)}px`;
  const contentSidePadding = `${Math.round(52 * heightScale)}px`;
  const contentGapHeading = `${Math.round(20 * heightScale)}px`;
  const contentGapDescription = `${Math.round(28 * heightScale)}px`;
  const contentGapCta = `${Math.round(30 * heightScale)}px`;
  const buttonPadX = `${Math.round(24 * heightScale)}px`;
  const buttonPadY = `${Math.round(12 * heightScale)}px`;
  const buttonFontSize = `${Math.max(12, Math.round(14 * heightScale))}px`;
  const navSize = `${Math.max(24, Math.round(28 * heightScale))}px`;
  const navBottomMargin = `${Math.max(8, Math.round(14 * heightScale))}px`;
  const badgeTopOffset = `${Math.max(10, Math.round(20 * heightScale))}px`;
  const badgeRightOffset = `${Math.max(10, Math.round(20 * heightScale))}px`;
  const descFontSize = `${Math.max(12, Math.round(15 * heightScale))}px`;
  const descMaxWidth = `${Math.max(280, Math.round(400 * heightScale))}px`;

  if (activeSlides.length === 0) return null;
  const autoplay = Autoplay({ delay: autoplayDelay, stopOnInteraction: false });

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

  const slide = activeSlides[activeIndex] ?? activeSlides[0];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: heroMinHeight,
        background: "linear-gradient(320deg, #071023 0%, #0c1d38 50%, #0f2444 100%)",
      }}
      aria-label="Hero carousel"
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.reset()}
    >
      {/* Fine grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(70,190,150,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(70,190,150,0.045) 1px, transparent 1px),
            linear-gradient(rgba(60,130,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(60,130,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "10px 10px, 10px 10px, 50px 50px, 50px 50px",
        }}
      />
      <div
        className="relative z-10 flex flex-col lg:flex-row h-full"
        style={{ minHeight: heroMinHeight }}
      >

        {/* ════════════════════════════════════════
            LEFT — Text content on dark brand panel
        ════════════════════════════════════════ */}
        <div
          className="relative z-10 flex flex-col justify-center lg:w-[46%] order-2 lg:order-1"
          style={{
            paddingTop: contentTopPadding,
            paddingBottom: contentBottomPadding,
            paddingLeft: contentSidePadding,
            paddingRight: contentSidePadding,
          }}
        >

          {/* Eyebrow */}
          <div
            key={`eyebrow-${activeIndex}`}
            className="flex items-center gap-3 animate-in fade-in-0 slide-in-from-top-2"
            style={{ marginBottom: contentGapHeading }}
          >
            <span
              className="text-[9px] font-bold tracking-[0.35em] uppercase"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              {slide.eyebrow}
            </span>
          </div>

          {/* Thin gradient accent line below eyebrow */}
          <div
            className="w-16 h-[2px] rounded-full"
            style={{
              background: "linear-gradient(to right, #2e7c8a, #4ea85f)",
              marginBottom: contentGapHeading,
            }}
            aria-hidden="true"
          />

          {/* Heading — full gradient text */}
          <h1
            key={`heading-${activeIndex}`}
            className="font-extrabold leading-[1.07] tracking-tight animate-in fade-in-0 slide-in-from-top-2"
            style={{
              fontSize: headingFontSize,
              backgroundImage:
                "linear-gradient(135deg, #6ea8d8 0%, #2e7c8a 42%, #4ea85f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animationDelay: "55ms",
              marginBottom: contentGapHeading,
            }}
          >
            {slide.heading.split("\n").map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>

          {/* Description */}
          <p
            key={`desc-${activeIndex}`}
            className="leading-relaxed animate-in fade-in-0 slide-in-from-top-2"
            style={{
              color: "rgba(255,255,255,0.45)",
              animationDelay: "110ms",
              marginBottom: contentGapDescription,
              fontSize: descFontSize,
              maxWidth: descMaxWidth,
            }}
          >
            {slide.description}
          </p>

          {/* CTA buttons */}
          <div
            key={`cta-${activeIndex}`}
            className="flex flex-wrap items-center gap-3 animate-in fade-in-0 slide-in-from-top-2"
            style={{ animationDelay: "165ms", marginBottom: contentGapCta }}
          >
            <Link
              href={slide.primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full font-bold text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.04] active:scale-100"
              style={{
                background: "linear-gradient(135deg, #2e7c8a 0%, #4ea85f 100%)",
                boxShadow: "0 6px 22px rgba(78,168,95,0.25)",
                padding: `${buttonPadY} ${buttonPadX}`,
                fontSize: buttonFontSize,
              }}
            >
              {slide.primaryCta.label}
              <ChevronRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href={slide.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full font-semibold transition-all duration-300 hover:bg-white/8"
              style={{
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.58)",
                padding: `${buttonPadY} ${buttonPadX}`,
                fontSize: buttonFontSize,
              }}
            >
              {slide.secondaryCta.label}
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-2" style={{ marginBottom: `${Math.round(24 * heightScale)}px` }}>
            {activeBadges.map(({ id, iconName, label }) => {
                const Icon = ICON_MAP[iconName] ?? ShieldCheck;
                return (
                  <div
                    key={id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    }}
                  >
                    <Icon className="h-3 w-3 shrink-0" style={{ color: "#4ea85f" }} aria-hidden="true" />
                    <span
                      className="text-[8px] font-semibold tracking-wider uppercase"
                      style={{ color: "rgba(255,255,255,0.38)" }}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* ── Numbered circular nav + arrows (unique to HS10) ── */}
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Slide navigation"
            style={{ marginBottom: navBottomMargin }}
          >
            <button
              onClick={scrollPrev}
              aria-label="Previous slide"
              className="rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.35)",
                width: navSize,
                height: navSize,
              }}
            >
              <ChevronLeft className="h-3 w-3" aria-hidden="true" />
            </button>

            {activeSlides.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className="rounded-full flex items-center justify-center transition-all duration-400 font-bold tabular-nums"
                style={{
                  border: i === activeIndex
                    ? "1.5px solid #4ea85f"
                    : "1px solid rgba(255,255,255,0.12)",
                  color: i === activeIndex
                    ? "#4ea85f"
                    : "rgba(255,255,255,0.28)",
                  background: i === activeIndex
                    ? "rgba(78,168,95,0.1)"
                    : "transparent",
                  boxShadow: i === activeIndex
                    ? "0 0 10px rgba(78,168,95,0.2)"
                    : "none",
                  width: navSize,
                  height: navSize,
                  fontSize: `${Math.max(8, Math.round(9 * heightScale))}px`,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}

            <button
              onClick={scrollNext}
              aria-label="Next slide"
              className="rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.35)",
                width: navSize,
                height: navSize,
              }}
            >
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

        </div>

        {/* ════════════════════════════════════════
            RIGHT — Image with bold diagonal left cut
        ════════════════════════════════════════ */}
        <div
          className="relative lg:w-[54%] order-1 lg:order-2"
          style={{ minHeight: heroMinHeight }}
        >
          {/* Image panel — diagonal clip for premium angled separation */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(9% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          >
            {/* Embla viewport */}
            <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
              <div className="flex h-full">
                {activeSlides.map((s) => (
                  <div
                    key={s.id}
                    className="relative flex-none w-full h-full"
                    aria-roledescription="slide"
                  >
                    <Image
                      src={s.image}
                      alt={s.heading.replace("\n", " ")}
                      fill
                      unoptimized
                      className="object-cover"
                      priority={s.id === 1}
                      sizes="(max-width: 1024px) 100vw, 54vw"
                    />
                    {/* Overlay — subtle darkening for visual depth */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, transparent 40%, rgba(0,0,0,0.22) 100%)",
                      }}
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar inside image panel */}
            <div
              className="absolute bottom-0 inset-x-0 h-[3px] z-10"
              style={{ background: "rgba(255,255,255,0.1)" }}
              aria-hidden="true"
            >
              <div
                key={activeIndex}
                className="h-full"
                style={{
                  backgroundImage: "linear-gradient(to right, #2e7c8a, #4ea85f)",
                  animation: "progress-bar 5s linear forwards",
                }}
              />
            </div>
          </div>

          {/* Floating slide label — top right of image */}
          <div className="absolute z-10" style={{ top: badgeTopOffset, right: badgeRightOffset }}>
            <span
              key={`label-${activeIndex}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase backdrop-blur-sm animate-in fade-in-0"
              style={{
                background: "rgba(7,16,35,0.72)",
                color: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: "#4ea85f" }}
                aria-hidden="true"
              />
              {slide.eyebrow.split(" ").slice(0, 2).join(" ")}
            </span>
          </div>
        </div>

      </div>

      {/* Bottom border */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "rgba(78,168,95,0.15)" }}
        aria-hidden="true"
      />
    </section>
  );
}
