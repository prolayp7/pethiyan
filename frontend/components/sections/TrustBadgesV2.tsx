"use client";

import { useEffect, useRef, useState } from "react";
import { Truck, RefreshCcw, ShieldCheck, FileText, Headphones } from "lucide-react";
import Container from "@/components/layout/Container";

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
        @keyframes tb-icon-pop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.22); }
          70%  { transform: scale(0.92); }
          100% { transform: scale(1); }
        }
        .tb-item { opacity: 0; }
        .tb-item.visible {
          animation: tb-fade-up 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .tb-item:hover .tb-icon {
          animation: tb-icon-pop 400ms ease forwards;
        }
        .tb-item:hover .tb-icon-wrap {
          background-color: var(--color-primary);
          transition: background-color 250ms ease;
        }
        .tb-item:hover .tb-icon-wrap svg {
          color: #fff;
          transition: color 250ms ease;
        }
        .tb-item:hover .tb-title {
          color: var(--color-primary);
          transition: color 250ms ease;
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
                className={`tb-item flex items-center gap-3 px-4 py-3 first:pl-0 last:pr-0 cursor-default${visible ? " visible" : ""}`}
                style={{ animationDelay: visible ? `${i * 90}ms` : undefined }}
              >
                <div className="tb-icon-wrap shrink-0 w-9 h-9 rounded-xl bg-(--color-primary)/10 flex items-center justify-center transition-colors duration-250">
                  <Icon className="tb-icon h-4 w-4 text-(--color-primary)" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="tb-title text-xs font-bold text-(--color-secondary) truncate transition-colors duration-250">{title}</p>
                  <p className="text-[10px] text-gray-400 leading-snug truncate">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
