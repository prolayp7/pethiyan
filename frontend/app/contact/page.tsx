import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import Container from "@/components/layout/Container";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach out to Pethiyan for product enquiries, bulk orders, custom packaging, or any support queries. We respond within 24 hours.",
};

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Call / WhatsApp",
    lines: ["+91 98765 43210", "+91 98765 43211"],
    sub: "Mon–Sat, 9 AM – 7 PM IST",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["support@pethiyan.com", "sales@pethiyan.com"],
    sub: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    title: "Our Office",
    lines: ["Pethiyan Packaging Pvt. Ltd.", "Mumbai, Maharashtra — 400001"],
    sub: "Visit by appointment only",
  },
  {
    icon: Clock,
    title: "Business Hours",
    lines: ["Monday – Saturday", "9:00 AM – 7:00 PM IST"],
    sub: "Closed on national holidays",
  },
];

export default function ContactPage() {
  return (
    <div style={{ background: "var(--background)" }}>

      {/* ── Hero ── */}
      <div
        className="py-14 lg:py-20"
        style={{ background: "linear-gradient(160deg,#0f2f5f 0%,#1f4f8a 50%,#163d6e 100%)" }}
      >
        <Container className="text-center">
          <nav className="flex items-center justify-center gap-1.5 text-xs text-blue-300 mb-5">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium">Contact Us</span>
          </nav>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-4">
            <MessageCircle className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">
            Get in Touch
          </h1>
          <p className="text-blue-200 text-sm max-w-md mx-auto">
            Questions about products, bulk pricing, or custom orders? Our team is here to help.
          </p>
        </Container>
      </div>

      <Container className="py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Left: Contact Info ── */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold text-(--color-secondary) mb-2">
                We&apos;d love to hear from you
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Whether you need packaging for 100 units or 10,000 — reach out and we&apos;ll
                find the right solution for your business.
              </p>
            </div>

            <div className="space-y-4">
              {CONTACT_INFO.map(({ icon: Icon, title, lines, sub }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-(--color-primary)" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
                    {lines.map((l) => (
                      <p key={l} className="text-sm font-semibold text-(--color-secondary)">{l}</p>
                    ))}
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp quick CTA */}
            <a
              href="https://wa.me/919876543210?text=Hi%2C%20I%20have%20a%20query%20about%20Pethiyan%20packaging."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "#25D366" }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.855L.057 23.5l5.797-1.52A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 0 1 2.118 12C2.118 6.74 6.74 2.118 12 2.118S21.882 6.74 21.882 12 17.26 21.882 12 21.882z"/>
              </svg>
              Chat on WhatsApp
            </a>
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
      </Container>
    </div>
  );
}
