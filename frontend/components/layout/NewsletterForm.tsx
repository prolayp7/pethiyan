"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up newsletter API
    setEmail("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2"
      aria-label="Newsletter signup"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-1 text-sm px-4 py-3 rounded-full text-white placeholder-white/30 focus:outline-none transition-colors"
        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}
        aria-label="Email address"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="flex items-center justify-center w-11 h-11 rounded-full text-white transition-colors duration-200 shrink-0"
        style={{ background: "rgba(255,255,255,0.15)" }}
      >
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
