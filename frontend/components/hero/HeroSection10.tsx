"use client";

import { useEffect, useCallback, useState, useRef } from "react";
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
  const hasSlides = activeSlides.length > 0;
  const activeBadges = apiBadges ?? [];
  const autoplayDelay = Number(settings?.autoplayDelay ?? 5000) || 5000;
  const heroHeight = Number(settings?.heroHeight ?? 620) || 620;
  const heroMinHeight = `clamp(280px, min(52vw, 70vh), ${heroHeight}px)`;
  const heightScale = Math.max(0.72, Math.min(heroHeight / 620, 1));
  // All fluid values use min(vw, vh) so they scale with whichever dimension is
  // smaller — this ensures content fits inside the admin-controlled hero height.
  const headingMin = (0.85 * heightScale).toFixed(2);
  const headingMax = (4.8 * heightScale).toFixed(2);
  const headingFontSize = `clamp(${headingMin}rem, min(${(3.2 * heightScale).toFixed(2)}vw, ${(6.2 * heightScale).toFixed(2)}vh), ${headingMax}rem)`;
  const contentTopPadding    = `clamp(6px,  min(2.2vw, 3.5vh), ${Math.round(40 * heightScale)}px)`;
  const contentBottomPadding = `clamp(6px,  min(1.8vw, 2.8vh), ${Math.round(28 * heightScale)}px)`;
  const contentSidePadding   = `clamp(8px,  min(2.4vw, 3.2vh), ${Math.round(44 * heightScale)}px)`;
  const contentGapHeading    = `clamp(3px,  min(0.9vw, 1.4vh), ${Math.round(13 * heightScale)}px)`;
  const contentGapDescription= `clamp(5px,  min(1.2vw, 1.8vh), ${Math.round(18 * heightScale)}px)`;
  const contentGapCta        = `clamp(5px,  min(1.4vw, 2.0vh), ${Math.round(20 * heightScale)}px)`;
  const buttonPadX  = `clamp(8px,  min(1.5vw, 2.2vh), ${Math.round(26 * heightScale)}px)`;
  const buttonPadY  = `clamp(4px,  min(0.7vw, 1.2vh), ${Math.round(12 * heightScale)}px)`;
  const buttonFontSize = `clamp(8px, min(1.3vw, 2.0vh), ${Math.max(13, Math.round(16 * heightScale))}px)`;
  const navSize        = `clamp(12px, min(2.4vw, 3.8vh), ${Math.max(24, Math.round(36 * heightScale))}px)`;
  const navBottomMargin= `clamp(0px,  min(0.8vw, 1.0vh), ${Math.round(8  * heightScale)}px)`;
  const badgeTopOffset  = `${Math.max(8,  Math.round(16 * heightScale))}px`;
  const badgeRightOffset= `${Math.max(8,  Math.round(16 * heightScale))}px`;
  const eyebrowFontSize = `clamp(8px,  min(1.0vw, 1.5vh), ${Math.max(11, Math.round(14 * heightScale))}px)`;
  const descFontSize    = `clamp(9px,  min(1.4vw, 2.4vh), ${Math.max(13, Math.round(18 * heightScale))}px)`;
  const badgeWrapMargin = `clamp(3px,  min(0.9vw, 1.3vh), ${Math.round(12 * heightScale)}px)`;
  const navNumberFontSize=`clamp(5px,  min(0.9vw, 1.4vh), ${Math.max(9,  Math.round(12 * heightScale))}px)`;
  const contentPaneWidth = "clamp(170px, 44vw, 46%)";
  const imagePaneMinWidth = "max(180px, 46vw)";
  const headingSpanWidth = `clamp(240px, 74vw, ${Math.max(420, Math.round(620 * heightScale))}px)`;
  const descriptionSpanWidth = `clamp(210px, 58vw, ${Math.max(280, Math.round(400 * heightScale))}px)`;
  const badgeSpanWidth = `clamp(220px, 76vw, ${Math.max(300, Math.round(430 * heightScale))}px)`;
  const subheadingLineHeight = `${Math.max(1.12, Number((1.24 * heightScale).toFixed(2)))}`;

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

  /* ── Fit content into fixed hero height ── */
  const paneRef  = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fit = () => {
      const pane  = paneRef.current;
      const inner = innerRef.current;
      if (!pane || !inner) return;
      // Reset transforms so we can measure natural size
      inner.style.transform = "";
      inner.style.width     = "100%";
      inner.style.top       = "";
      const paneH  = pane.clientHeight;
      const innerH = inner.offsetHeight;
      if (innerH > 0 && paneH > 0) {
        if (innerH <= paneH) {
          // Content fits — vertically centre it
          inner.style.top = `${Math.round((paneH - innerH) / 2)}px`;
        } else {
          // Content overflows — scale down uniformly from the top
          const s = paneH / innerH;
          inner.style.top             = "0";
          inner.style.transform       = `scale(${s})`;
          inner.style.transformOrigin = "top left";
          // Compensate for the horizontal shrink so text still fills the pane width
          inner.style.width = `${(1 / s) * 100}%`;
        }
      }
    };
    const raf = requestAnimationFrame(fit);
    const ro  = new ResizeObserver(fit);
    if (paneRef.current) ro.observe(paneRef.current);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [activeIndex]);

  if (!hasSlides) return null;

  const slide = activeSlides[activeIndex] ?? activeSlides[0];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: heroMinHeight,
        background: "linear-gradient(320deg, #071023 0%, #0c1d38 50%, #0f2444 100%)",
      }}
      aria-label="Hero carousel"
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.reset()}
    >
      <style>{`
        @media (max-width: 639px) {
          .hero-mobile-heading {
            width: min(78vw, 20rem) !important;
            max-width: none !important;
            margin-bottom: 0.55rem !important;
          }
          .hero-mobile-subheading {
            display: block;
            font-size: 1.24em;
            line-height: 1.2;
            margin-top: 0.38em !important;
            white-space: normal !important;
            max-width: 100%;
          }
          .hero-mobile-description {
            margin-top: 0.15rem;
          }
        }
      `}</style>
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
          ref={paneRef}
          className="relative z-20 shrink-0 overflow-visible sm:overflow-hidden"
          style={{ width: contentPaneWidth, maxWidth: "46%" }}
        >
          {/* Inner wrapper — absolutely positioned so JS can centre or scale it */}
          <div
            ref={innerRef}
            className="absolute left-0 flex flex-col"
            style={{
              width: "100%",
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
              style={{ color: "rgba(255,255,255,0.38)", fontSize: eyebrowFontSize, letterSpacing: "0.28em" }}
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
              color: "rgba(255,255,255,0.45)",
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
                color: "rgba(255,255,255,0.58)",
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
                        color: "rgba(255,255,255,0.38)",
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
          <div
            className="flex items-center gap-1 sm:gap-1.5"
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
                  fontSize: navNumberFontSize,
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

          </div>{/* end innerRef */}
        </div>

        {/* ════════════════════════════════════════
            RIGHT — Image with bold diagonal left cut
        ════════════════════════════════════════ */}
        <div
          className="relative min-w-0 flex-1 h-full"
          style={{ minWidth: imagePaneMinWidth }}
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
                      sizes="(max-width: 1024px) 100vw, 54vw"
                      quality={85}
                      unoptimized={/^https?:\/\//i.test(s.image)}
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
