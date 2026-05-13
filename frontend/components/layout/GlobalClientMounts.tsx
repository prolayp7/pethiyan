"use client";

import dynamic from "next/dynamic";

const MobileBottomNav = dynamic(() => import("@/components/ui/MobileBottomNav"), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/ui/CartDrawer"), { ssr: false });
const ScrollToTop = dynamic(() => import("@/components/ui/ScrollToTop"), { ssr: false });
const CouponPopup = dynamic(() => import("@/components/popups/CouponPopup"), { ssr: false });
const WhatsAppFloatingButton = dynamic(() => import("@/components/layout/WhatsAppFloatingButton"), { ssr: false });

export default function GlobalClientMounts() {
  return (
    <>
      <MobileBottomNav />
      <CartDrawer />
      <ScrollToTop />
      <CouponPopup />
      <WhatsAppFloatingButton />
    </>
  );
}
