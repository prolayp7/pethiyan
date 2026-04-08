"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Phone, Mail, Save, Loader2, CheckCircle2, LogOut, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/lib/api";

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();

  const [name,    setName]    = useState(user?.name ?? "");
  const [email,   setEmail]   = useState(user?.email ?? "");
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isDirty = name !== (user?.name ?? "") || email !== (user?.email ?? "");

  async function handleSave() {
    if (!name.trim()) { setError("Name cannot be empty."); return; }
    setError("");
    setSaving(true);
    const result = await updateProfile({ name: name.trim(), email: email.trim() || undefined });
    setSaving(false);
    if (result.success) {
      updateUser({ name: name.trim(), email: email.trim() || null });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.message ?? "Update failed. Please try again.");
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-(--color-primary) focus:bg-white transition-colors";

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-5 w-5 text-(--color-primary)" />
        <h1 className="text-xl font-extrabold text-(--color-secondary)">Profile</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-extrabold text-(--color-secondary)">Account Information</h2>

        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Your full name"
              className={`${inputCls} pl-10`}
            />
          </div>
        </div>

        {/* Phone (readonly) */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
            Mobile Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              value={`+91 ${user?.mobile ?? ""}`}
              readOnly
              className={`${inputCls} pl-10 opacity-60 cursor-not-allowed`}
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Mobile number cannot be changed.</p>
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
            Email Address <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="your@email.com"
              className={`${inputCls} pl-10`}
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Used for order confirmation emails and GST invoices.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Profile updated successfully!
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="btn-brand w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="h-4 w-4" /> Save Changes</>
          )}
        </button>
      </div>

      {/* Danger zone */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-extrabold text-(--color-secondary) mb-4">Account Actions</h2>

        {!showLogoutConfirm ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100">
            <p className="text-sm font-semibold text-red-700 mb-3">
              Are you sure you want to sign out?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Yes, Sign Out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
