"use client";

const offers = [
  "🔥 20% OFF on Custom Packaging — Limited Time",
  "🚚 Free Shipping on Orders Above $50",
  "⚡ Fast Global Delivery Available",
  "📦 Premium Packaging for Modern Brands",
  "🎁 Bundle & Save — Buy 3 Get 1 Free",
  "🌿 100% Eco-Friendly Material Options",
];

// Duplicate for seamless infinite loop
const tickerItems = [...offers, ...offers];

export default function OfferTicker() {
  return (
    <div
      className="bg-gray-50 border-b border-gray-100 overflow-hidden py-1.5"
      aria-label="Promotional offers"
      role="marquee"
    >
      <div
        className="flex gap-12 w-max animate-ticker hover:[animation-play-state:paused]"
        aria-live="off"
      >
        {tickerItems.map((offer, i) => (
          <span
            key={i}
            className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap flex-shrink-0"
          >
            {offer}
            <span className="mx-6 text-gray-300" aria-hidden="true">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
