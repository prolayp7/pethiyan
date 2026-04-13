"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Grid3X3, Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Account", href: "/account", icon: User },
  { label: "Categories", href: "/categories", icon: Grid3X3 },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 lg:hidden safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      aria-label="Mobile bottom navigation"
    >
      <ul className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 px-2 rounded-xl transition-colors",
                  isActive
                    ? "text-(--color-primary)"
                    : "text-gray-400 hover:text-gray-600"
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isActive && "scale-110"
                  )}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}

        {/* Cart Button */}
        <li className="flex-1">
          <button
            type="button"
            onClick={openCart}
            className="flex flex-col items-center gap-0.5 py-2 px-2 rounded-xl text-gray-400 hover:text-gray-600 transition-colors w-full relative"
            aria-label={`Cart with ${itemCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-primary) text-[9px] font-bold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
