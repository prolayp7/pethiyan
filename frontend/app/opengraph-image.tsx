import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pethiyan — The Power of Perfect Packaging";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0f2f5f 0%, #1f4f8a 50%, #163d6e 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(76,175,80,0.2), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(76,175,80,0.15), transparent 70%)",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(255,255,255,0.2)",
            }}
          >
            {/* Package icon */}
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m3.3 7 8.7 5 8.7-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "white",
            letterSpacing: "-2px",
            marginBottom: 8,
            lineHeight: 1,
          }}
        >
          Pethiyan
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#4caf50",
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          The Power of Perfect Packaging
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.65)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          Premium pouches, kraft bags &amp; eco-friendly packaging
          for 50,000+ businesses across India
        </div>

        {/* Trust badges row */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 40,
          }}
        >
          {["Free Shipping ₹999+", "GST Invoice", "Pan-India Delivery"].map((badge) => (
            <div
              key={badge}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 100,
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.85)",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              ✓ {badge}
            </div>
          ))}
        </div>

        {/* Domain watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 32,
            fontSize: 16,
            color: "rgba(255,255,255,0.3)",
            fontWeight: 600,
          }}
        >
          pethiyan.com
        </div>
      </div>
    ),
    { ...size }
  );
}
