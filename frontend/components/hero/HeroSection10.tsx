"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
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

function shouldBypassOptimizer(src?: string | null): boolean {
  if (!src) return false;
  return /^data:/i.test(src) || /\.svg(\?|#|$)/i.test(src);
}

/* ─── Component ──────────────────────────────────────────────── */

// Layout constants that never change — defined outside the component so they
// are never recreated and never trigger inline-style mutations on re-renders.
const CONTENT_PANE_WIDTH  = "clamp(170px, 44vw, 46%)";
const IMAGE_PANE_MIN_WIDTH = "max(180px, 46vw)";

export default function HeroSection10({ slides: apiSlides, badges: apiBadges, settings }: Props) {
  const activeSlides = (apiSlides ?? []).filter((s) => s.image);
  const hasSlides = activeSlides.length > 0;
  const activeBadges = apiBadges ?? [];
  const autoplayDelay = Number(settings?.autoplayDelay ?? 5000) || 5000;
  const heroHeight = Number(settings?.heroHeight ?? 620) || 620;

  // All fluid style values are pure functions of heroHeight (via heightScale).
  // Memoising them prevents the 23 string interpolations from re-running on
  // every activeIndex state change (i.e. every slide transition), which was
  // the primary source of Style & Layout main-thread work.
  const {
    heroMinHeight,
    headingFontSize,
    contentTopPadding,
    contentBottomPadding,
    contentSidePadding,
    contentGapHeading,
    contentGapDescription,
    contentGapCta,
    buttonPadX,
    buttonPadY,
    buttonFontSize,
    navSize,
    navBottomMargin,
    badgeTopOffset,
    badgeRightOffset,
    eyebrowFontSize,
    descFontSize,
    badgeWrapMargin,
    navNumberFontSize,
    headingSpanWidth,
    descriptionSpanWidth,
    badgeSpanWidth,
    subheadingLineHeight,
  } = useMemo(() => {
    const hs = Math.max(0.72, Math.min(heroHeight / 620, 1));
    const headingMin = (0.85 * hs).toFixed(2);
    const headingMax = (4.8 * hs).toFixed(2);
    return {
      heroMinHeight:          `clamp(280px, min(52vw, 70vh), ${heroHeight}px)`,
      headingFontSize:        `clamp(${headingMin}rem, min(${(3.2 * hs).toFixed(2)}vw, ${(6.2 * hs).toFixed(2)}vh), ${headingMax}rem)`,
      contentTopPadding:      `clamp(6px,  min(2.2vw, 3.5vh), ${Math.round(40 * hs)}px)`,
      contentBottomPadding:   `clamp(6px,  min(1.8vw, 2.8vh), ${Math.round(28 * hs)}px)`,
      contentSidePadding:     `clamp(8px,  min(2.4vw, 3.2vh), ${Math.round(44 * hs)}px)`,
      contentGapHeading:      `clamp(3px,  min(0.9vw, 1.4vh), ${Math.round(13 * hs)}px)`,
      contentGapDescription:  `clamp(5px,  min(1.2vw, 1.8vh), ${Math.round(18 * hs)}px)`,
      contentGapCta:          `clamp(5px,  min(1.4vw, 2.0vh), ${Math.round(20 * hs)}px)`,
      buttonPadX:             `clamp(8px,  min(1.5vw, 2.2vh), ${Math.round(26 * hs)}px)`,
      buttonPadY:             `clamp(4px,  min(0.7vw, 1.2vh), ${Math.round(12 * hs)}px)`,
      buttonFontSize:         `clamp(8px,  min(1.3vw, 2.0vh), ${Math.max(13, Math.round(16 * hs))}px)`,
      navSize:                `clamp(12px, min(2.4vw, 3.8vh), ${Math.max(24, Math.round(36 * hs))}px)`,
      navBottomMargin:        `clamp(0px,  min(0.8vw, 1.0vh), ${Math.round(8  * hs)}px)`,
      badgeTopOffset:         `${Math.max(8,  Math.round(16 * hs))}px`,
      badgeRightOffset:       `${Math.max(8,  Math.round(16 * hs))}px`,
      eyebrowFontSize:        `clamp(8px,  min(1.0vw, 1.5vh), ${Math.max(11, Math.round(14 * hs))}px)`,
      descFontSize:           `clamp(9px,  min(1.4vw, 2.4vh), ${Math.max(13, Math.round(18 * hs))}px)`,
      badgeWrapMargin:        `clamp(3px,  min(0.9vw, 1.3vh), ${Math.round(12 * hs)}px)`,
      navNumberFontSize:      `clamp(5px,  min(0.9vw, 1.4vh), ${Math.max(9,  Math.round(12 * hs))}px)`,
      headingSpanWidth:       `clamp(240px, 74vw, ${Math.max(420, Math.round(620 * hs))}px)`,
      descriptionSpanWidth:   `clamp(210px, 58vw, ${Math.max(280, Math.round(400 * hs))}px)`,
      badgeSpanWidth:         `clamp(220px, 76vw, ${Math.max(300, Math.round(430 * hs))}px)`,
      subheadingLineHeight:   `${Math.max(1.12, Number((1.24 * hs).toFixed(2)))}`,
    };
  }, [heroHeight]);

  // Memoize the plugin so it isn't recreated on every render (activeIndex
  // state changes would otherwise re-instantiate Autoplay and force Embla
  // to re-read slide dimensions — the main source of forced reflows).
  const autoplay = useMemo(
    () => Autoplay({ delay: autoplayDelay, stopOnInteraction: false, stopOnMouseEnter: true }),
    [autoplayDelay]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 40,
      // Prevent Embla from re-reading slide dimensions on every window resize.
      // The hero is always full-width so resize remeasurement is unnecessary
      // and each measurement triggers a forced reflow on the main thread.
      watchResize: false,
    },
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

  if (!hasSlides) return null;

  const slide = activeSlides[activeIndex] ?? activeSlides[0];

  return (
    <section
      className="hero-section-10 relative w-full overflow-hidden"
      style={{ "--hero-min-height": heroMinHeight } as React.CSSProperties}
      aria-label="Hero carousel"
    >
      {/* hero-mobile-heading / hero-mobile-subheading / hero-mobile-description
          styles live in globals.css — no runtime style injection */}
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
        className="relative z-10 flex h-full flex-row"
      >

        {/* ════════════════════════════════════════
            LEFT — Text content on dark brand panel
        ════════════════════════════════════════ */}
        <div
          className="relative z-20 flex h-full shrink-0 items-center overflow-visible sm:overflow-hidden"
          style={{ width: CONTENT_PANE_WIDTH, maxWidth: "46%" }}
        >
          {/* Inner wrapper — CSS-centered to avoid post-render layout shifts */}
          <div
            className="flex w-full flex-col"
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
            style={{ marginBottom: contentGapHeading, width: headingSpanWidth, maxWidth: "none" }}
          >
            <span
              className="font-bold uppercase"
              style={{ color: "#ffffff", fontSize: eyebrowFontSize, letterSpacing: "0.28em" }}
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
              width: "clamp(42px, 8vw, 64px)",
            }}
            aria-hidden="true"
          />

          {/* Heading — full gradient text */}
          <h1
            key={`heading-${activeIndex}`}
            className="hero-mobile-heading font-extrabold leading-[1.07] tracking-tight animate-in fade-in-0 slide-in-from-top-2"
            style={{
              width: "100%",
              fontSize: headingFontSize,
              color: "#ffffff",
              animationDelay: "55ms",
              marginBottom: contentGapHeading,
            }}
          >
            {slide.heading.split("\n").map((line, i) => (
              <span
                key={i}
                className={i > 0 ? "hero-mobile-subheading block" : "block"}
                style={
                  i > 0
                    ? {
                        lineHeight: subheadingLineHeight,
                        marginTop: "0.18em",
                        whiteSpace: "nowrap",
                      }
                    : undefined
                }
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p
            key={`desc-${activeIndex}`}
            className="hero-mobile-description leading-relaxed animate-in fade-in-0 slide-in-from-top-2"
            style={{
              width: descriptionSpanWidth,
              color: "#ffffff",
              animationDelay: "110ms",
              marginBottom: contentGapDescription,
              fontSize: descFontSize,
              maxWidth: "none",
            }}
          >
            {slide.description}
          </p>

          {/* CTA buttons */}
          <div
            key={`cta-${activeIndex}`}
            className="flex flex-nowrap items-center gap-2 sm:flex-wrap sm:gap-3 animate-in fade-in-0 slide-in-from-top-2"
            style={{ animationDelay: "165ms", marginBottom: contentGapCta }}
          >
            <Link
              href={slide.primaryCta.href}
              className="group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-bold text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.04] active:scale-100 sm:gap-2"
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
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-semibold transition-all duration-300 hover:bg-white/8 sm:gap-2"
              style={{
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#ffffff",
                padding: `${buttonPadY} ${buttonPadX}`,
                fontSize: buttonFontSize,
              }}
            >
              {slide.secondaryCta.label}
            </Link>
          </div>

          {/* Trust badges */}
          <div
            className="flex flex-nowrap items-center gap-1 overflow-visible sm:flex-wrap sm:gap-2 sm:overflow-visible"
            style={{
              width: badgeSpanWidth,
              maxWidth: "none",
              marginBottom: badgeWrapMargin,
            }}
          >
            {activeBadges.map(({ id, iconName, label }) => {
                const Icon = ICON_MAP[iconName] ?? ShieldCheck;
                return (
                  <div
                    key={id}
                    className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full px-1.5 py-0.5"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    }}
                  >
                    <Icon className="h-2.5 w-2.5 shrink-0" style={{ color: "#4ea85f" }} aria-hidden="true" />
                    <span
                      className="font-semibold uppercase"
                      style={{
                        color: "#ffffff",
                        fontSize: "clamp(7px, 0.75vw, 9px)",
                        letterSpacing: "0.15em",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* ── Numbered circular nav + arrows (unique to HS10) ── */}
          {/* Outer wrapper: plain flex — no role, so prev/next arrows are
              not constrained by tablist's required-children rule.          */}
          <div
            className="flex items-center gap-1 sm:gap-1.5"
            style={{ marginBottom: navBottomMargin }}
          >
            <button
              onClick={scrollPrev}
              aria-label="Previous slide"
              className="rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#ffffff",
                width: navSize,
                height: navSize,
              }}
            >
              <ChevronLeft className="h-3 w-3" aria-hidden="true" />
            </button>

            {/* tablist contains ONLY role="tab" children — satisfies ARIA spec */}
            <div
              role="tablist"
              aria-label="Slide navigation"
              className="flex items-center gap-1 sm:gap-1.5"
            >
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIndex ? "true" : "false"}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className="rounded-full flex items-center justify-center transition-all duration-400 font-bold tabular-nums"
                  style={{
                    border: i === activeIndex
                      ? "1.5px solid #4ea85f"
                      : "1px solid rgba(255,255,255,0.12)",
                    color: "#ffffff",
                    background: i === activeIndex
                      ? "rgba(78,168,95,0.1)"
                      : "transparent",
                    boxShadow: i === activeIndex
                      ? "0 0 10px rgba(78,168,95,0.2)"
                      : "none",
                    width: navSize,
                    height: navSize,
                    fontSize: navNumberFontSize,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>

            <button
              onClick={scrollNext}
              aria-label="Next slide"
              className="rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#ffffff",
                width: navSize,
                height: navSize,
              }}
            >
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

          </div>{/* end innerRef */}
        </div>

        {/* ════════════════════════════════════════
            RIGHT — Image with bold diagonal left cut
        ════════════════════════════════════════ */}
        <div
          className="relative min-w-0 flex-1 h-full"
          style={{ minWidth: IMAGE_PANE_MIN_WIDTH }}
        >
          {/* Image panel — diagonal clip for premium angled separation */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(9% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          >
            {/* Embla viewport — will-change-transform creates a compositing
                layer so Embla's translate3d scroll doesn't invalidate the
                main-thread layout, reducing forced-reflow overhead */}
            <div ref={emblaRef} className="absolute inset-0 overflow-hidden will-change-transform">
              <div className="flex h-full will-change-transform">
                {activeSlides.map((s, index) => (
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
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      // decoding="sync" on the LCP slide tells the browser to
                      // render the image synchronously once downloaded instead
                      // of deferring decode — eliminates ~500 ms element render delay.
                      decoding={index === 0 ? "sync" : "async"}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 62vw, 55vw"
                      quality={75}
                      unoptimized={shouldBypassOptimizer(s.image)}
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
              className="inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1.5 rounded-full text-[8px] font-bold tracking-[0.22em] uppercase backdrop-blur-sm animate-in fade-in-0 sm:px-3 sm:text-[9px] sm:tracking-widest"
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
