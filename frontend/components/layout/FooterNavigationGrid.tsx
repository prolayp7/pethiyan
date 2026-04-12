import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, type LucideIcon } from "lucide-react";
import { getSystemSettings } from "@/lib/api";

type NavLink = { label: string; href: string };
type NavColumn = { title: string; links: NavLink[] };
type SocialLink = { label: string; icon: LucideIcon; href: string };

type FooterNavigationGridProps = {
  navColumns: NavColumn[];
  socialLinks: SocialLink[];
};

export default async function FooterNavigationGrid({
  navColumns,
  socialLinks,
}: FooterNavigationGridProps) {
  const system = await getSystemSettings();
  const appName = system?.appName || "Pethiyan";
  const logoSrc = system?.logo || "/pethiyan-logo.png";

  return (
    <div className="relative bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 lg:pt-10 lg:pb-8 relative z-10">

        {/* Top: brand left, nav columns right */}
        <div className="flex flex-col md:flex-row gap-0">

          {/* Column 1 — Logo + Business Contact */}
          <div className="pb-8 md:pb-0 md:pr-10">
            <Link href="/" aria-label={`${appName} home`} className="inline-flex mb-6">
              <div className="relative w-40 h-[52px]">
                <Image
                  src={logoSrc}
                  alt={appName}
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
            </Link>
            <h3 className="font-bold text-[15px] mb-5 text-gray-900">
              Business Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-[15px] h-[15px] mt-0.5 shrink-0 text-gray-400" />
                <span className="text-sm leading-snug text-gray-500">
                  123 Example St, Sydney, NSW 2000, Australia
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-[15px] h-[15px] shrink-0 text-gray-400" />
                <span className="text-sm text-gray-500">+61 2 1234 5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-[15px] h-[15px] shrink-0 text-gray-400" />
                <span className="text-sm text-gray-500">support@pethiyan.com</span>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 mt-6 text-sm font-medium text-gray-700 underline underline-offset-4 transition-colors hover:text-gray-900"
            >
              Get Direction <span aria-hidden="true" className="text-xs">↗</span>
            </Link>
          </div>

          {/* Nav columns */}
          <div className="pt-8 md:pt-0 md:pl-10 ml-auto grid grid-cols-4 gap-10">
            {navColumns.slice(0, 4).map((col) => (
              <div key={col.title}>
                <h3 className="font-bold text-[15px] mb-4 text-gray-900">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150"
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

        {/* Bottom: social icons left, payment partners right */}
        <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-5 md:flex-row md:items-center md:justify-between">

          {/* Social icons */}
          <div className="flex items-center gap-2.5">
            {socialLinks.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 text-white transition-all duration-200 hover:bg-gray-700"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* Payment Partners */}
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500 md:text-[10px]">
              Payment Partners:
            </span>
            {/* keep both logos together so they never split across wrapped rows */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 overflow-hidden rounded border border-gray-200 bg-white p-1.5 md:h-9 md:w-[116px] md:p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logos/razorpay.png"
                  alt="Razorpay"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="h-8 w-24 overflow-hidden rounded border border-gray-200 bg-white p-1.5 md:h-9 md:w-[116px] md:p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logos/Easebuzz_Logo.jpg"
                  alt="Easebuzz"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
