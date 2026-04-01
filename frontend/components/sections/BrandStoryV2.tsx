"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

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
        className="relative overflow-hidden py-16 lg:py-20"
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
            className={`bs-item text-center max-w-2xl mx-auto mb-12${visible ? " show" : ""}`}
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

          {/* Why Us grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyUs.map((item, i) => (
              <div
                key={i}
                className={`bs-item flex items-start gap-3 rounded-2xl p-5${visible ? " show" : ""}`}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  animationDelay: visible ? `${80 + i * 70}ms` : undefined,
                }}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#4ea85f" }} />
                <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{item}</span>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
