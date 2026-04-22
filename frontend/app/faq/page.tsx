import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, HelpCircle, Home } from "lucide-react";
import Container from "@/components/layout/Container";
import { staticFaqSchema, jsonLd } from "@/lib/structured-data";
import { fetchFaqSections, type FaqSection } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Find answers to common questions about Pethiyan's packaging products, ordering, shipping, returns, and payments.",
};

// ── Static fallback data (shown when the API is unavailable or returns empty) ──
const FALLBACK_SECTIONS: FaqSection[] = [
  {
    id: null,
    name: "Orders & Payment",
    icon: "🛒",
    sort_order: 0,
    items: [
      {
        id: 1,
        question: "Is there a minimum order quantity (MOQ)?",
        answer: "Most of our products have no minimum order quantity, allowing you to order as few as 1 unit. Some specialised or custom-printed products may have an MOQ — this is clearly displayed on the product page.",
      },
      {
        id: 2,
        question: "What payment methods do you accept?",
        answer: "We accept all major UPI apps (GPay, PhonePe, Paytm), credit/debit cards, net banking, and Cash on Delivery (COD) via Razorpay. All online transactions are secured with 256-bit encryption.",
      },
      {
        id: 3,
        question: "Do you provide GST invoices?",
        answer: "Yes. Every order automatically generates a GST-compliant invoice that is accessible from your order details in your account. You can download it as a PDF for your records.",
      },
      {
        id: 4,
        question: "Can I modify or cancel my order after placing it?",
        answer: "Orders can be modified or cancelled within 2 hours of placement, provided they haven't been dispatched. Please contact our support team immediately via WhatsApp or email.",
      },
      {
        id: 5,
        question: "How do I apply a coupon code?",
        answer: "On the cart page, enter your coupon code in the 'Coupon Code' field and click Apply. The discount will be reflected in the order summary before checkout.",
      },
    ],
  },
  {
    id: null,
    name: "Shipping & Delivery",
    icon: "🚚",
    sort_order: 1,
    items: [
      {
        id: 6,
        question: "How long does delivery take?",
        answer: "Standard delivery takes 5–7 business days. Express delivery (2–3 business days) is available for select pincodes at checkout. Delivery times may vary during sale periods or national holidays.",
      },
      {
        id: 7,
        question: "Do you ship all over India?",
        answer: "Yes, we ship to all 28 states and 8 Union Territories across India. Some remote areas may have extended delivery timelines.",
      },
      {
        id: 8,
        question: "What are the shipping charges?",
        answer: "Standard shipping is ₹49. Express shipping is ₹99. Orders above ₹999 qualify for free standard shipping automatically. Cash on Delivery orders have an additional ₹50 handling fee.",
      },
      {
        id: 9,
        question: "How do I track my order?",
        answer: "Once your order is dispatched, you'll receive an SMS with tracking details. You can also track your order anytime from the 'Track Order' page using your order number and registered mobile number, or from My Account → Orders.",
      },
      {
        id: 10,
        question: "What happens if my package is lost in transit?",
        answer: "In the rare event of a lost shipment, please contact us within 10 days of the expected delivery date. We will investigate and either resend the order or issue a full refund.",
      },
    ],
  },
  {
    id: null,
    name: "Products & Quality",
    icon: "📦",
    sort_order: 2,
    items: [
      {
        id: 11,
        question: "Are your packaging materials food-safe?",
        answer: "Yes. All our food-contact packaging materials are BIS certified and comply with Indian food safety regulations (FSSAI guidelines). Product specifications are listed on each product page.",
      },
      {
        id: 12,
        question: "Can I get custom printing or branding on the packaging?",
        answer: "Yes, we offer custom printing for bulk orders. Please contact our sales team via the Contact page or WhatsApp with your design requirements and quantity for a custom quote.",
      },
      {
        id: 13,
        question: "Do you offer eco-friendly or biodegradable packaging?",
        answer: "Absolutely. We have a growing range of kraft paper bags, compostable pouches, and recycled material options. Filter for 'Eco-Friendly' on our Shop page to see the full range.",
      },
      {
        id: 14,
        question: "Can I request product samples before placing a bulk order?",
        answer: "Yes. We offer sample orders for most products. Add the product to your cart in small quantities, or contact us to arrange a sample pack. Sample orders are charged at standard product rates.",
      },
    ],
  },
  {
    id: null,
    name: "Returns & Refunds",
    icon: "🔄",
    sort_order: 3,
    items: [
      {
        id: 15,
        question: "What is your return policy?",
        answer: "We accept returns within 7 days of delivery for unused products in their original packaging. Defective or damaged items are accepted for return within 48 hours of delivery.",
      },
      {
        id: 16,
        question: "How do I initiate a return?",
        answer: "Go to My Account → Orders, select the order, and click 'Return Item'. Alternatively, contact our support team via WhatsApp or email with your order number and reason for return.",
      },
      {
        id: 17,
        question: "How long does a refund take?",
        answer: "Refunds are processed within 2–3 business days of return pickup. The amount reflects in your original payment source (UPI, card, bank account) within 5–7 business days after processing.",
      },
      {
        id: 18,
        question: "Are there any items that cannot be returned?",
        answer: "Custom-printed or personalised products, items that have been opened or used, and products damaged due to customer negligence cannot be returned.",
      },
    ],
  },
];

