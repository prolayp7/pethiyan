import Link from "next/link";
import Image from "next/image";

export default function FooterBrandIdentityBand() {
  return (
    <div
      className="watermark-band relative overflow-hidden border-t"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
    >
      <p
        className="watermark-text absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-black uppercase leading-none select-none pointer-events-none whitespace-nowrap"
        style={{
          fontSize: "clamp(5rem, 19vw, 19rem)",
          letterSpacing: "-0.04em",
        }}
        aria-hidden="true"
      >
        PETHIYAN
      </p>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <Link href="/" aria-label="Pethiyan - Home" className="inline-block">
              <Image
                src="/pethiyan-logo.png"
                alt="Pethiyan"
                width={120}
                height={120}
                className="h-10 sm:h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p
              className="mt-3 text-xs font-bold tracking-[0.22em] uppercase"
              style={{ color: "rgba(76,175,80,0.8)" }}
            >
              The Power of Perfect Packaging
            </p>
          </div>
          <p className="text-sm text-white/35 max-w-sm leading-relaxed md:text-right">
            Premium packaging solutions engineered for modern ecommerce brands.
            From concept to courier - crafted with purpose.
          </p>
        </div>
      </div>
    </div>
  );
}
