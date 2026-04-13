"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const whyUs = [
  "Wide range of packaging products for every industry",
  "Affordable wholesale pricing for small & large businesses",
  "High-quality, food-grade materials throughout",
  "Custom packaging & printing solutions available",
  "Fast delivery across India with reliable logistics",
  "Trusted by thousands of eCommerce sellers and brands",
];

export default function BrandStory() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const mobileSliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  function scrollMobileCards(direction: "prev" | "next") {
    const el = mobileSliderRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-why-slide]");
    const gap = 16;
    const cardWidth = firstCard?.offsetWidth ?? el.clientWidth * 0.88;
    const amount = cardWidth + gap;
    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <>
      <style>{`
        @keyframes bs-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bs-item { opacity: 0; }
        .bs-item.show { animation: bs-fade-up 550ms cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>

      <section
        ref={ref}
        className="relative overflow-hidden pt-10 pb-8 sm:py-16 lg:py-20"
        style={{ background: "linear-gradient(140deg, #071023 0%, #0c1d38 50%, #0f2444 100%)" }}
        aria-labelledby="brand-heading"
      >
        {/* Grid overlay */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(70,190,150,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(70,190,150,0.045) 1px, transparent 1px),
            linear-gradient(rgba(60,130,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(60,130,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "10px 10px, 10px 10px, 50px 50px, 50px 50px",
        }} />
        {/* Corner glows */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 55% 55% at 100% 0%, rgba(46,124,138,0.22) 0%, transparent 70%)" }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 55% 55% at 0% 100%, rgba(78,168,95,0.18) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div
            className={`bs-item text-left max-w-4xl mb-12${visible ? " show" : ""}`}
            style={{ animationDelay: "0ms" }}
          >
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "rgba(78,168,95,0.9)" }}>
              Why Choose Us
            </p>
            <h2
              id="brand-heading"
              className="text-3xl sm:text-4xl font-extrabold"
              style={{
                backgroundImage: "linear-gradient(135deg, #6ea8d8 0%, #2e7c8a 42%, #4ea85f 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Why Buy from Pethiyan?
            </h2>
            <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              From small businesses to large manufacturers — we're your trusted packaging partner across India.
            </p>
          </div>

          {/* Mobile slider */}
          <div className="sm:hidden">
            <div
              ref={mobileSliderRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
              aria-label="Why choose us slider"
            >
              {whyUs.map((item, i) => (
                <div
                  key={i}
                  data-why-slide
                  className={`bs-item w-[calc(100vw-3rem)] max-w-full shrink-0 snap-start rounded-2xl p-5${visible ? " show" : ""}`}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    animationDelay: visible ? `${80 + i * 70}ms` : undefined,
                  }}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "#4ea85f" }} />
                    <span
                      className="min-w-0 text-sm leading-relaxed whitespace-normal break-words"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {item}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => scrollMobileCards("prev")}
                aria-label="Scroll why choose us cards left"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0f2444]/90 text-white shadow-sm transition-colors hover:bg-[#143154]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollMobileCards("next")}
                aria-label="Scroll why choose us cards right"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0f2444]/90 text-white shadow-sm transition-colors hover:bg-[#143154]"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Why Us grid */}
          <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((item, i) => (
              <div
                key={i}
                className={`bs-item flex min-h-[4rem] items-center gap-3 rounded-2xl px-5 py-4${visible ? " show" : ""}`}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  animationDelay: visible ? `${80 + i * 70}ms` : undefined,
                }}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "#4ea85f" }} />
                <span
                  className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-relaxed"
                  title={item}
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