export default async function FaqPage() {
  // Try to load FAQ data from the backend API; fall back to static data
  const apiSections = await fetchFaqSections();
  const sections: FaqSection[] = (apiSections && apiSections.length > 0) ? apiSections : FALLBACK_SECTIONS;

  // Flatten all FAQ items for JSON-LD structured data
  const allFaqs = sections.flatMap((s) => s.items.map(({ question, answer }) => ({ q: question, a: answer })));
  const faqSchema = staticFaqSchema(allFaqs);

  return (
    <div style={{ background: "var(--background)" }}>
      <script {...jsonLd(faqSchema)} />

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-(--color-border) py-5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center h-10 w-10 rounded-xl shrink-0"
                style={{ background: "var(--brand-gradient)" }}
              >
                <HelpCircle className="h-5 w-5 text-white" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-secondary)">FAQ</h1>
                <p className="mt-0.5 text-gray-500 text-sm">Find answers to common questions about our products, shipping, and more.</p>
              </div>
            </div>
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 shrink-0" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 hover:text-(--color-primary) transition-colors">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
              <span className="text-(--color-secondary) font-medium">FAQ</span>
            </nav>
          </div>
        </Container>
      </div>

      {/* ── FAQ Content ── */}
      <Container className="py-14 lg:py-20">
        <div className="max-w-3xl mx-auto space-y-10">
          {sections.map((section) => (
            <section key={section.id ?? section.name}>
              {/* Category heading */}
              <div className="flex items-center gap-3 mb-5">
                {section.icon ? (
                  <span className="text-2xl" aria-hidden="true">{section.icon}</span>
                ) : null}
                <h2 className="text-xl font-extrabold text-(--color-secondary)">{section.name}</h2>
              </div>

              {/* Accordion items */}
              <div className="space-y-3">
                {section.items.map(({ id, question, answer }) => (
                  <details
                    key={id}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none select-none hover:bg-gray-50 transition-colors">
                      <span className="text-sm font-semibold text-(--color-secondary) leading-snug">
                        {question}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 group-open:rotate-90" />
                    </summary>
                    <div className="px-6 pb-5 pt-1 border-t border-gray-50">
                      <p className="text-sm text-gray-600 leading-relaxed">{answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Still need help */}
        <div
          className="max-w-3xl mx-auto mt-14 rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg,#1f4f8a,#0f2f5f)" }}
        >
          <HelpCircle className="h-8 w-8 text-white mx-auto mb-3 opacity-80" />
          <h3 className="text-xl font-extrabold text-white mb-2">Still have a question?</h3>
          <p className="text-blue-200 text-sm mb-5">
            Our support team is available Mon–Sat, 9 AM to 7 PM IST.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-(--color-secondary) bg-white hover:bg-blue-50 transition-colors"
          >
            Contact Support
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
