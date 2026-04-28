"use client";

import Link from "next/link";
import { useState } from "react";
import LoginModal from "@/components/auth/LoginModal";
import { useAuth } from "@/context/AuthContext";

type NavLink = { label: string; href: string };

/**
 * Renders the "Users" footer column links.
 * When the user is NOT logged in, every link opens the login/register modal
 * instead of navigating to the protected page.
 */
export default function FooterUserLinks({ links }: { links: NavLink[] }) {
  const { isLoggedIn } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  const visibleLinks = links.filter((link) => {
    if (link.label === "Login / Register") return !isLoggedIn;
    if (link.label === "My Account") return isLoggedIn;
    if (link.label === "Payments") return false;
    return true;
  });

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (isLoggedIn) return; // let Next.js navigate normally
    // Block navigation and open the modal instead
    e.preventDefault();
    setLoginOpen(true);
  }

  return (
    <>
      <ul className="space-y-3">
        {visibleLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
