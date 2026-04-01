"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-(--color-accent) shrink-0" aria-hidden="true" />
        <p className="text-sm text-white/70">
          You&apos;re in. Welcome to the Pethiyan community.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" aria-label="Newsletter signup">
      {/* Flat underline-style input — minimal, editorial */}
      <div
        className={cn(
          "flex items-center gap-4 border-b pb-3 transition-colors duration-300",
          focused ? "border-white/60" : "border-white/15"
        )}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="your@email.com"
          required
          className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none min-w-0"
          aria-label="Email address"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors shrink-0 group"
          aria-label="Subscribe to newsletter"
        >
          Subscribe
          <ArrowRight
            className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform"
            aria-hidden="true"
          />
        </button>
      </div>
      <p className="mt-2.5 text-[11px] text-white/20">
        No spam. Unsubscribe at any time.
      </p>
    </form>
  );
}
