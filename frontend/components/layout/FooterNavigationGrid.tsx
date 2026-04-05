import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MoveRight } from "lucide-react";
import { getSystemSettings } from "@/lib/api";

type NavLink = {
  label: string;
  href: string;
};

type NavColumn = {
  title: string;
  links: NavLink[];
};

type FooterNavigationGridProps = {
  navColumns: NavColumn[];
};

export default async function FooterNavigationGrid({
  navColumns,
}: FooterNavigationGridProps) {
  const system = await getSystemSettings();
  const appName = system?.appName || "Pethiyan";
  const logoSrc = system?.logo || "/pethiyan-logo.png";

  return (
    <div
      className="border-t"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Col 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p
              className="text-[9px] font-bold tracking-[0.35em] uppercase mb-4 select-none"
              style={{ color: "rgba(255,255,255,0.16)" }}
              aria-hidden="true"
            >
              01
            </p>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.18em] mb-6"
              style={{ color: "rgba(255,255,255,0.28)" }}
            >
              Brand
            </p>
            <Link href="/" className="inline-flex items-center mb-6" aria-label={`${appName} home`}>
              <Image
                src={logoSrc}
                alt={appName}
                width={180}
                height={56}
                className="h-12 w-auto object-contain"
                unoptimized
              />
            </Link>
            <p className="text-sm text-white/35 leading-relaxed mb-8 max-w-xs">
              L-Commerce creates premium packaging solutions designed for modern
              brands - built to make every shipment memorable.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/shop"
                className="group inline-flex items-center justify-between gap-6 px-5 py-3 bg-white/6 hover:bg-white/10 border border-white/8 hover:border-white/15 rounded-full text-xs font-semibold text-white/70 hover:text-white transition-all duration-300 max-w-52"
              >
                Explore Products
                <ArrowRight
                  className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform shrink-0"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-between gap-6 px-5 py-3 border border-white/8 hover:border-white/15 rounded-full text-xs font-semibold text-white/45 hover:text-white transition-all duration-300 max-w-52"
              >
                Request a Quote
                <MoveRight
                  className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform shrink-0"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Cols 2-4: Nav */}
          {navColumns.map((col, i) => (
            <div key={col.title}>
              <p
                className="text-[9px] font-bold tracking-[0.35em] uppercase mb-4 select-none"
                style={{ color: "rgba(255,255,255,0.16)" }}
                aria-hidden="true"
              >
                0{i + 2}
              </p>
              <h3
                className="text-[10px] font-bold uppercase tracking-[0.18em] mb-6"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                {col.title}
              </h3>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-0 text-sm text-white/40 hover:text-white transition-colors duration-200"
                    >
                      <span
                        className="block h-px w-0 bg-[#4caf50] group-hover:w-3 group-hover:mr-2 transition-all duration-300 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="group-hover:translate-x-0 transition-transform duration-200">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
