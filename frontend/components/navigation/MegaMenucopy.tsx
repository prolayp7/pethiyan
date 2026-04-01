"use client";

import Link from "next/link";
import { Package, Tag, Archive, Palette, Leaf } from "lucide-react";

const categories = [
  {
    label: "Packaging Bags",
    href: "/categories/packaging-bags",
    icon: Package,
    description: "Versatile bags for all products",
  },
  {
    label: "Ziplock Pouches",
    href: "/categories/ziplock-pouches",
    icon: Tag,
    description: "Resealable and airtight pouches",
  },
  {
    label: "Standup Pouches",
    href: "/categories/standup-pouches",
    icon: Archive,
    description: "Premium self-standing bags",
  },
  {
    label: "Custom Packaging",
    href: "/categories/custom-packaging",
    icon: Palette,
    description: "Branded and custom designs",
  },
  {
    label: "Eco Packaging",
    href: "/categories/eco-packaging",
    icon: Leaf,
    description: "Sustainable packaging solutions",
  },
];

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                onClick={onClose}
                className="group flex flex-col items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-(--color-primary)/10 flex items-center justify-center group-hover:bg-(--color-primary)/20 transition-colors">
                  <Icon className="h-5 w-5 text-(--color-primary)" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-(--color-primary) transition-colors">
                    {cat.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <Link
            href="/categories"
            className="text-sm font-medium text-(--color-primary) hover:underline"
            onClick={onClose}
          >
            Browse all categories →
          </Link>
        </div>
      </div>
    </div>
  );
}
