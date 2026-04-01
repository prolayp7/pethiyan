import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, RefreshCw } from "lucide-react";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Returns & Refunds Policy",
  description: "Pethiyan's 7-day return policy — learn how to initiate a return, what items qualify, and how refunds are processed.",
};

export default function ReturnsPolicyPage() {
  return (
    <div style={{ background: "var(--background)" }}>

      <div className="py-12 lg:py-16" style={{ background: "linear-gradient(160deg,#0f2f5f,#1f4f8a)" }}>
        <Container className="text-center">
          <nav className="flex items-center justify-center gap-1.5 text-xs text-blue-300 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium">Returns Policy</span>
          </nav>
          <RefreshCw className="h-10 w-10 text-white mx-auto mb-3 opacity-80" />
          <h1 className="text-3xl font-extrabold text-white mb-2">Returns & Refunds Policy</h1>
          <p className="text-blue-300 text-xs">Last updated: March 25, 2026</p>
        </Container>
      </div>

      <Container className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 lg:p-10 space-y-8">

            {/* Quick summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Return Window", value: "7 Days", sub: "from delivery date" },
                { label: "Refund Timeline", value: "5–7 Days", sub: "after pickup" },
                { label: "Defective Items", value: "48 Hours", sub: "report window" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="text-center p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
                  <p className="text-xl font-extrabold text-(--color-primary)">{value}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              ))}
            </div>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">1. Return Eligibility</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                We accept returns within <strong>7 days of delivery</strong> for items that meet the following conditions:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5">
                <li>Item is unused and in its original condition</li>
                <li>Item is in its original packaging with all tags/labels intact</li>
                <li>Item was not part of a custom or personalised order</li>
                <li>Item is not from a clearance or final-sale category</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">2. Non-Returnable Items</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                The following items <strong>cannot be returned</strong>:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5">
                <li>Custom-printed or branded packaging (personalised orders)</li>
                <li>Opened or used packaging products</li>
                <li>Items damaged due to customer mishandling</li>
                <li>Clearance or sale items marked as non-returnable</li>
                <li>Free gifts or complimentary items</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">3. Damaged or Defective Items</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours of delivery</strong> with:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5 mt-2">
                <li>Your order number</li>
                <li>Clear photos or video of the defect/damage</li>
                <li>A brief description of the issue</li>
              </ul>
              <p className="text-gray-600 text-sm leading-relaxed mt-3">
                We will arrange a free return pickup and issue a full refund or replacement at no additional cost.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">4. How to Initiate a Return</h2>
              <div className="space-y-3">
                {[
                  { step: "1", text: "Go to My Account → Orders and select the order you want to return." },
                  { step: "2", text: "Click 'Request Return' and select the items and reason for return." },
                  { step: "3", text: "Our team will review and approve the request within 1 business day." },
                  { step: "4", text: "A pickup will be scheduled at your delivery address." },
                  { step: "5", text: "Refund is processed within 2–3 business days after we receive the item." },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold text-white shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg,#1f4f8a,#0f2f5f)" }}>
                      {step}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">5. Refund Process</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Once the returned item is received and inspected (1–2 business days), your refund will be processed:
              </p>
              <div className="mt-3 overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-bold text-(--color-secondary)">Payment Method</th>
                      <th className="text-left px-4 py-3 font-bold text-(--color-secondary)">Refund To</th>
                      <th className="text-left px-4 py-3 font-bold text-(--color-secondary)">Timeline</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-gray-50">
                      <td className="px-4 py-3">UPI / Net Banking</td>
                      <td className="px-4 py-3">Original bank account</td>
                      <td className="px-4 py-3">3–5 business days</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="px-4 py-3">Credit / Debit Card</td>
                      <td className="px-4 py-3">Original card</td>
                      <td className="px-4 py-3">5–7 business days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Cash on Delivery</td>
                      <td className="px-4 py-3">Bank transfer (NEFT)</td>
                      <td className="px-4 py-3">5–7 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">6. Contact for Returns</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                For any return or refund queries, email us at{" "}
                <a href="mailto:support@pethiyan.com" className="text-(--color-primary) underline">support@pethiyan.com</a>{" "}
                or reach out via our <Link href="/contact" className="text-(--color-primary) underline">Contact page</Link>.
                Our team is available Monday–Saturday, 9 AM–7 PM IST.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
