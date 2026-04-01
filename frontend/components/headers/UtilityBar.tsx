import Link from "next/link";
import { Globe } from "lucide-react";

const utilityLinks = [
  { label: "Help", href: "/help" },
  { label: "Track Order", href: "/track-order" },
  { label: "Contact", href: "/contact" },
];

export default function UtilityBar() {
  return (
    <div className="w-full border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-9 gap-5">
          {utilityLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-gray-500 hover:text-(--color-primary) transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Language Selector */}
          <button
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-(--color-primary) transition-colors"
            aria-label="Select language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>EN</span>
          </button>
        </div>
      </div>
    </div>
  );
}
