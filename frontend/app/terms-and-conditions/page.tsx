import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, FileText } from "lucide-react";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read Pethiyan's Terms & Conditions governing the use of our website and the purchase of packaging products.",
};

export default function TermsPage() {
  return (
    <div className="bg-background">

      {/* ── Breadcrumb bar ── */}
      <div className="bg-white border-b border-(--color-border) py-5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center h-10 w-10 rounded-xl shrink-0 bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)]">
                <FileText className="h-5 w-5 text-white" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-secondary)">Terms &amp; Conditions</h1>
                <p className="mt-0.5 text-gray-500 text-sm">Please read these terms carefully before using our platform.</p>
              </div>
            </div>
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 shrink-0" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 hover:text-(--color-primary) transition-colors">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
              <span className="text-(--color-secondary) font-medium">Terms &amp; Conditions</span>
            </nav>
          </div>
        </Container>
      </div>

      <Container className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 lg:p-10 space-y-8 text-sm text-gray-600 leading-relaxed">

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Pethiyan website (<Link href="/" className="text-(--color-primary) underline">pethiyan.com</Link>)
                or placing an order, you agree to be bound by these Terms & Conditions. If you do not agree,
                please discontinue use of the site immediately.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">2. Products & Pricing</h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li>All prices are listed in Indian Rupees (INR) and are inclusive of applicable GST unless stated otherwise.</li>
                <li>Prices are subject to change without notice. The price charged at checkout is the final price.</li>
                <li>Product images are for illustrative purposes only; actual product may vary slightly.</li>
                <li>We reserve the right to limit quantities or discontinue any product at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">3. Orders & Payment</h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Placing an order constitutes an offer to purchase. We reserve the right to accept or reject any order.</li>
                <li>An order is confirmed only upon receipt of a confirmation SMS or email.</li>
                <li>We accept UPI, credit/debit cards, net banking, and Cash on Delivery (COD) via Razorpay.</li>
                <li>For COD orders, full payment must be made to the delivery executive upon receipt of the order.</li>
                <li>In case of payment failure, please retry. Contact us if the issue persists.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">4. GST & Invoicing</h2>
              <p>
                A GST-compliant tax invoice is generated for every order and is accessible from your account.
                Pethiyan&apos;s GSTIN will be mentioned on the invoice. For B2B orders, please ensure your GSTIN
                is updated in your profile for accurate invoice generation.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">5. Shipping & Delivery</h2>
              <p>
                Shipping is subject to our{" "}
                <Link href="/shipping-policy" className="text-(--color-primary) underline">Shipping Policy</Link>.
                Delivery timelines are estimates and may be affected by factors beyond our control (natural
                disasters, courier delays, public holidays).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">6. Returns & Refunds</h2>
              <p>
                Returns and refunds are governed by our{" "}
                <Link href="/returns-policy" className="text-(--color-primary) underline">Returns Policy</Link>.
                Pethiyan reserves the right to refuse returns that do not meet the stated eligibility criteria.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">7. User Accounts</h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li>You must provide accurate and complete information when creating an account.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>Pethiyan is not liable for any loss resulting from unauthorised access to your account.</li>
                <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">8. Intellectual Property</h2>
              <p>
                All content on this website — including logos, product images, text, and design — is the
                intellectual property of Pethiyan Packaging Pvt. Ltd. You may not reproduce, distribute, or
                create derivative works without our express written consent.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">9. Prohibited Use</h2>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Use the site for any unlawful purpose</li>
                <li>Attempt to gain unauthorised access to our systems</li>
                <li>Post false, misleading, or fraudulent content</li>
                <li>Scrape, harvest, or extract data from the site using automated tools</li>
                <li>Resell products purchased on Pethiyan without prior written authorisation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">10. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by Indian law, Pethiyan shall not be liable for any indirect,
                incidental, special, or consequential damages arising from your use of the site or products.
                Our maximum liability in any case shall not exceed the value of the order in dispute.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">11. Governing Law</h2>
              <p>
                These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive
                jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes take effect immediately upon
                posting. Continued use of the site after changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">13. Contact</h2>
              <p>
                For questions about these Terms, contact us at{" "}
                <a href="mailto:legal@pethiyan.com" className="text-(--color-primary) underline">legal@pethiyan.com</a>{" "}
                or via our <Link href="/contact" className="text-(--color-primary) underline">Contact page</Link>.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
