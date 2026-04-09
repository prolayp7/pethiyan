"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > 400);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={[
        "fixed bottom-6 right-6 z-50",
        "w-11 h-11 rounded-full",
        "flex items-center justify-center",
        "border transition-all duration-300 ease-out",
        "hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
      ].join(" ")}
      style={{
        background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)",
        borderColor: "transparent",
        color: "#ffffff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
