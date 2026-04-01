/* ─────────────────────────────────────────────────────────────
   CustomerLogos.tsx  —  "Trusted by Modern Brands" marquee strip
   Server Component  ·  pure-CSS animation (reuses ticker-scroll)
───────────────────────────────────────────────────────────── */

/* ─── Logo data ──────────────────────────────────────────────── */

const logos = [
  {
    name: "Amazon",
    accent: "#FF9900",
    mark: (
      <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Amazon">
        <text x="4" y="28" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="26" fill="currentColor" letterSpacing="-0.5">amazon</text>
        {/* smile arrow */}
        <path d="M8 33 Q32 42 58 35" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M54 32 L58 35 L52 37" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    width: 120,
  },
  {
    name: "Shopify",
    accent: "#96BF48",
    mark: (
      <svg viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Shopify">
        {/* shopping-bag icon */}
        <path d="M10 14 L10 32 L24 32 L24 14 Z" stroke="#96BF48" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
        <path d="M13 14 Q13 8 17 8 Q21 8 21 14" stroke="#96BF48" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <text x="29" y="28" fontFamily="Arial,sans-serif" fontWeight="600" fontSize="20" fill="currentColor">Shopify</text>
      </svg>
    ),
    width: 130,
  },
  {
    name: "Flipkart",
    accent: "#2874F0",
    mark: (
      <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Flipkart">
        {/* spark star */}
        <path d="M10 8 L11.8 14 L18 14 L13 17.5 L15 24 L10 20 L5 24 L7 17.5 L2 14 L8.2 14 Z" fill="#2874F0" opacity="0.9" />
        <text x="24" y="28" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="20" fill="currentColor" fontStyle="italic">Flipkart</text>
      </svg>
    ),
    width: 120,
  },
  {
    name: "Nykaa",
    accent: "#FC2779",
    mark: (
      <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Nykaa">
        {/* stylised N letterform */}
        <rect x="2" y="8" width="14" height="24" rx="2" fill="#FC2779" opacity="0.15" />
        <text x="2" y="30" fontFamily="Georgia,serif" fontWeight="700" fontSize="22" fill="#FC2779">N</text>
        <text x="20" y="29" fontFamily="Arial,sans-serif" fontWeight="400" fontSize="19" fill="currentColor" letterSpacing="0.5">ykaa</text>
        {/* dot */}
        <circle cx="92" cy="10" r="3.5" fill="#FC2779" />
      </svg>
    ),
    width: 100,
  },
  {
    name: "Mamaearth",
    accent: "#6AB04C",
    mark: (
      <svg viewBox="0 0 148 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mamaearth">
        {/* leaf */}
        <path d="M6 30 Q6 10 18 8 Q18 20 6 30Z" fill="#6AB04C" opacity="0.85" />
        <path d="M18 8 Q30 10 30 30 Q18 20 18 8Z" fill="#6AB04C" opacity="0.55" />
        <text x="35" y="28" fontFamily="Arial,sans-serif" fontWeight="600" fontSize="18" fill="currentColor">Mamaearth</text>
      </svg>
    ),
    width: 148,
  },
  {
    name: "boAt",
    accent: "#E31837",
    mark: (
      <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="boAt">
        {/* triangle hull */}
        <path d="M4 30 L20 10 L36 30 Z" fill="#E31837" opacity="0.9" />
        <text x="42" y="29" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="22" fill="currentColor">At</text>
      </svg>
    ),
    width: 80,
  },
  {
    name: "Myntra",
    accent: "#FF3F6C",
    mark: (
      <svg viewBox="0 0 108 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Myntra">
        {/* M monogram */}
        <path d="M4 30 L4 12 L14 24 L24 12 L24 30" stroke="#FF3F6C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="30" y="29" fontFamily="Arial,sans-serif" fontWeight="600" fontSize="19" fill="currentColor">yntra</text>
      </svg>
    ),
    width: 108,
  },
  {
    name: "SUGAR",
    accent: "#E8572A",
    mark: (
      <svg viewBox="0 0 110 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Sugar Cosmetics">
        {/* diamond */}
        <path d="M12 6 L20 14 L12 22 L4 14 Z" fill="#E8572A" opacity="0.85" />
        <text x="28" y="28" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="20" fill="currentColor" letterSpacing="2">SUGAR</text>
      </svg>
    ),
    width: 110,
  },
];

/* ─── Component ──────────────────────────────────────────────── */

export default function CustomerLogos() {
  return (
    <section
      className="relative bg-[#050810] overflow-hidden"
      aria-label="Trusted by leading brands"
    >
      {/* Top separator */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.06) 75%, transparent)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-4">

        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-[10px] font-bold tracking-[0.35em] uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Social Proof
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Trusted by Modern Brands
          </h2>
          <p
            className="text-sm leading-relaxed max-w-md mx-auto"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Hundreds of ecommerce brands rely on Pethiyan for premium
            packaging solutions.
          </p>
        </div>

      </div>

      {/* ── Scrolling logo strip ── */}
      <div className="relative pb-16">

        {/* Left fade mask */}
        <div
          className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #050810 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        {/* Right fade mask */}
        <div
          className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, #050810 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Scrolling track — reuses ticker-scroll keyframe at 40s */}
        <div
          className="flex items-center whitespace-nowrap hover:[animation-play-state:paused]"
          style={{ animation: "ticker-scroll 40s linear infinite" }}
        >

          {/* Original set */}
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="inline-flex items-center justify-center shrink-0 mx-10 h-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-default"
              style={{
                color: "rgba(255,255,255,0.9)",
                "--logo-accent": logo.accent,
              } as React.CSSProperties}
              aria-label={logo.name}
            >
              <div style={{ width: logo.width, height: 40 }}>
                {logo.mark}
              </div>
            </div>
          ))}

          {/* Duplicate set — seamless loop */}
          <span aria-hidden="true" className="contents">
            {logos.map((logo) => (
              <div
                key={`dup-${logo.name}`}
                className="inline-flex items-center justify-center shrink-0 mx-10 h-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-default"
                style={{
                  color: "rgba(255,255,255,0.9)",
                  "--logo-accent": logo.accent,
                } as React.CSSProperties}
                aria-label={logo.name}
              >
                <div style={{ width: logo.width, height: 40 }}>
                  {logo.mark}
                </div>
              </div>
            ))}
          </span>

        </div>
      </div>

      {/* Bottom separator */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 75%, transparent)",
        }}
        aria-hidden="true"
      />

    </section>
  );
}
