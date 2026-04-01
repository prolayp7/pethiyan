import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--background)" }} />}>
      <CheckoutClient />
    </Suspense>
  );
}
