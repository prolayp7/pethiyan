"use client";

export default function OfferTickerClient({ items }: { items: string[] }) {
  const tickerItems = [...items, ...items];

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
