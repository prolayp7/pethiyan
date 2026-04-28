import Link from "next/link";
import Image from "next/image";
import { Facebook, Globe, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, Send, Twitter, type LucideIcon, Youtube } from "lucide-react";
import FooterUserLinks from "./FooterUserLinks";

type NavLink = { label: string; href: string };
type NavColumn = { title: string; links: NavLink[] };
type SocialLink = { label: string; href: string; platform?: string };

type FooterBrand = {
  appName: string;
  logo: string | null;
  footerLogo: string | null;
  address: string;
  supportEmail: string;
  supportNumber: string;
  shortDescription?: string;
  companyGstin?: string;
};

type FooterNavigationGridProps = {
  brand?: FooterBrand | null;
  navColumns: NavColumn[];
  socialLinks: SocialLink[];
};

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  whatsapp: MessageCircle,
  telegram: Send,
};

export default function FooterNavigationGrid({
  brand,
  navColumns,
  socialLinks,
}: FooterNavigationGridProps) {
  const appName = brand?.appName || "Pethiyan";
  const logoSrc = brand?.footerLogo || brand?.logo || "/pethiyan-logo.png";
  const contactAddress = brand?.address?.trim() || "";
  const contactPhone = brand?.supportNumber?.trim() || "";
  const contactEmail = brand?.supportEmail?.trim() || "";

  return (
    <div className="relative bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 lg:pt-10 lg:pb-8 relative z-10">

        {/* Top: brand left, nav columns right */}
        <div className="flex flex-col lg:flex-row gap-0">

          {/* Column 1 — Logo + Business Contact */}
          <div className="pb-8 lg:pb-0 lg:pr-10 shrink-0 lg:w-[280px]">
            <Link href="/" aria-label={`${appName} home`} className="inline-flex mb-6">
              <div className="relative w-40 h-13">
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
              {contactAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-3.75 h-3.75 mt-0.5 shrink-0 text-gray-400" />
                  <span className="text-sm leading-snug text-gray-500">
                    {contactAddress}
                  </span>
                </div>
              )}
              {contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-3.75 h-3.75 shrink-0 text-gray-400" />
                  <span className="text-sm text-gray-500">{contactPhone}</span>
                </div>
              )}
              {contactEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="w-3.75 h-3.75 shrink-0 text-gray-400" />
                  <span className="text-sm text-gray-500">{contactEmail}</span>
                </div>
              )}
            </div>
            {(contactAddress || contactPhone || contactEmail) && (
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 mt-6 text-sm font-medium text-gray-700 underline underline-offset-4 transition-colors hover:text-gray-900"
              >
                Get Direction <span aria-hidden="true" className="text-xs">↗</span>
              </Link>
            )}
          </div>

          {/* Column 2 - About Company */}
          {(brand?.shortDescription || brand?.companyGstin) && (
            <div className="py-8 lg:py-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:px-10 shrink-0 lg:w-[280px]">
              <h3 className="font-bold text-[15px] mb-5 text-gray-900">
                About Company
              </h3>
              {brand?.shortDescription && (
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  {brand.shortDescription}
                </p>
              )}
              {brand?.companyGstin && (
                <div className="inline-flex items-baseline gap-2 rounded-md bg-gray-50 border border-gray-100 px-3 py-2">
                  <span className="text-xs font-semibold text-gray-700">GSTIN:</span>
                  <span className="text-xs font-medium text-gray-900 uppercase tracking-widest">{brand.companyGstin}</span>
                </div>
              )}
            </div>
          )}

          {/* Nav columns */}
          <div className="pt-8 lg:pt-0 lg:pl-10 border-t lg:border-t-0 lg:border-l border-gray-100 lg:ml-auto w-full lg:w-auto grid grid-cols-2 md:grid-cols-4 gap-8 lg:grow">
            {navColumns.slice(0, 4).map((col) => (
              <div key={col.title}>
                <h3 className="font-bold text-[15px] mb-4 text-gray-900">
                  {col.title}
                </h3>
                {col.title === "Users" ? (
                  <FooterUserLinks links={col.links} />
                ) : (
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
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Bottom: social icons left, payment partners right */}
        <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-5 md:flex-row md:items-center md:justify-between">

          {/* Social icons */}
          <div className="flex items-center gap-2.5">
            {socialLinks.map(({ label, href, platform }) => {
              const Icon = SOCIAL_ICON_MAP[(platform ?? label).toLowerCase()] ?? Globe;

              return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 text-white transition-all duration-200 hover:bg-gray-700"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              );
            })}
          </div>

          {/* Payment Partners */}
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500 md:text-[10px]">
              Payment Partners:
            </span>
            {/* keep both logos together so they never split across wrapped rows */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-24 overflow-hidden rounded border border-gray-200 bg-white p-1.5 md:h-9 md:w-29 md:p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logos/razorpay.png"
                  alt="Razorpay"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="h-8 w-24 overflow-hidden rounded border border-gray-200 bg-white p-1.5 md:h-9 md:w-29 md:p-2">
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
