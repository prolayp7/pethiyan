"use client";

import Link from "next/link";
import { X, ChevronDown, HelpCircle, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { ApiMenuItem } from "@/lib/api";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems?: ApiMenuItem[];
}

const utilityItems = [
  { label: "Help Center", href: "/help", icon: HelpCircle },
  { label: "Track Order", href: "/track-order", icon: MapPin },
  { label: "Contact Us", href: "/contact", icon: Phone },
];

/* ── Shop dropdown accordion ─────────────────────────────────── */
function ShopAccordion({ item, onClose }: { item: ApiMenuItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-gray-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        aria-expanded={open ? "true" : "false"}
      >
        <span className="text-[15px] font-semibold text-gray-800">{item.label}</span>
        <ChevronDown
          className={cn("h-4 w-4 text-gray-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && item.shop_dropdown_items && item.shop_dropdown_items.length > 0 && (
        <ul className="pb-3 px-3">
          {item.shop_dropdown_items.map((sub) => (
            <li key={sub.id}>
              <Link
                href={sub.href}
                target={sub.target === "_blank" ? "_blank" : undefined}
                onClick={onClose}
                className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                {sub.accent_color && (
                  <span
                    className="mt-[5px] w-2 h-2 rounded-full shrink-0"
                    // eslint-disable-next-line react/forbid-dom-props
                    style={{ background: sub.accent_color }}
                    aria-hidden="true"
                  />
                )}
                <div>
                  <p className="text-[13px] font-semibold text-gray-700 group-hover:text-[#1f4f8a] transition-colors">
                    {sub.label}
                  </p>
                  {sub.description && (
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{sub.description}</p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/* ── Mega-menu (categories) accordion ────────────────────────── */
function MegaAccordion({ item, onClose }: { item: ApiMenuItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<number | null>(null);

  return (
    <li className="border-b border-gray-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        aria-expanded={open ? "true" : "false"}
      >
        <span className="text-[15px] font-semibold text-gray-800">{item.label}</span>
        <ChevronDown
          className={cn("h-4 w-4 text-gray-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && item.mega_menu_panels && item.mega_menu_panels.length > 0 && (
        <div className="pb-3">
          {item.mega_menu_panels.map((panel) => {
            const panelOpen = activePanel === panel.id;
            const allLinks = panel.columns.flatMap((col) => col.links);

            return (
              <div key={panel.id}>
                <button
                  type="button"
                  onClick={() => setActivePanel(panelOpen ? null : panel.id)}
                  className="w-full flex items-center justify-between px-5 py-2.5 text-left hover:bg-gray-50 transition-colors"
                  aria-expanded={panelOpen ? "true" : "false"}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      // eslint-disable-next-line react/forbid-dom-props
                      style={{ background: panel.accent_color }}
                      aria-hidden="true"
                    />
                    <span className="text-[13px] font-semibold text-gray-700">{panel.label}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-gray-400 transition-transform duration-200",
                      panelOpen && "rotate-180"
                    )}
                  />
                </button>

                {panelOpen && allLinks.length > 0 && (
                  <ul className="pb-1 px-8">
                    {allLinks.map((link) => (
                      <li key={link.id}>
                        <Link
                          href={link.href}
                          target={link.target === "_blank" ? "_blank" : undefined}
                          onClick={onClose}
                          className="block py-1.5 text-[12px] text-gray-500 hover:text-[#1f4f8a] transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}

          {/* View-all link */}
          <div className="px-5 pt-2">
            <Link
              href={item.href}
              onClick={onClose}
              className="block text-center py-2 text-[12px] font-bold text-white rounded-lg bg-[#1f4f8a] hover:bg-[#17396f] transition-colors"
            >
              View All Categories →
            </Link>
          </div>
        </div>
      )}
    </li>
  );
}

/* ── Main component ──────────────────────────────────────────── */
export default function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <span className="text-lg font-bold text-slate-800">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto" aria-label="Mobile navigation">
          <ul>
            {navItems?.map((item) => {
              if (item.type === "shop_dropdown") {
                return <ShopAccordion key={item.id} item={item} onClose={onClose} />;
              }
              if (item.type === "mega_menu") {
                return <MegaAccordion key={item.id} item={item} onClose={onClose} />;
              }
              return (
                <li key={item.id} className="border-b border-gray-100">
                  <Link
                    href={item.href}
                    target={item.target === "_blank" ? "_blank" : undefined}
                    onClick={onClose}
                    className="flex items-center justify-between px-5 py-4 text-[15px] font-semibold text-gray-800 hover:text-[#1f4f8a] hover:bg-gray-50 transition-colors"
                  >
                    {item.label}
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white bg-red-500">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Utility footer */}
        <div className="border-t border-gray-100 py-4 px-5 space-y-1 shrink-0">
          {utilityItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm text-gray-600 hover:text-[#1f4f8a] hover:bg-gray-50 transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
