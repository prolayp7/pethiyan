import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, ShieldCheck } from "lucide-react";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Pethiyan's Privacy Policy — how we collect, use, and protect your personal data in compliance with Indian data protection laws.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background">

      {/* ── Breadcrumb bar ── */}
      <div className="bg-white border-b border-(--color-border) py-5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center h-10 w-10 rounded-xl shrink-0 bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)]">
                <ShieldCheck className="h-5 w-5 text-white" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-secondary)">Privacy Policy</h1>
                <p className="mt-0.5 text-gray-500 text-sm">How we collect, use, and protect your personal data.</p>
              </div>
            </div>
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 shrink-0" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 hover:text-(--color-primary) transition-colors">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
              <span className="text-(--color-secondary) font-medium">Privacy Policy</span>
            </nav>
          </div>
        </Container>
      </div>

      <Container className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 lg:p-10 space-y-8 text-sm text-gray-600 leading-relaxed">

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">1. Introduction</h2>
              <p>
                Pethiyan Packaging Pvt. Ltd. (&ldquo;Pethiyan&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                personal information when you visit <Link href="/" className="text-(--color-primary) underline">pethiyan.com</Link> or
                place an order with us.
              </p>
              <p className="mt-2">
                By using our platform, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">2. Information We Collect</h2>
              <p className="mb-2 font-semibold text-(--color-secondary)">Personal Information:</p>
              <ul className="list-disc list-inside space-y-1 mb-3">
                <li>Name, mobile number, and email address (provided during registration or checkout)</li>
                <li>Delivery addresses and billing information</li>
                <li>Order history and transaction data</li>
                <li>Device information, IP address, and browser type (collected automatically)</li>
                <li>Cookies and usage data (pages visited, time spent, clicks)</li>
              </ul>
              <p className="mb-2 font-semibold text-(--color-secondary)">Sensitive Financial Information:</p>
              <p>
                We do <strong>not</strong> store your card numbers, UPI PINs, or net banking passwords. Payments
                are processed securely by Razorpay, which is PCI-DSS compliant.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li>To process and fulfil your orders</li>
                <li>To send order confirmation, shipping updates, and delivery notifications via SMS</li>
                <li>To generate GST-compliant invoices</li>
                <li>To respond to customer support queries</li>
                <li>To personalise your shopping experience</li>
                <li>To send promotional offers and updates (only if you have opted in)</li>
                <li>To comply with legal and regulatory obligations</li>
                <li>To detect and prevent fraud or misuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">4. Sharing of Information</h2>
              <p className="mb-2">We do not sell your personal data. We share your data only with:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>Logistics partners</strong> (e.g. Delhivery, DTDC) — to ship and track your orders</li>
                <li><strong>Payment processors</strong> (Razorpay) — to securely process transactions</li>
                <li><strong>SMS service providers</strong> — to send OTP and order notifications</li>
                <li><strong>Analytics tools</strong> (e.g. Google Analytics) — to improve our website</li>
                <li><strong>Legal authorities</strong> — when required by law or court order</li>
              </ul>
              <p className="mt-2">
                All third-party partners are contractually required to protect your data and may not use it for their own marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">5. Cookies</h2>
              <p>
                We use cookies to maintain your session, remember your cart, and analyse usage. You can disable
                cookies in your browser settings; however, some features (like staying logged in) may not function correctly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">6. Data Retention</h2>
              <p>
                We retain your personal data for as long as your account is active or as required to fulfil the
                purposes outlined in this policy. Order records are retained for <strong>7 years</strong> as required
                by Indian tax laws. You may request deletion of your account at any time.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">7. Your Rights</h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Correction:</strong> Update incorrect or incomplete information via your account profile</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
              </ul>
              <p className="mt-2">
                To exercise these rights, contact us at{" "}
                <a href="mailto:privacy@pethiyan.com" className="text-(--color-primary) underline">privacy@pethiyan.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">8. Security</h2>
              <p>
                We implement industry-standard security measures including 256-bit SSL encryption, secure cloud
                infrastructure, and access controls. However, no method of transmission over the internet is 100%
                secure. We encourage you to use a strong, unique password and keep your account credentials confidential.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an
                updated &ldquo;last updated&rdquo; date. We recommend reviewing this page periodically.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">10. Contact Us</h2>
              <p>
                For privacy-related queries, email us at{" "}
                <a href="mailto:privacy@pethiyan.com" className="text-(--color-primary) underline">privacy@pethiyan.com</a>{" "}
                or write to: Pethiyan Packaging Pvt. Ltd., Mumbai, Maharashtra — 400001, India.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
