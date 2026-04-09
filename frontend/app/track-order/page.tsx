import type { Metadata } from "next";
import { Suspense } from "react";
import TrackOrderClient from "./TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track the status and live delivery updates of your Pethiyan order using your order number and mobile number.",
  robots: { index: false, follow: false },
};

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="w-10 h-10 rounded-full border-4 border-(--color-primary) border-t-transparent animate-spin" />
      </div>
    }>
      <TrackOrderClient />
    </Suspense>
  );
}
