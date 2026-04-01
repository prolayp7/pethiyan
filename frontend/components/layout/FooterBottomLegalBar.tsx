import Link from "next/link";
import { Leaf, ShieldCheck, type LucideIcon } from "lucide-react";

type LegalLink = {
  label: string;
  href: string;
};

type SocialLink = {
  label: string;
  icon: LucideIcon;
  href: string;
};

type FooterBottomLegalBarProps = {
  legalLinks: LegalLink[];
  paymentMethods: string[];
  socialLinks: SocialLink[];
};

export default function FooterBottomLegalBar({
  legalLinks,
  paymentMethods,
  socialLinks,
}: FooterBottomLegalBarProps) {
  return (
    <div
      className="border-t"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
    >
      <div
        className="h-px w-full -mt-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(76,175,80,0.1) 30%, rgba(76,175,80,0.1) 70%, transparent)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-7">
        {/* Row 1 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5 shrink-0 order-last sm:order-first">
            <div
              className="flex items-center gap-1.5 border rounded px-2.5 py-1.5"
              style={{ borderColor: "rgba(76,175,80,0.22)" }}
            >
              <Leaf
                className="h-3 w-3 shrink-0"
                style={{ color: "rgba(76,175,80,0.6)" }}
                aria-hidden="true"
              />
              <span
                className="text-[8px] font-bold tracking-[0.18em] uppercase leading-tight"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Eco
                <br />
                Certified
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 border rounded px-2.5 py-1.5"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <ShieldCheck
                className="h-3 w-3 shrink-0"
                style={{ color: "rgba(255,255,255,0.25)" }}
                aria-hidden="true"
              />
              <span
                className="text-[8px] font-bold tracking-[0.18em] uppercase leading-tight"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                ISO
                <br />
                9001
              </span>
            </div>
          </div>

          <p
            className="text-[10px] text-center leading-relaxed"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            Pethiyan Packaging Pvt. Ltd.&nbsp;&nbsp;·&nbsp;&nbsp;CIN
            U74999MH2020PTC345678&nbsp;&nbsp;·&nbsp;&nbsp;GST 27AABCP1234F1Z5
          </p>

          <nav className="flex items-center gap-5 shrink-0" aria-label="Legal links">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-medium hover:text-white transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Row 2: Payment methods */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="inline-flex items-center justify-center rounded px-2.5 py-1 text-[9px] font-semibold tracking-widest uppercase border"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.32)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {method}
            </span>
          ))}
        </div>

        {/* Row 3: Social icons */}
        <div className="flex items-center justify-center gap-3 mt-5">
          {socialLinks.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:brightness-125"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
