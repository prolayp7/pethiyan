"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, Heart, MapPin, LogOut, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginModal from "@/components/auth/LoginModal";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { label: "Account", href: "/account", icon: User },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
];

export default function UserMenu() {
  const [loginOpen, setLoginOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <>
      {isLoggedIn ? (
        /* Logged-in: show dropdown */
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="User menu">
              <User className="h-7 w-7 text-gray-700" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-semibold text-gray-800 truncate">
              {user?.name ?? "My Account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {menuItems.map(({ label, href, icon: Icon }) => (
              <DropdownMenuItem key={label} asChild>
                <Link href={href} className="flex items-center gap-2 text-gray-700">
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500 focus:bg-red-50"
              onSelect={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        /* Guest: clicking opens login modal */
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Account">
              <User className="h-7 w-7 text-gray-700" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-gray-500 font-normal text-xs">
              Sign in for the best experience
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setLoginOpen(true)}>
              <LogIn className="h-4 w-4 mr-2 text-gray-600" />
              Sign In / Register
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
