"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

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
      className="flex gap-2 w-full md:w-auto"
      aria-label="Newsletter signup"
    >
      <div className="relative flex-1 md:w-72">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full bg-white/10 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-(--color-primary) transition-colors"
          aria-label="Email address"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2.5 bg-(--color-primary) hover:bg-(--color-primary-dark) text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
      >
        Subscribe
      </button>
    </form>
  );
}
