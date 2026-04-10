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
    <div className="relative bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-18 relative z-10">

        {/* ── Content: brand left, nav right ── */}
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

          {/* Nav columns + Payment Partners */}
          <div className="pt-8 md:pt-0 md:pl-10 ml-auto grid grid-cols-5 gap-10">
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

            {/* Payment Partners column */}
            <div>
              <h3 className="font-bold text-[15px] mb-4 text-gray-900">
                Payment Partners
              </h3>
              <div className="flex flex-col gap-3">
                <div className="relative w-[120px] h-[38px] rounded-md overflow-hidden border border-gray-200 bg-white">
                  <Image
                    src="/images/logos/razorpay.png"
                    alt="Razorpay"
                    fill
                    sizes="120px"
                    className="object-contain p-1.5"
                    unoptimized
                  />
                </div>
                <div className="relative w-[120px] h-[38px] rounded-md overflow-hidden border border-gray-200 bg-white">
                  <Image
                    src="/images/logos/Easebuzz_Logo.jpg"
                    alt="Easebuzz"
                    fill
                    sizes="120px"
                    className="object-contain p-1.5"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
