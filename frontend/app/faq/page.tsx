import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, HelpCircle } from "lucide-react";
import Container from "@/components/layout/Container";
import { staticFaqSchema, jsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Find answers to common questions about Pethiyan's packaging products, ordering, shipping, returns, and payments.",
};

const FAQ_SECTIONS = [
  {
    category: "Orders & Payment",
    icon: "🛒",
    items: [
      {
        q: "Is there a minimum order quantity (MOQ)?",
        a: "Most of our products have no minimum order quantity, allowing you to order as few as 1 unit. Some specialised or custom-printed products may have an MOQ — this is clearly displayed on the product page.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major UPI apps (GPay, PhonePe, Paytm), credit/debit cards, net banking, and Cash on Delivery (COD) via Razorpay. All online transactions are secured with 256-bit encryption.",
      },
      {
        q: "Do you provide GST invoices?",
        a: "Yes. Every order automatically generates a GST-compliant invoice that is accessible from your order details in your account. You can download it as a PDF for your records.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "Orders can be modified or cancelled within 2 hours of placement, provided they haven't been dispatched. Please contact our support team immediately via WhatsApp or email.",
      },
      {
        q: "How do I apply a coupon code?",
        a: "On the cart page, enter your coupon code in the 'Coupon Code' field and click Apply. The discount will be reflected in the order summary before checkout.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    icon: "🚚",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 5–7 business days. Express delivery (2–3 business days) is available for select pincodes at checkout. Delivery times may vary during sale periods or national holidays.",
      },
      {
        q: "Do you ship all over India?",
        a: "Yes, we ship to all 28 states and 8 Union Territories across India. Some remote areas may have extended delivery timelines.",
      },
      {
        q: "What are the shipping charges?",
        a: "Standard shipping is ₹49. Express shipping is ₹99. Orders above ₹999 qualify for free standard shipping automatically. Cash on Delivery orders have an additional ₹50 handling fee.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order is dispatched, you'll receive an SMS with tracking details. You can also track your order anytime from the 'Track Order' page using your order number and registered mobile number, or from My Account → Orders.",
      },
      {
        q: "What happens if my package is lost in transit?",
        a: "In the rare event of a lost shipment, please contact us within 10 days of the expected delivery date. We will investigate and either resend the order or issue a full refund.",
      },
    ],
  },
  {
    category: "Products & Quality",
    icon: "📦",
    items: [
      {
        q: "Are your packaging materials food-safe?",
        a: "Yes. All our food-contact packaging materials are BIS certified and comply with Indian food safety regulations (FSSAI guidelines). Product specifications are listed on each product page.",
      },
      {
        q: "Can I get custom printing or branding on the packaging?",
        a: "Yes, we offer custom printing for bulk orders. Please contact our sales team via the Contact page or WhatsApp with your design requirements and quantity for a custom quote.",
      },
      {
        q: "Do you offer eco-friendly or biodegradable packaging?",
        a: "Absolutely. We have a growing range of kraft paper bags, compostable pouches, and recycled material options. Filter for 'Eco-Friendly' on our Shop page to see the full range.",
      },
      {
        q: "Can I request product samples before placing a bulk order?",
        a: "Yes. We offer sample orders for most products. Add the product to your cart in small quantities, or contact us to arrange a sample pack. Sample orders are charged at standard product rates.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    icon: "🔄",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 days of delivery for unused products in their original packaging. Defective or damaged items are accepted for return within 48 hours of delivery.",
      },
      {
        q: "How do I initiate a return?",
        a: "Go to My Account → Orders, select the order, and click 'Return Item'. Alternatively, contact our support team via WhatsApp or email with your order number and reason for return.",
      },
      {
        q: "How long does a refund take?",
        a: "Refunds are processed within 2–3 business days of return pickup. The amount reflects in your original payment source (UPI, card, bank account) within 5–7 business days after processing.",
      },
      {
        q: "Are there any items that cannot be returned?",
        a: "Custom-printed or personalised products, items that have been opened or used, and products damaged due to customer negligence cannot be returned.",
      },
    ],
  },
];

export default function FaqPage() {
  // Flatten all FAQ items for JSON-LD
  const allFaqs = FAQ_SECTIONS.flatMap((s) => s.items.map(({ q, a }) => ({ q, a })));
  const faqSchema = staticFaqSchema(allFaqs);

  return (
    <div style={{ background: "var(--background)" }}>
      <script {...jsonLd(faqSchema)} />

      {/* ── Hero ── */}
      <div
        className="py-14 lg:py-20"
        style={{ background: "linear-gradient(160deg,#0f2f5f 0%,#1f4f8a 50%,#163d6e 100%)" }}
      >
        <Container className="text-center">
          <nav className="flex items-center justify-center gap-1.5 text-xs text-blue-300 mb-5">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium">FAQ</span>
          </nav>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-4">
            <HelpCircle className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-blue-200 text-sm max-w-md mx-auto">
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/contact" className="text-white font-semibold underline underline-offset-2">
              Contact our team
            </Link>
          </p>
        </Container>
      </div>

      {/* ── FAQ Content ── */}
      <Container className="py-14 lg:py-20">
        <div className="max-w-3xl mx-auto space-y-10">
          {FAQ_SECTIONS.map(({ category, icon, items }) => (
            <section key={category}>
              {/* Category heading */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{icon}</span>
                <h2 className="text-xl font-extrabold text-(--color-secondary)">{category}</h2>
              </div>

              {/* Accordion items using HTML details/summary */}
              <div className="space-y-3">
                {items.map(({ q, a }) => (
                  <details
                    key={q}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none select-none hover:bg-gray-50 transition-colors">
                      <span className="text-sm font-semibold text-(--color-secondary) leading-snug">
                        {q}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 group-open:rotate-90" />
                    </summary>
                    <div className="px-6 pb-5 pt-1 border-t border-gray-50">
                      <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
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
