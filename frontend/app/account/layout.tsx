"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Package, MapPin, Heart, User, LogOut, ChevronRight, Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

const NAV_ITEMS = [
  { href: "/account/orders",    label: "My Orders",  icon: Package },
  { href: "/account/addresses", label: "Addresses",  icon: MapPin  },
  { href: "/account/wishlist",  label: "Wishlist",   icon: Heart   },
  { href: "/account/profile",   label: "Profile",    icon: User    },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isLoggedIn, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <Loader2 className="h-8 w-8 animate-spin text-(--color-primary)" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-(--color-primary)">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-(--color-secondary) font-medium">My Account</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-3">

            {/* User card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ background: "linear-gradient(135deg,#1f4f8a,#0f2f5f)" }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-(--color-secondary) truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400">+91 {user?.mobile}</p>
                  {user?.email && (
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile tab bar */}
            <div className="flex lg:hidden overflow-x-auto gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-4">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-xl text-[11px] font-semibold transition-colors whitespace-nowrap min-w-fit ${
                      active ? "bg-blue-50 text-(--color-primary)" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {NAV_ITEMS.map(({ href, label, icon: Icon }, i) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                const badge  = label === "Wishlist" && wishlistCount > 0 ? wishlistCount : null;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-colors ${
                      i > 0 ? "border-t border-gray-50" : ""
                    } ${active
                      ? "bg-blue-50 text-(--color-primary)"
                      : "text-gray-600 hover:bg-gray-50 hover:text-(--color-secondary)"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-(--color-primary)" : "text-gray-400"}`} />
                    {label}
                    {badge && (
                      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-(--color-primary) text-white">
                        {badge}
                      </span>
                    )}
                    <ChevronRight className={`h-3.5 w-3.5 ml-auto ${active ? "text-(--color-primary)" : "text-gray-200"}`} />
                  </Link>
                );
              })}

              <button
                onClick={() => { logout(); router.push("/"); }}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold border-t border-gray-100 text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* ── Content ── */}
          <main className="lg:col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
