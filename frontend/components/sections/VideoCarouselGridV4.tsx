"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, VolumeX, Volume2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoSlide {
  id: number;
  videoSrc: string;
  poster?: string;
  product: {
    image: string;
    name: string;
    price: string;
    href: string;
  };
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const slides: VideoSlide[] = [
  {
    id: 1,
    videoSrc: "/product_video/1.mp4",
    product: { image: "/pethiyan-logo.png", name: "Standup Pouch 500g",   price: "$12.00", href: "/products/standup-pouch-500g"   },
  },
  {
    id: 2,
    videoSrc: "/product_video/2.mp4",
    product: { image: "/pethiyan-logo.png", name: "Ziplock Bag 250g",     price: "$8.00",  href: "/products/ziplock-bag-250g"     },
  },
  {
    id: 3,
    videoSrc: "/product_video/3.mp4",
    product: { image: "/pethiyan-logo.png", name: "Custom Printed Pouch", price: "$24.00", href: "/products/custom-printed-pouch" },
  },
  {
    id: 4,
    videoSrc: "/product_video/4.mp4",
    product: { image: "/pethiyan-logo.png", name: "Kraft Paper Bag",      price: "$6.50",  href: "/products/kraft-paper-bag"      },
  },
  {
    id: 5,
    videoSrc: "/product_video/5.mp4",
    product: { image: "/pethiyan-logo.png", name: "Flat Bottom Pouch",    price: "$18.00", href: "/products/flat-bottom-pouch"    },
  },
  {
    id: 6,
    videoSrc: "/product_video/6.mp4",
    product: { image: "/pethiyan-logo.png", name: "Eco Mailer Bag",       price: "$9.00",  href: "/products/eco-mailer-bag"       },
  },
];

// ─── Slot config (distance from center → visual style) ───────────────────────

const SLOT_HEIGHT: Record<number, number> = { 0: 580, 1: 460, 2: 360 };
const SLOT_OPACITY: Record<number, number> = { 0: 1, 1: 0.85, 2: 0.65 };

// ─── Component ────────────────────────────────────────────────────────────────

