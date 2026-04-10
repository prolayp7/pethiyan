"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, VolumeX, Volume2 } from "lucide-react";
import type { ApiVideoStorySection } from "@/lib/api";

interface VideoCarouselGridProps {
  data: ApiVideoStorySection | null;
}

const SLOT_HEIGHT: Record<number, number> = { 0: 580, 1: 460, 2: 360 };
const SLOT_OPACITY: Record<number, number> = { 0: 1, 1: 0.85, 2: 0.65 };

export default function VideoCarouselGrid({ data }: VideoCarouselGridProps) {
  const slides = data?.videos ?? [];
  const settings = data?.settings;
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animKey, setAnimKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const total = slides.length;

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;
    currentVideo.muted = isMuted;
    if (isPlaying) currentVideo.play().catch(() => {});
    else currentVideo.pause();
  }, [activeIndex, isMuted, isPlaying]);

  useEffect(() => {
    if (activeIndex < total) {
      return;
    }
    setActiveIndex(0);
  }, [activeIndex, total]);

  useEffect(() => {
    if (!settings?.autoplayEnabled || total < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setDirection("next");
      setAnimKey((current) => current + 1);
      setActiveIndex((current) => (current + 1) % total);
      setIsPlaying(true);
    }, settings.autoplayDelay);

    return () => window.clearInterval(timer);
  }, [settings?.autoplayDelay, settings?.autoplayEnabled, total]);

  const goTo = useCallback((index: number, dir: "next" | "prev") => {
    setDirection(dir);
    setAnimKey((current) => current + 1);
    setActiveIndex((index + total) % total);
    setIsPlaying(true);
  }, [total]);

  if (!settings?.isActive || total === 0) {
    return null;
  }

  const prev = () => goTo(activeIndex - 1, "prev");
  const next = () => goTo(activeIndex + 1, "next");

  const togglePlay = () => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    if (isPlaying) {
      currentVideo.pause();
      setIsPlaying(false);
      return;
    }

    currentVideo.play().catch(() => {});
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted((current) => !current);
  };

  const slots = [-2, -1, 0, 1, 2];
  const activeSlide = slides[activeIndex];
  const animationName = settings.animationStyle === "fade"
    ? "vcg-fade-in"
    : settings.animationStyle === "none"
      ? "none"
      : (direction === "next" ? "vcg-slide-from-right" : "vcg-slide-from-left");
  const animation = settings.animationStyle === "none"
    ? "none"
    : `${animationName} ${settings.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both`;

  return (
    <>
      <style>{`
        @keyframes vcg-slide-from-right {
          from { transform: translateX(60px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes vcg-slide-from-left {
          from { transform: translateX(-60px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes vcg-fade-in {
          from { opacity: 0; transform: scale(0.985); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <section
        className="w-full py-12 lg:py-20 relative"
        style={{ background: "linear-gradient(140deg, #071023 0%, #0c1d38 50%, #0f2444 100%)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(46,124,138,0.10) 1px, transparent 1px),
              linear-gradient(90deg, rgba(46,124,138,0.10) 1px, transparent 1px),
              linear-gradient(rgba(60,130,255,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(60,130,255,0.07) 1px, transparent 1px)
            `,
            backgroundSize: "10px 10px, 10px 10px, 50px 50px, 50px 50px",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 80% at 0% 0%, #071023 0%, rgba(2, 11, 30, 0.65) 25%, rgba(12,29,56,0.28) 50%, rgba(15,36,68,0.08) 70%, transparent 85%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 35% at 50% 100%, rgba(46,124,138,0.12) 0%, transparent 70%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 70% at 100% 0%, rgba(46,124,138,0.18) 0%, rgba(46,124,138,0.06) 50%, transparent 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 70% at 0% 100%, rgba(78,168,95,0.16) 0%, rgba(78,168,95,0.05) 50%, transparent 100%)",
          }}
        />

        <div className="relative z-10">
          <div className="px-7 sm:px-10 lg:px-12 xl:px-14 mb-8">
            <p
              className="text-xs font-bold tracking-[0.22em] uppercase mb-2"
              style={{ color: "rgba(78,168,95,0.85)" }}
            >
              {settings.eyebrow}
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
              {settings.heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 340 }}>
              {settings.subheading}
            </p>
          </div>

          <div className="relative w-full flex items-center" style={{ height: SLOT_HEIGHT[0] + 40, gap: 12 }}>
            {slots.map((offset) => {
              const slideIndex = ((activeIndex + offset) % total + total) % total;
              const slide = slides[slideIndex];
              const absOffset = Math.abs(offset);
              const isCenter = offset === 0;
              const height = SLOT_HEIGHT[absOffset] ?? 280;
              const opacity = SLOT_OPACITY[absOffset] ?? 0.4;

              return (
                <div
                  key={offset}
                  onClick={() => !isCenter && goTo(slideIndex, offset > 0 ? "next" : "prev")}
                  className="flex-1 flex items-center justify-center overflow-hidden"
                  style={{
                    height,
                    opacity,
                    cursor: isCenter ? "default" : "pointer",
                    transition: `opacity ${settings.transitionDuration}ms ease`,
                    zIndex: isCenter ? 10 : 1,
                  }}
                >
                  <div
                    key={`${offset}-${animKey}`}
                    className="w-full h-full overflow-hidden relative"
                    style={{
                      borderRadius: offset === -2 ? "0 16px 16px 0" : offset === 2 ? "16px 0 0 16px" : "16px",
                      boxShadow: isCenter
                        ? "0 24px 60px rgba(0,0,0,0.6), 0 0 50px rgba(46,124,138,0.7), 0 0 100px rgba(78,168,95,0.4)"
                        : "0 8px 32px rgba(0,0,0,0.5), 0 0 36px rgba(46,124,138,0.5), 0 0 70px rgba(78,168,95,0.25)",
                      animation,
                    }}
                  >
                    {isCenter ? (
                      <>
                        <video
                          ref={videoRef}
                          key={slide.id}
                          src={slide.videoUrl}
                          loop
                          muted={isMuted}
                          playsInline
                          className="w-full h-full object-cover"
                        />

                        <button
                          onClick={(event) => { event.stopPropagation(); togglePlay(); }}
                          aria-label={isPlaying ? "Pause" : "Play"}
                          className="absolute top-3 left-3 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 hover:bg-white transition-colors shadow"
                        >
                          {isPlaying ? <Pause className="h-4 w-4 text-gray-800" /> : <Play className="h-4 w-4 text-gray-800" />}
                        </button>

                        <button
                          onClick={(event) => { event.stopPropagation(); toggleMute(); }}
                          aria-label={isMuted ? "Unmute" : "Mute"}
                          className="absolute bottom-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
                        </button>
                      </>
                    ) : (
                      <video
                        src={slide.videoUrl}
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

            <button
              onClick={prev}
              aria-label="Previous video"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>

            <button
              onClick={next}
              aria-label="Next video"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          <div className="mt-6 flex justify-center px-4">
            <div
              key={activeSlide.id}
              className="relative flex items-center gap-4 overflow-hidden"
              style={{
                minWidth: 280,
                maxWidth: 460,
                padding: "16px 20px",
                borderRadius: 22,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow:
                  "0 0 0 1px rgba(46,124,138,0.3), " +
                  "0 8px 40px rgba(0,0,0,0.5), " +
                  "0 0 24px rgba(46,124,138,0.12), " +
                  "0 1px 0 rgba(255,255,255,0.2) inset",
                animation,
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 right-0 top-0"
                style={{
                  height: "45%",
                  borderRadius: "22px 22px 50% 50%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.0) 100%)",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  borderRadius: 22,
                  boxShadow: "0 0 18px rgba(78,168,95,0.12) inset",
                }}
              />
              <div className="flex flex-col gap-1 min-w-0">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Active Story
                </p>
                <p
                  className="text-base sm:text-lg font-bold leading-snug"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #7ec8e3 0%, #4a9eba 50%, #3db89a 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {activeSlide.title}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index, index > activeIndex ? "next" : "prev")}
                aria-label={`Go to slide ${index + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: index === activeIndex ? 24 : 8,
                  height: 8,
                  background: index === activeIndex ? "#4ea85f" : "#d1d5db",
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
