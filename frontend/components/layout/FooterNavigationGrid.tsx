import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { getSystemSettings } from "@/lib/api";

type NavLink = { label: string; href: string };
type NavColumn = { title: string; links: NavLink[] };
type FooterNavigationGridProps = {
  navColumns: NavColumn[];
  socialLinks?: unknown[];
};

export default async function FooterNavigationGrid({
  navColumns,
}: FooterNavigationGridProps) {
  const system = await getSystemSettings();
  const appName = system?.appName || "Pethiyan";
  const logoSrc = system?.logo || "/pethiyan-logo.png";

  return (
    <div
      className="relative border-t"
      style={{
        borderColor: "rgba(255,255,255,0.05)",
        background: "linear-gradient(180deg, #040b1a 0%, #050b19 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(94,154,212,0.028) 0.5px, transparent 0.5px),
            linear-gradient(90deg, rgba(94,154,212,0.028) 0.5px, transparent 0.5px)
          `,
          backgroundSize: "16px 16px, 16px 16px",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 lg:py-18 relative z-10">

        {/* ── Content: 2 columns ── */}
        <div className="flex flex-col md:flex-row gap-0">

          {/* Column 1 — Logo + Business Contact */}
          <div className="pb-8 md:pb-0 md:pr-10">
            <Link href="/" aria-label={`${appName} home`} className="inline-flex mb-6">
              <div className="relative" style={{ width: 160, height: 52 }}>
                <Image
                  src={logoSrc}
                  alt={appName}
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
            </Link>
            <h3 className="font-bold text-white text-[15px] mb-5">
              Business Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-[15px] h-[15px] mt-0.5 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
                <span className="text-sm leading-snug" style={{ color: "rgba(255,255,255,0.50)" }}>
                  123 Example St, Sydney, NSW 2000, Australia
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-[15px] h-[15px] shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>+61 2 1234 5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-[15px] h-[15px] shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>support@pethiyan.com</span>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 mt-6 text-sm font-medium underline underline-offset-4 transition-colors"
              style={{ color: "rgba(255,255,255,0.70)" }}
            >
              Get Direction <span aria-hidden="true" className="text-xs">↗</span>
            </Link>

          </div>

          {/* Column 2 — Nav link columns */}
          <div className="pt-8 md:pt-0 md:pl-10 ml-auto grid grid-cols-3 gap-12">
            {navColumns.slice(0, 3).map((col) => (
              <div key={col.title}>
                <h3 className="font-bold text-white text-[15px] mb-4">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm hover:text-white transition-colors duration-150"
                        style={{ color: "rgba(255,255,255,0.50)" }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
