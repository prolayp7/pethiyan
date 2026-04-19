"use client";

import Link from "next/link";
import { Package, MapPin, Heart, User, ChevronRight, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

const QUICK_LINKS = [
  {
    href: "/account/orders",
    icon: Package,
    label: "My Orders",
    desc: "Track and manage your orders",
  },
  {
    href: "/account/addresses",
    icon: MapPin,
    label: "Addresses",
    desc: "Manage your saved addresses",
  },
  {
    href: "/account/wishlist",
    icon: Heart,
    label: "Wishlist",
    desc: "Products you have saved",
  },
  {
    href: "/account/profile",
    icon: User,
    label: "Profile",
    desc: "Update your personal details",
  },
];

export default function AccountPage() {
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: "var(--brand-gradient)" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm text-white/70">Welcome back,</p>
            <h1 className="text-xl font-extrabold">{user?.name}</h1>
            {user?.mobile && (
              <p className="text-sm text-white/70 mt-0.5">+91 {user.mobile}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick links grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QUICK_LINKS.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:border-(--color-primary)/30 hover:shadow-md transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-(--color-primary)/10 flex items-center justify-center shrink-0 group-hover:bg-(--color-primary)/20 transition-colors">
              <Icon className="h-5 w-5 text-(--color-primary)" />
              {label === "Wishlist" && wishlistCount > 0 && (
                <span className="sr-only">{wishlistCount} saved items</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-(--color-secondary) text-sm flex items-center gap-1">
                {label}
                {label === "Wishlist" && wishlistCount > 0 && (
                  <span className="text-[11px] font-semibold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-(--color-primary) transition-colors shrink-0" />
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center pt-2">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-primary) hover:gap-3 transition-all"
        >
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
