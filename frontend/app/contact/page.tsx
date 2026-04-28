import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import Container from "@/components/layout/Container";
import ContactForm from "./ContactForm";
import RecentlyViewedProducts from "@/components/sections/RecentlyViewedProducts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactData {
  introTitle: string;
  introText: string;
  phoneNumbers: string[];
  phoneNote: string;
  whatsappNumber: string;
  emails: string[];
  emailNote: string;
  officeName: string;
  officeAddress: string;
  officeNote: string;
  businessHoursLine1: string;
  businessHoursLine2: string;
  businessHoursNote: string;
  mapLatitude: string;
  mapLongitude: string;
  mapIframe: string;
}

interface PageResponse {
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  contact: ContactData;
}

// ─── Fallback (shown only if the API is completely unreachable) ───────────────

const FALLBACK: ContactData = {
  introTitle:         "We'd love to hear from you",
  introText:          "Whether you need packaging for 100 units or 10,000 — reach out and we'll find the right solution for your business.",
  phoneNumbers:       ["+91 98765 43210", "+91 98765 43211"],
  phoneNote:          "Mon–Sat, 9 AM – 7 PM IST",
  whatsappNumber:     "919876543210",
  emails:             ["support@pethiyan.com", "sales@pethiyan.com"],
  emailNote:          "We reply within 24 hours",
  officeName:         "Pethiyan Packaging Pvt. Ltd.",
  officeAddress:      "Mumbai, Maharashtra — 400001",
  officeNote:         "Visit by appointment only",
  businessHoursLine1: "Monday – Saturday",
  businessHoursLine2: "9:00 AM – 7:00 PM IST",
  businessHoursNote:  "Closed on national holidays",
  mapLatitude:        "",
  mapLongitude:       "",
  mapIframe:          "",
};

// ─── Data fetch ───────────────────────────────────────────────────────────────

async function getContactData(): Promise<{ contact: ContactData; page: Omit<PageResponse, "contact"> | null }> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
  try {
    const res = await fetch(`${apiBase}/api/pages/contact-us`, {
      next: { tags: ["contact-page"] },
    });
    if (!res.ok) return { contact: FALLBACK, page: null };
    const json: PageResponse = await res.json();
    return {
      contact: { ...FALLBACK, ...(json.contact ?? {}) },
      page: { slug: json.slug, title: json.title, meta_title: json.meta_title, meta_description: json.meta_description },
    };
  } catch {
    return { contact: FALLBACK, page: null };
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getContactData();
  return {
    title:       page?.meta_title       ?? "Contact Us",
    description: page?.meta_description ?? "Reach out to us for product enquiries, bulk orders, custom packaging, or any support queries. We respond within 24 hours.",
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ContactPage() {
  const { contact: c } = await getContactData();

  const officeLines = [c.officeName, c.officeAddress].filter(Boolean);

  const CONTACT_INFO = [
    c.phoneNumbers.length > 0 && {
      icon: Phone,
      title: "Call / WhatsApp",
      lines: c.phoneNumbers,
      sub: c.phoneNote,
    },
    c.emails.length > 0 && {
      icon: Mail,
      title: "Email Us",
      lines: c.emails,
      sub: c.emailNote,
    },
    officeLines.length > 0 && {
      icon: MapPin,
      title: "Our Office",
      lines: officeLines,
      sub: c.officeNote,
    },
    (c.businessHoursLine1 || c.businessHoursLine2) && {
      icon: Clock,
      title: "Business Hours",
      lines: [c.businessHoursLine1, c.businessHoursLine2].filter(Boolean),
      sub: c.businessHoursNote,
    },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; title: string; lines: string[]; sub: string }[];

  const waHref = c.whatsappNumber
    ? `https://wa.me/${c.whatsappNumber}?text=Hi%2C%20I%20have%20a%20query.`
    : "#";

  return (
    <div className="bg-background">

      {/* ── Breadcrumb bar ── */}
      <div className="bg-white border-b border-(--color-border) py-5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center h-10 w-10 rounded-xl shrink-0 bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)]"
              >
                <MessageCircle className="h-5 w-5 text-white" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-secondary)">Contact Us</h1>
                <p className="mt-0.5 text-gray-500 text-sm">Questions, bulk pricing, or custom orders? We&apos;re here to help.</p>
              </div>
            </div>
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 shrink-0" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 hover:text-(--color-primary) transition-colors">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
              <span className="text-(--color-secondary) font-medium">Contact Us</span>
            </nav>
          </div>
        </Container>
      </div>

      <Container className="py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Left: Contact Info ── */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-(--color-secondary) mb-2">
                {c.introTitle}
              </h2>
              {c.introText && (
                <p className="text-sm text-gray-500 leading-relaxed">{c.introText}</p>
              )}
            </div>

            {CONTACT_INFO.length > 0 && (
              <div className="space-y-4">
                {CONTACT_INFO.map(({ icon: Icon, title, lines, sub }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)]"
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
                      {lines.map((l) => (
                        <p key={l} className="text-sm font-semibold text-(--color-secondary)">{l}</p>
                      ))}
                      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* WhatsApp quick CTA */}
            {c.whatsappNumber && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 bg-[#25D366]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.855L.057 23.5l5.797-1.52A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 0 1 2.118 12C2.118 6.74 6.74 2.118 12 2.118S21.882 6.74 21.882 12 17.26 21.882 12 21.882z"/>
                </svg>
                Chat on WhatsApp
              </a>
            )}
          </div>

          {/* ── Right: Form ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-extrabold text-(--color-secondary) mb-1">Send us a message</h2>
              <p className="text-sm text-gray-500 mb-6">
                Fill in the form below and we&apos;ll get back to you as soon as possible.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* ── Map ── */}
        {(c.mapIframe || (c.mapLatitude && c.mapLongitude)) && (
          <div className="mt-12">
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-80 w-full">
              {c.mapIframe ? (
                <div
                  className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full"
                  dangerouslySetInnerHTML={{ __html: c.mapIframe }}
                />
              ) : (
                <iframe
                  title="Our Location"
                  src={`https://maps.google.com/maps?q=${c.mapLatitude},${c.mapLongitude}&z=15&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </div>
          </div>
        )}
      </Container>

      <RecentlyViewedProducts
        title="Recently Viewed Products"
        eyebrow="Continue exploring"
        description="Reconnect with the packaging products you checked before reaching out to us."
        viewAllLabel="See all products"
      />
    </div>
  );
}
