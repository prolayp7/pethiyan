import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ClipboardList, CheckCircle, Clock, Headphones, ShieldCheck } from "lucide-react";
import Container from "@/components/layout/Container";
import ContactForm from "@/app/contact/ContactForm";

export const metadata: Metadata = {
  title: "Enquiry Form — Pethiyan",
  description: "Submit a product or bulk-order enquiry to Pethiyan. Our sales team will respond within 24 hours.",
  alternates: { canonical: "/enquiry-form" },
};

const PROMISES = [
  { icon: Clock,        title: "24-Hour Response",    desc: "Our team reviews every enquiry and replies within one business day." },
  { icon: Headphones,   title: "Dedicated Support",   desc: "A packaging specialist handles your query — not a bot." },
  { icon: ShieldCheck,  title: "100% Confidential",   desc: "Your information is never shared with third parties." },
  { icon: CheckCircle,  title: "No Commitment",       desc: "Enquire freely — no obligation to purchase." },
];

export default function EnquiryFormPage() {
  return (
    <div className="min-h-screen bg-(--background)">

      {/* ── Hero ── */}
      <div className="bg-[linear-gradient(160deg,#0f2f5f,#1f4f8a)] py-14 lg:py-20">
        <Container className="text-center">
          <nav className="flex items-center justify-center gap-1.5 text-xs text-blue-300 mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium">Enquiry Form</span>
          </nav>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-5">
            <ClipboardList className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Send Us an Enquiry
          </h1>
          <p className="text-blue-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Looking for bulk packaging, custom printing, or product information?
            Fill in the form below and our team will get back to you within 24 hours.
          </p>
        </Container>
      </div>

      {/* ── Promises strip ── */}
      <div className="bg-white border-b border-gray-100">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
            {PROMISES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 px-6 py-5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-(--color-primary)" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-800">{title}</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Form + Info ── */}
      <Container className="py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start max-w-5xl mx-auto">

          {/* Left: info panel */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-(--color-primary) mb-2">
                Why Enquire with Us?
              </p>
              <h2 className="text-2xl font-extrabold text-(--color-secondary) leading-snug">
                We're here to help you find the right packaging
              </h2>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                Whether you're a startup launching your first product or an established brand scaling operations,
                Pethiyan's packaging experts are ready to assist with tailored solutions.
              </p>
            </div>

            <div className="space-y-3">
              {[
                "Bulk & wholesale pricing available",
                "Custom sizes, prints & branding",
                "GST invoice on all orders",
                "Pan-India shipping with tracking",
                "Sample orders accepted",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
              <p className="text-xs font-bold text-(--color-primary) uppercase tracking-widest mb-1">Quick Contact</p>
              <p className="text-sm font-semibold text-gray-800">+91 98765 43210</p>
              <p className="text-xs text-gray-500">Mon – Sat &nbsp;·&nbsp; 9 AM – 7 PM IST</p>
              <div className="mt-3 pt-3 border-t border-blue-100">
                <p className="text-sm font-semibold text-gray-800">support@pethiyan.com</p>
                <p className="text-xs text-gray-500">We reply within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-(--color-secondary) mb-1">Enquiry Details</h2>
            <p className="text-xs text-gray-400 mb-6">Fields marked * are required.</p>
            <ContactForm />
          </div>

        </div>
      </Container>

      {/* ── Bottom CTA ── */}
      <div className="bg-gray-50 border-t border-gray-100 py-10">
        <Container className="text-center">
          <p className="text-sm text-gray-500 mb-3">
            Prefer to chat directly? Reach us on WhatsApp for instant replies.
          </p>
          <Link
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-[#25D366] hover:brightness-105 transition-all shadow-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </Link>
        </Container>
      </div>

    </div>
  );
}
