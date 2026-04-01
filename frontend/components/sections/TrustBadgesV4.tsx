"use client";

import { useEffect, useRef, useState } from "react";
import { Truck, RefreshCcw, ShieldCheck, FileText, Headphones } from "lucide-react";
import Container from "@/components/layout/Container";

// Gradient spread: #6ea8d8 (blue) → #2e7c8a (teal) → #4ea85f (green)
const ICON_COLORS = ["#6ea8d8", "#4a96b0", "#2e7c8a", "#3d9472", "#4ea85f"];
// Background opacity: deep (left) → light (right)
const ICON_BG_OPACITY = ["55", "48", "3e", "33", "28"];

const badges = [
  { icon: Truck,        title: "Free Shipping",   subtitle: "On orders above ₹999"           },
  { icon: RefreshCcw,   title: "Easy Returns",     subtitle: "7-day hassle-free returns"       },
  { icon: ShieldCheck,  title: "Secure Payment",   subtitle: "100% protected checkout"         },
  { icon: FileText,     title: "GST Invoice",      subtitle: "Valid tax invoice on every order" },
  { icon: Headphones,   title: "24/7 Support",     subtitle: "Dedicated customer care"         },
];

export default function TrustBadges() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Trigger stagger animation when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes tb-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tb-icon-pulse {
          0%   { transform: scale(1);    }
          30%  { transform: scale(1.18); }
          55%  { transform: scale(0.93); }
          75%  { transform: scale(1.06); }
          100% { transform: scale(1);    }
        }
        @keyframes tb-glow {
          0%, 100% { box-shadow: 0 0 0px rgba(var(--color-primary-rgb, 46,124,95), 0);    }
          50%       { box-shadow: 0 0 10px rgba(var(--color-primary-rgb, 46,124,95), 0.35); }
        }
        .tb-item { opacity: 0; }
        .tb-item.visible {
          animation: tb-fade-up 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .tb-icon-wrap.visible {
          animation:
            tb-glow     3s ease-in-out infinite,
            tb-icon-pulse 3s ease-in-out infinite;
        }
        .tb-icon.visible {
          animation: tb-icon-pulse 3s ease-in-out infinite;
        }
        @keyframes tb-title-shimmer {
          0%, 100% { opacity: 1;    letter-spacing: normal;      }
          45%       { opacity: 0.7; letter-spacing: 0.04em;      }
          50%       { opacity: 1;   letter-spacing: 0.06em;      }
          55%       { opacity: 0.7; letter-spacing: 0.04em;      }
        }
        @keyframes tb-subtitle-fade {
          0%, 100% { opacity: 0.6; transform: translateY(0);   }
          50%       { opacity: 1;   transform: translateY(-1px); }
        }
        .tb-title.visible {
          animation: tb-title-shimmer 3s ease-in-out infinite;
        }
        .tb-subtitle.visible {
          animation: tb-subtitle-fade 3s ease-in-out infinite;
        }
      `}</style>

      <section
        ref={ref}
        className="bg-white border-y border-(--color-border)"
        aria-label="Trust badges"
      >
        <Container>
          <div className="py-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-(--color-border)">
            {badges.map(({ icon: Icon, title, subtitle }, i) => (
              <div
                key={title}
                className={`tb-item flex items-center gap-3 px-4 py-3 first:pl-0 last:pr-0${visible ? " visible" : ""}`}
                style={{ animationDelay: visible ? `${i * 90}ms` : undefined }}
              >
                <div
                  className={`tb-icon-wrap shrink-0 w-9 h-9 rounded-xl flex items-center justify-center${visible ? " visible" : ""}`}
                  style={{
                    background: `${ICON_COLORS[i]}${ICON_BG_OPACITY[i]}`,
                    animationDelay: visible ? `${i * 600}ms` : undefined,
                  }}
                >
                  <Icon
                    className={`tb-icon h-4 w-4${visible ? " visible" : ""}`}
                    style={{ color: ICON_COLORS[i], animationDelay: visible ? `${i * 600}ms` : undefined }}
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className={`tb-title text-xs font-bold text-(--color-secondary) truncate${visible ? " visible" : ""}`}
                    style={{ animationDelay: visible ? `${i * 600}ms` : undefined }}
                  >
                    {title}
                  </p>
                  <p
                    className={`tb-subtitle text-[10px] text-gray-400 leading-snug truncate${visible ? " visible" : ""}`}
                    style={{ animationDelay: visible ? `${i * 600}ms` : undefined }}
                  >
                    {subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
