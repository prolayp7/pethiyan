"use client";

import { useEffect, useRef, useState } from "react";
import {
  Package,
  Zap, ShieldCheck, IndianRupee,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const benefits = [
  { icon: Package,      label: "Wide Product Range",         value: "50+",    sub: "packaging solutions"       },
  { icon: IndianRupee,  label: "Wholesale Pricing",          value: "30%",    sub: "cheaper than retail"       },
  { icon: ShieldCheck,  label: "Food-Grade Quality",         value: "100%",   sub: "certified materials"       },
  { icon: Zap,          label: "Fast Delivery",              value: "PAN",    sub: "India delivery"            },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PackagingSolutions() {
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
        @keyframes ps-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ps-counter {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        .ps-animate { opacity: 0; }
        .ps-animate.show {
          animation: ps-fade-up 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .ps-counter.show {
          animation: ps-counter 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .ps-card:hover .ps-card-icon {
          transform: scale(1.12);
          transition: transform 300ms ease;
        }
      `}</style>

      <section
        ref={ref}
        className="relative overflow-hidden"
        style={{ background: "#ffffff" }}
      >
        {/* Intentionally no overlays: keep section pure white */}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">

          {/* ── Hero Header ─────────────────────────────────────────── */}
          <div
            className={`ps-animate text-left max-w-4xl mb-16${visible ? " show" : ""}`}
            style={{ animationDelay: "0ms" }}
          >
            <p
              className="text-xs font-bold tracking-[0.22em] uppercase mb-3"
              style={{ color: "rgba(78,168,95,0.9)" }}
            >
              Complete Packaging Solutions
            </p>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-5"
              style={{
                backgroundImage: "linear-gradient(135deg, #6ea8d8 0%, #2e7c8a 42%, #4ea85f 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Pethiyan – India's Trusted Packaging Partner
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "rgba(15,36,68,0.68)" }}>
              From small businesses to large manufacturers — we supply high-quality, affordable packaging
              products across India. One destination for all your packaging needs.
            </p>
          </div>

          {/* ── Benefit Strip ───────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {benefits.map(({ icon: Icon, label, value, sub }, i) => (
              <div
                key={label}
                className={`ps-counter${visible ? " show" : ""} rounded-2xl p-5 text-center`}
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(15,36,68,0.08)",
                  boxShadow: "0 8px 24px rgba(15,36,68,0.08)",
                  animationDelay: visible ? `${120 + i * 80}ms` : undefined,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: "rgba(78,168,95,0.15)" }}
                >
                  <Icon className="h-5 w-5" style={{ color: "#4ea85f" }} />
                </div>
                <p className="text-2xl font-black text-[#0f2444]">{value}</p>
                <p className="text-xs font-bold mt-0.5" style={{ color: "#4ea85f" }}>{label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(15,36,68,0.52)" }}>{sub}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
