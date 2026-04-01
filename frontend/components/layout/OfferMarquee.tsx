/* ─────────────────────────────────────────────────────────────
   OfferMarquee.tsx  —  Scrolling promotional offer strip
   Server Component · reuses animate-ticker from globals.css
───────────────────────────────────────────────────────────── */

const offerItems = [
  { prefix: "Free Shipping", text: "on orders over $500" },
  { prefix: "Custom Packaging", text: "ready in 7 business days" },
  { prefix: "Bulk Discounts", text: "up to 30% off on wholesale orders" },
  { prefix: "Eco-Friendly", text: "materials across all product lines" },
  { prefix: "New Arrivals", text: "biodegradable standup pouches" },
  { prefix: "Design Support", text: "free artwork review with every order" },
];

export default function OfferMarquee() {
  return (
    <div
      className="relative overflow-hidden border-b"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
    >
      {/* Left fade mask */}
      <div
        className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #050810 0%, transparent 100%)" }}
        aria-hidden="true"
      />
      {/* Right fade mask */}
      <div
        className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #050810 0%, transparent 100%)" }}
        aria-hidden="true"
      />

      {/* Scrolling track */}
      <div
        className="flex items-center animate-ticker hover:[animation-play-state:paused] whitespace-nowrap py-3"
        aria-label="Promotional offers"
      >
        {/* Original set */}
        {offerItems.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 shrink-0">
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase">
              {item.prefix && (
                <span style={{ color: "#4caf50" }}>{item.prefix} </span>
              )}
              <span style={{ color: "rgba(255,255,255,0.45)" }}>{item.text}</span>
            </span>
            <span
              className="w-1 h-1 rounded-full shrink-0"
              style={{ background: "rgba(76,175,80,0.4)" }}
              aria-hidden="true"
            />
          </span>
        ))}

        {/* Duplicate set — seamless loop */}
        <span aria-hidden="true" className="contents">
          {offerItems.map((item, i) => (
            <span key={`dup-${i}`} className="inline-flex items-center gap-4 shrink-0">
              <span className="text-[10px] font-semibold tracking-[0.22em] uppercase">
                {item.prefix && (
                  <span style={{ color: "#4caf50" }}>{item.prefix} </span>
                )}
                <span style={{ color: "rgba(255,255,255,0.45)" }}>{item.text}</span>
              </span>
              <span
                className="w-1 h-1 rounded-full shrink-0"
                style={{ background: "rgba(76,175,80,0.4)" }}
                aria-hidden="true"
              />
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
