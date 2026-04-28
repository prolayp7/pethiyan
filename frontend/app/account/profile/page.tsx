"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Phone, Mail, Save, Loader2, CheckCircle2, LogOut, AlertCircle, Building2, Lock, Eye, EyeOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { changePassword, updateProfile } from "@/lib/api";

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();

  const [name,    setName]    = useState(user?.name ?? "");
  const [email,   setEmail]   = useState(user?.email ?? "");
  const [companyName, setCompanyName] = useState(user?.company_name ?? "");
  const [gstin,   setGstin]   = useState(user?.gstin ?? "");
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isDirty =
    name !== (user?.name ?? "") ||
    email !== (user?.email ?? "") ||
    companyName !== (user?.company_name ?? "") ||
    gstin !== (user?.gstin ?? "");

  async function handleSave() {
    if (!name.trim()) { setError("Name cannot be empty."); return; }
    setError("");
    setSaving(true);
    const result = await updateProfile({
      name: name.trim(),
      email: email.trim() || undefined,
      company_name: companyName.trim() || undefined,
      gstin: gstin.trim() || undefined
    });
    setSaving(false);
    if (result.success) {
      updateUser({
        name: name.trim(),
        email: email.trim() || null,
        company_name: companyName.trim() || null,
        gstin: gstin.trim() || null
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.message ?? "Update failed. Please try again.");
    }
  }

  const isPasswordDirty =
    currentPassword.trim().length > 0 ||
    newPassword.trim().length > 0 ||
    confirmPassword.trim().length > 0;

  async function handlePasswordSave() {
    if (!currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }
    if (!newPassword) {
      setPasswordError("New password is required.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setPasswordError("");
    setPasswordSaving(true);
    const result = await changePassword({
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: confirmPassword,
    });
    setPasswordSaving(false);

    if (result.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
      return;
    }

    setPasswordError(result.message ?? "Password update failed. Please try again.");
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-(--color-primary) focus:bg-white transition-colors";
  const passwordInputCls = `${inputCls} pl-10 pr-11`;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-5 w-5 text-(--color-primary)" />
        <h1 className="text-xl font-extrabold text-(--color-secondary)">Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── Left: Account Information ── */}
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
                title="Mobile number"
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

          {/* Company name */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Company Name <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => { setCompanyName(e.target.value); setError(""); }}
                placeholder="Company / Business name"
                className={`${inputCls} pl-10`}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Used for business invoices and order records.</p>
          </div>

          {/* GSTIN */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              GSTIN <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={gstin}
                onChange={(e) => { setGstin(e.target.value.toUpperCase()); setError(""); }}
                placeholder="e.g. 07AAAAA0000A1Z5"
                maxLength={15}
                className={`${inputCls} pl-10`}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Add GSTIN to get GST-enabled invoices.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Profile updated successfully!
            </div>
          )}

          <button
            type="button"
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

        {/* ── Right: Change Password + Account Actions ── */}
        <div className="space-y-6">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-extrabold text-(--color-secondary)">Change Password</h2>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(""); }}
                  placeholder="Enter your current password"
                  className={passwordInputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordError(""); }}
                  placeholder="Minimum 8 characters"
                  className={passwordInputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); }}
                  placeholder="Re-enter new password"
                  className={passwordInputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Use at least 8 characters for your new password.</p>
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Password updated successfully!
              </div>
            )}

            <button
              type="button"
              onClick={handlePasswordSave}
              disabled={passwordSaving || !isPasswordDirty}
              className="btn-brand w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {passwordSaving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Updating Password…</>
              ) : (
                <><Lock className="h-4 w-4" /> Update Password</>
              )}
            </button>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-extrabold text-(--color-secondary) mb-4">Account Actions</h2>

            {!showLogoutConfirm ? (
              <button
                type="button"
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
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Yes, Sign Out
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>{/* end right column */}
      </div>{/* end grid */}
    </div>
  );
}
