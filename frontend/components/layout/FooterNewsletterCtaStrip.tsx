import FooterNewsletter from "./FooterNewsletter";

export default function FooterNewsletterCtaStrip() {
  return (
    <div className="relative">
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.07) 25%, rgba(255,255,255,0.07) 75%, transparent)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 90% at 10% 60%, rgba(31,79,138,0.2) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/25 mb-5">
              Newsletter
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold leading-[1.04] tracking-tight">
              Stay connected with
              <br />
              <em className="not-italic font-light text-white/45">
                the future of
              </em>
              <br />
              packaging
              <span style={{ color: "#4caf50" }}>.</span>
            </h2>
            <p className="mt-5 text-sm text-white/35 leading-relaxed max-w-xs">
              Get product updates, new launches and exclusive insights
              delivered to your inbox.
            </p>
          </div>
          <div className="lg:pl-8">
            <FooterNewsletter />
          </div>
        </div>
      </div>
    </div>
  );
}
