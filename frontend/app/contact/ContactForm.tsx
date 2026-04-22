"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, User, Phone, Mail, MessageSquare } from "lucide-react";

const SUBJECTS = [
  "Order Enquiry",
  "Product Information",
  "Bulk / Wholesale Order",
  "Custom Printing / Branding",
  "Shipping & Delivery",
  "Return / Refund",
  "Other",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", subject: "", message: "",
  });
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/lcommerce/admin"}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: `+91${form.phone}` }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json?.message ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Unable to send message. Please check your connection and try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
    setForm({ name: "", phone: "", email: "", subject: "", message: "" });
  }

  const cls = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-(--color-primary) focus:bg-white transition-colors placeholder-gray-400";

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-9 w-9 text-green-500" />
        </div>
        <h3 className="text-xl font-extrabold text-(--color-secondary) mb-2">Message Sent!</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-xs">
          Thank you for reaching out. Our team will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-sm font-bold text-(--color-primary) hover:underline"
        >
          Send another message →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={set("name")}
              className={`${cls} pl-10`}
              required
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
            Mobile Number *
          </label>
          <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:border-(--color-primary) focus-within:bg-white transition-colors">
            <div className="flex items-center gap-1 pl-3 pr-2 shrink-0 border-r border-gray-200">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-500 select-none">+91</span>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="10-digit number"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
              className="flex-1 px-3 py-3 text-sm bg-transparent outline-none placeholder-gray-400"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
            Email <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={set("email")}
              className={`${cls} pl-10`}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="contact-subject"
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block"
          >
            Subject
          </label>
          <select
            id="contact-subject"
            value={form.subject}
            onChange={set("subject")}
            className={cls}
          >
            <option value="">Select a subject</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
          Message *
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <textarea
            rows={5}
            placeholder="How can we help you? Describe your requirement or query…"
            value={form.message}
            onChange={set("message")}
            className={`${cls} pl-10 resize-none`}
            required
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)" }}
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
        ) : (
          <><Send className="h-4 w-4" /> Send Message</>
        )}
      </button>
    </form>
  );
}
