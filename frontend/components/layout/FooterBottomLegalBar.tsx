import Link from "next/link";
import Image from "next/image";
import { type LucideIcon } from "lucide-react";

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
  socialLinks: SocialLink[];
};

export default function FooterBottomLegalBar({
  legalLinks,
  socialLinks,
}: FooterBottomLegalBarProps) {
  const paymentMethods = ["Visa", "Rupay", "Paytm", "PhonePay", "GPay", "NetBanking"];

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Row 1: Social icons · Company text · Payment Partners */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5 shrink-0 order-last sm:order-first">
            {socialLinks.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:brightness-125"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>


          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.28)" }}>
              Payment Partners:
            </span>
            <div
              className="relative overflow-hidden rounded-md bg-white"
              style={{
                width: "144px",
                minWidth: "144px",
                maxWidth: "144px",
                height: "40px",
                flex: "0 0 144px",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <Image
                src="/images/logos/razorpay.png"
                alt="Razorpay"
                fill
                sizes="144px"
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <div
              className="relative overflow-hidden rounded-md bg-white"
              style={{
                width: "144px",
                minWidth: "144px",
                maxWidth: "144px",
                height: "40px",
                flex: "0 0 144px",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <Image
                src="/images/logos/Easebuzz_Logo.jpg"
                alt="Easebuzz"
                fill
                sizes="144px"
                className="object-contain p-2"
                unoptimized
              />
            </div>
          </div>
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

        {/* Row 3: Copyright */}
        <p className="text-center text-[10px] mt-5" style={{ color: "rgba(255,255,255,0.20)" }}>
          © {new Date().getFullYear()} Pethiyan Packaging Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
}
