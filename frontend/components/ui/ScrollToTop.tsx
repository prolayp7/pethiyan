"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 400);
  }, []);

  useEffect(() => {
    setMounted(true);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mounted) return null;

  return createPortal(
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={[
        "fixed bottom-24 right-4 z-[9999] lg:bottom-6 lg:right-6",
        "w-11 h-11 rounded-full",
        "flex items-center justify-center",
        "border border-transparent text-white",
        "bg-[linear-gradient(135deg,#17396f_0%,#2f6f9f_52%,#49ad57_100%)]",
        "shadow-[0_4px_24px_rgba(0,0,0,0.3)]",
        "transition-all duration-300 ease-out",
        "hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
      ].join(" ")}
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>,
    document.body
  );
}