export default function VideoCarouselGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction,   setDirection]   = useState<"next" | "prev">("next");
  const [animKey,     setAnimKey]     = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(true);
  const [isMuted,     setIsMuted]     = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const total    = slides.length;

  // Play/pause active video
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
    if (isPlaying) v.play().catch(() => {});
    else           v.pause();
  }, [activeIndex, isPlaying, isMuted]);

  const goTo = useCallback(
    (index: number, dir: "next" | "prev") => {
      setDirection(dir);
      setAnimKey((k) => k + 1);
      setActiveIndex((index + total) % total);
      setIsPlaying(true);
    },
    [total]
  );

  const prev = () => goTo(activeIndex - 1, "prev");
  const next = () => goTo(activeIndex + 1, "next");

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); setIsPlaying(false); }
    else           { v.play().catch(() => {}); setIsPlaying(true); }
  };

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !isMuted;
    setIsMuted((m) => !m);
  };

  // 5 slots: offsets -2, -1, 0, +1, +2 relative to activeIndex
  const slots = [-2, -1, 0, 1, 2];

  const activeSlide = slides[activeIndex];

  return (
    <>
      {/* Slide-in keyframes injected once */}
      <style>{`
        @keyframes vcg-slide-from-right {
          from { transform: translateX(60px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes vcg-slide-from-left {
          from { transform: translateX(-60px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>

      <section
        className="w-full py-12 lg:py-20 relative"
        style={{
          background: "linear-gradient(135deg, #071828 0%, #0b2d33 42%, #0c2818 100%)",
        }}
      >
        {/* Fine grid overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56,180,140,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56,180,140,0.06) 1px, transparent 1px),
              linear-gradient(rgba(60,120,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(60,120,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "12px 12px, 12px 12px, 60px 60px, 60px 60px",
          }}
        />
        {/* Soft bottom glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(46,124,138,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Content sits above background overlays */}
        <div className="relative z-10">

        {/* ── Section heading — top-left, aligned with Hero text ──────── */}
        <div className="px-7 sm:px-10 lg:px-12 xl:px-14 mb-8">
          <p
            className="text-xs font-bold tracking-[0.22em] uppercase mb-2"
            style={{ color: "rgba(78,168,95,0.85)" }}
          >
            Shop &amp; Discover
          </p>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight"
            style={{
              backgroundImage: "linear-gradient(135deg, #6ea8d8 0%, #2e7c8a 42%, #4ea85f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Real Products, Real Stories
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 340 }}>
            Watch our packaging in action — trusted by brands across the country.
          </p>
        </div>

        {/* ── Fixed 5-slot row ────────────────────────────────────────── */}
        <div className="relative w-full flex items-center" style={{ height: SLOT_HEIGHT[0] + 40, gap: 12 }}>

          {slots.map((offset) => {
            const slideIndex = ((activeIndex + offset) % total + total) % total;
            const slide      = slides[slideIndex];
            const absOffset  = Math.abs(offset);
            const isCenter   = offset === 0;
            const h          = SLOT_HEIGHT[absOffset]  ?? 280;
            const opacity    = SLOT_OPACITY[absOffset] ?? 0.4;

            return (
              <div
                key={offset}
                onClick={() => !isCenter && goTo(slideIndex, offset > 0 ? "next" : "prev")}
                className="flex-1 flex items-center justify-center overflow-hidden"
                style={{
                  height:  h,
                  opacity,
                  cursor:  isCenter ? "default" : "pointer",
                  transition: "opacity 400ms ease",
                  zIndex: isCenter ? 10 : 1,
                }}
              >
                {/* Card content — re-keyed on every navigation to trigger animation */}
                <div
                  key={`${offset}-${animKey}`}
                  className="w-full h-full overflow-hidden relative"
                  style={{
                    borderRadius: offset === -2
                      ? "0 16px 16px 0"
                      : offset === 2
                      ? "16px 0 0 16px"
                      : "16px",
                    boxShadow: isCenter ? "0 24px 56px rgba(0,0,0,0.18)" : "0 6px 20px rgba(0,0,0,0.08)",
                    animation: `${
                      direction === "next"
                        ? "vcg-slide-from-right"
                        : "vcg-slide-from-left"
                    } 420ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both`,
                  }}
                >
                  {isCenter ? (
                    <>
                      <video
                        ref={videoRef}
                        key={slide.id}
                        src={slide.videoSrc}
                        poster={slide.poster}
                        loop
                        muted={isMuted}
                        playsInline
                        className="w-full h-full object-cover"
                      />

                      {/* Play/Pause */}
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                        aria-label={isPlaying ? "Pause" : "Play"}
                        className="absolute top-3 left-3 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 hover:bg-white transition-colors shadow"
                      >
                        {isPlaying
                          ? <Pause className="h-4 w-4 text-gray-800" />
                          : <Play  className="h-4 w-4 text-gray-800" />}
                      </button>

                      {/* Mute */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                        aria-label={isMuted ? "Unmute" : "Mute"}
                        className="absolute bottom-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                      >
                        {isMuted
                          ? <VolumeX className="h-4 w-4 text-white" />
                          : <Volume2 className="h-4 w-4 text-white" />}
                      </button>
                    </>
                  ) : (
                    <video
                      src={slide.videoSrc}
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  )}
                </div>
              </div>
            );
          })}

          {/* Prev arrow */}
          <button
            onClick={prev}
            aria-label="Previous video"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>

          {/* Next arrow */}
          <button
            onClick={next}
            aria-label="Next video"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* ── Product card ──────────────────────────────────────────── */}
        <div className="mt-6 flex justify-center px-4">
          <a
            key={activeSlide.id}
            href={activeSlide.product.href}
            className="flex items-center gap-4 rounded-2xl px-5 py-4 shadow-lg hover:shadow-xl transition-shadow"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              minWidth: 320,
              maxWidth: 420,
              animation: `${
                direction === "next" ? "vcg-slide-from-right" : "vcg-slide-from-left"
              } 420ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both`,
            }}
          >
            <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-gray-50">
              <Image
                src={activeSlide.product.image}
                alt={activeSlide.product.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-snug">
                {activeSlide.product.name}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">{activeSlide.product.price}</p>
            </div>
          </a>
        </div>

        {/* ── Dot indicators ────────────────────────────────────────── */}
        <div className="mt-5 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > activeIndex ? "next" : "prev")}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === activeIndex ? 24 : 8,
                height:     8,
                background: i === activeIndex ? "#4ea85f" : "#d1d5db",
              }}
            />
          ))}
        </div>

        </div>{/* end relative z-10 */}
      </section>
    </>
  );
}
