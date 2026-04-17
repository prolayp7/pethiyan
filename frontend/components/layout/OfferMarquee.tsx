"use client";

import { usePathname } from "next/navigation";
import type { ApiFooterHighlightTickerItem } from "@/lib/api";

interface OfferMarqueeProps {
  homepageOnly?: boolean;
  items?: ApiFooterHighlightTickerItem[];
}

export default function OfferMarquee({ homepageOnly = true, items = [] }: OfferMarqueeProps) {
  const pathname = usePathname();

  if (homepageOnly && pathname !== "/") {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden border-b border-white/5"
    >
      {/* Left fade mask */}
      <div
        className="absolute inset-y-0 left-0 z-10 w-16 pointer-events-none bg-[linear-gradient(to_right,#050810_0%,transparent_100%)]"
        aria-hidden="true"
      />
      {/* Right fade mask */}
      <div
        className="absolute inset-y-0 right-0 z-10 w-16 pointer-events-none bg-[linear-gradient(to_left,#050810_0%,transparent_100%)]"
        aria-hidden="true"
      />

      {/* Scrolling track */}
      <div
        className="flex items-center animate-ticker hover:[animation-play-state:paused] whitespace-nowrap py-3"
        aria-label="Promotional offers"
      >
        {/* Original set */}
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 shrink-0">
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase">
              {item.highlight && (
                <span className="text-[#4caf50]">{item.highlight} </span>
              )}
              <span className="text-white/45">{item.text}</span>
            </span>
            <span
              className="h-1 w-1 shrink-0 rounded-full bg-[#4caf5066]"
              aria-hidden="true"
            />
          </span>
        ))}

        {/* Duplicate set — seamless loop */}
        <span aria-hidden="true" className="contents">
          {items.map((item, i) => (
            <span key={`dup-${i}`} className="inline-flex items-center gap-4 shrink-0">
              <span className="text-[10px] font-semibold tracking-[0.22em] uppercase">
                {item.highlight && (
                  <span className="text-[#4caf50]">{item.highlight} </span>
                )}
                <span className="text-white/45">{item.text}</span>
              </span>
              <span
                className="h-1 w-1 shrink-0 rounded-full bg-[#4caf5066]"
                aria-hidden="true"
              />
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
