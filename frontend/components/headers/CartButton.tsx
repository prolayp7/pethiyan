"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartButtonProps {
  onClick: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { itemCount } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label={`Cart with ${itemCount} items`}
    >
      <ShoppingBag className="h-7 w-7 text-gray-700" />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-(--color-primary) text-[10px] font-bold text-white leading-[18px] text-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
