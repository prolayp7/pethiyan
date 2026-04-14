import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { getSystemSettings } from "@/lib/api";

const socialLinks = [
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "X", href: "#", icon: null },
];

export default async function FooterBrandStrip() {
  const system = await getSystemSettings();
  const appName = system?.appName || "Pethiyan";
  const logoSrc = system?.logo || "/pethiyan-logo.png";

  return (
    <div
      className="border-y"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.98)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-6 flex items-center justify-between gap-6">
        <Link href="/" className="inline-flex items-center" aria-label={`${appName} home`}>
          <Image
            src={logoSrc}
            alt={appName}
            width={220}
            height={64}
            className="h-12 sm:h-14 w-auto object-contain"
            unoptimized
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3" aria-label="Social links">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-11 h-11 rounded-full border border-[#d9dde5] text-[#1a2d4a] hover:text-[#0f2444] hover:border-[#b9c4d6] hover:bg-[#f6f9ff] flex items-center justify-center transition-all duration-200"
            >
              {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : <span className="text-xl leading-none font-light">x</span>}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
