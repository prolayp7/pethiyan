import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Truck } from "lucide-react";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Learn about Pethiyan's shipping timelines, delivery charges, free shipping threshold, and our pan-India delivery network.",
};

export default function ShippingPolicyPage() {
  return (
    <div style={{ background: "var(--background)" }}>

      {/* Hero */}
      <div className="py-12 lg:py-16" style={{ background: "linear-gradient(160deg,#0f2f5f,#1f4f8a)" }}>
        <Container className="text-center">
          <nav className="flex items-center justify-center gap-1.5 text-xs text-blue-300 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium">Shipping Policy</span>
          </nav>
          <Truck className="h-10 w-10 text-white mx-auto mb-3 opacity-80" />
          <h1 className="text-3xl font-extrabold text-white mb-2">Shipping Policy</h1>
          <p className="text-blue-300 text-xs">Last updated: March 25, 2026</p>
        </Container>
      </div>

      <Container className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 lg:p-10 prose prose-sm max-w-none space-y-8">

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">1. Order Processing Time</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                All orders are processed within <strong>1–2 business days</strong> (Monday–Saturday, excluding national holidays) after payment confirmation. During sale periods or high-demand seasons, processing may take up to 3 business days.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                You will receive an SMS and email notification with your tracking details once your order has been dispatched.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">2. Shipping Options & Timelines</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-bold text-(--color-secondary)">Shipping Type</th>
                      <th className="text-left px-4 py-3 font-bold text-(--color-secondary)">Delivery Time</th>
                      <th className="text-left px-4 py-3 font-bold text-(--color-secondary)">Charge</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-gray-50">
                      <td className="px-4 py-3">Standard Delivery</td>
                      <td className="px-4 py-3">5–7 Business Days</td>
                      <td className="px-4 py-3">₹49</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="px-4 py-3">Express Delivery</td>
                      <td className="px-4 py-3">2–3 Business Days</td>
                      <td className="px-4 py-3">₹99</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="px-4 py-3">Free Shipping</td>
                      <td className="px-4 py-3">5–7 Business Days</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">Free (orders ≥ ₹999)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Cash on Delivery</td>
                      <td className="px-4 py-3">5–7 Business Days</td>
                      <td className="px-4 py-3">₹49 + ₹50 COD fee</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-2">* Business days exclude Sundays and national holidays.</p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">3. Free Shipping</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Orders with a cart value of <strong>₹999 or above</strong> (after any discounts applied) qualify for free standard shipping. Free shipping is automatically applied at checkout — no coupon code required.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">4. Delivery Area</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We deliver to all <strong>28 states and 8 Union Territories</strong> across India, including remote and rural pincodes. Delivery to certain remote pincodes (Ladakh, Andaman & Nicobar, Lakshadweep) may take an additional 3–5 business days.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                We do not currently ship internationally.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">5. Order Tracking</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Once dispatched, you can track your order in real time via:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>The SMS tracking link sent to your registered mobile number</li>
                <li><Link href="/account/orders" className="text-(--color-primary) underline">My Account → Orders</Link></li>
                <li><Link href="/track-order" className="text-(--color-primary) underline">Track Order</Link> page using your order number and mobile number</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">6. Damaged or Lost Shipments</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                If you receive a damaged package, please take photos/videos at the time of delivery and contact us within <strong>48 hours</strong> at <a href="mailto:support@pethiyan.com" className="text-(--color-primary) underline">support@pethiyan.com</a>.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                For shipments that appear lost, please contact us within <strong>10 business days</strong> of the expected delivery date. We will investigate with the courier and either resend your order or issue a full refund.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-(--color-secondary) mb-3">7. Contact</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                For any shipping-related queries, contact us at{" "}
                <a href="mailto:support@pethiyan.com" className="text-(--color-primary) underline">support@pethiyan.com</a>{" "}
                or via our <Link href="/contact" className="text-(--color-primary) underline">Contact page</Link>.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
