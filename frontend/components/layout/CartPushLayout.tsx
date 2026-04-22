"use client";

import { useCart } from "@/context/CartContext";

export default function CartPushLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useCart();

  return (
    <div
      style={{
        marginRight: isOpen ? "24rem" : "0",
        transition: "margin-right 500ms ease-in-out",
      }}
    >
      {children}
    </div>
  );
}
