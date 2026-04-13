"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import MobileInput, { isValidIndianMobile } from "@/components/auth/MobileInput";
import OtpInput from "@/components/auth/OtpInput";
import { useAuth } from "@/context/AuthContext";
import { sendOtp, verifyOtp } from "@/lib/api";
import { clearReturnToCookie, resolveLoginRedirect, writeReturnToCookie } from "@/lib/return-to";

// ─── Left panel static data ───────────────────────────────────────────────────

const FEATURED_PRODUCTS = [
  { id: 1, name: "Premium Stand-Up Kraft Pouch", price: "₹129", rating: 4.9, image: "/images/products/1.jpg" },
  { id: 2, name: "Foil Zip Lock Pouch",          price: "₹99",  rating: 4.8, image: "/images/products/2.jpg" },
  { id: 3, name: "Custom Window Bag",             price: "₹84",  rating: 4.7, image: "/images/products/3.jpg" },
  { id: 4, name: "Eco Kraft Paper Bag",           price: "₹69",  rating: 4.8, image: "/images/products/4.jpg" },
  { id: 5, name: "Matte Black Pouch",             price: "₹114", rating: 4.9, image: "/images/products/5.jpg" },
  { id: 6, name: "Clear PET Stand-Up",            price: "₹79",  rating: 4.6, image: "/images/products/6.jpg" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Secure Login" },
  { icon: Truck,       label: "Fast Shipping" },
  { icon: RotateCcw,   label: "Easy Returns" },
];

const RESEND_COOLDOWN = 60; // seconds

// ─── Step types ───────────────────────────────────────────────────────────────

type Step = "phone" | "otp" | "success";

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggedIn } = useAuth();

  const redirectTo = resolveLoginRedirect(searchParams.get("redirect"), "/account");

  useEffect(() => {
    const requestedRedirect = searchParams.get("redirect");
    if (requestedRedirect) {
      writeReturnToCookie(requestedRedirect);
    }
  }, [searchParams]);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (isLoggedIn) router.replace(redirectTo);
  }, [isLoggedIn, redirectTo, router]);

  // ── Form state ──
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // ── Countdown timer for resend ──
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ── Send OTP ──
  const handleSendOtp = async () => {
    setPhoneError("");
    if (!isValidIndianMobile(phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number (starts with 6–9).");
      return;
    }
    setLoading(true);
    const result = await sendOtp(phone);
    setLoading(false);

    if (result.success) {
      setStep("otp");
      setCountdown(RESEND_COOLDOWN);
    } else {
      setPhoneError(result.message ?? "Failed to send OTP. Please try again.");
    }
  };

  // ── Resend OTP ──
  const handleResend = useCallback(async () => {
    if (countdown > 0) return;
    setOtp("");
    setOtpError("");
    setLoading(true);
    const result = await sendOtp(phone);
    setLoading(false);
    if (result.success) {
      setCountdown(RESEND_COOLDOWN);
    } else {
      setOtpError(result.message ?? "Failed to resend OTP.");
    }
  }, [countdown, phone]);

  // ── Verify OTP ──
  const handleVerifyOtp = async () => {
    setOtpError("");
    if (otp.replace(/\D/g, "").length < 6) {
      setOtpError("Please enter the complete 6-digit OTP.");
      return;
    }
    setLoading(true);
    const result = await verifyOtp(phone, otp);
    setLoading(false);

    if (result.success && result.user) {
      login(result.user);
      clearReturnToCookie();
      setStep("success");
      // Redirect after brief success animation
      setTimeout(() => router.replace(redirectTo), 1800);
    } else {
      setOtpError(result.message ?? "Incorrect OTP. Please try again.");
      setOtp("");
    }
  };

  // ── Submit on Enter key ──
  const handlePhoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendOtp();
  };
  const handleOtpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && otp.length === 6) handleVerifyOtp();
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#f7f9fc" }}>

      {/* ══ LEFT: Brand + Product Showcase ══ */}
      <div
        className="hidden lg:flex lg:w-[55%] xl:w-[60%] flex-col relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#0f2f5f 0%,#1f4f8a 45%,#163d6e 100%)" }}
        aria-hidden="true"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle,#4caf50,transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle,#4caf50,transparent 70%)" }} />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <Link href="/">
            <Image src="/pethiyan-logo.png" alt="Pethiyan" width={160} height={70}
              className="h-16 w-auto object-contain brightness-0 invert" />
          </Link>
          <p className="mt-3 text-blue-200 text-sm">The Power of Perfect Packaging</p>
        </div>

        {/* Hero text */}
        <div className="relative z-10 px-10 pb-6">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
            Premium Packaging<br />
            <span style={{ color: "#4caf50" }}>Delivered to You</span>
          </h2>
          <p className="mt-3 text-blue-200 text-sm leading-relaxed max-w-sm">
            Join 50,000+ businesses that trust Pethiyan for custom pouches, kraft bags,
            and eco-friendly packaging solutions.
          </p>
          <div className="mt-5 flex gap-5">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-blue-200 text-xs">
                <Icon className="h-4 w-4 text-green-400" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="relative z-10 flex-1 px-10 pb-10 overflow-hidden">
          <p className="text-xs font-bold tracking-widest text-blue-300 uppercase mb-4">
            Top Selling Products
          </p>
          <div className="grid grid-cols-3 gap-3">
            {FEATURED_PRODUCTS.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`}
                className="group rounded-xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image src={p.image} alt={p.name} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2.5">
                  <p className="text-white text-xs font-medium leading-snug line-clamp-1">{p.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-green-400 text-xs font-bold">{p.price}</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-blue-200 text-[10px]">{p.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT: Auth Form ══ */}
      <div className="flex-1 flex items-center justify-center bg-white min-h-screen px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <Image src="/pethiyan-logo.png" alt="Pethiyan" width={140} height={60}
                className="mx-auto h-14 w-auto object-contain" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* ── Step: Phone ── */}
            {step === "phone" && (
              <div className="p-8 space-y-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-(--color-secondary)">
                    Sign in to Pethiyan
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter your mobile number to receive a one-time password
                  </p>
                </div>

                <div onKeyDown={handlePhoneKeyDown}>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Mobile Number
                  </label>
                  <MobileInput
                    value={phone}
                    onChange={setPhone}
                    error={phoneError}
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading || phone.length < 10}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: "linear-gradient(135deg,#1f4f8a 0%,#0f2f5f 100%)" }}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  By continuing you agree to our{" "}
                  <Link href="/terms-and-conditions" className="underline hover:text-gray-600">Terms</Link>
                  {" "}&amp;{" "}
                  <Link href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</Link>
                </p>
              </div>
            )}

            {/* ── Step: OTP ── */}
            {step === "otp" && (
              <div className="p-8 space-y-6">
                {/* Back button */}
                <button
                  onClick={() => { setStep("phone"); setOtp(""); setOtpError(""); }}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-(--color-primary) transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Change number
                </button>

                <div>
                  <h2 className="text-2xl font-extrabold text-(--color-secondary)">
                    Enter OTP
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    We sent a 6-digit code to{" "}
                    <strong className="text-(--color-secondary)">+91 {phone}</strong>
                  </p>
                </div>

                <div onKeyDown={handleOtpKeyDown}>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    error={otpError}
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.replace(/\D/g, "").length < 6}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: "linear-gradient(135deg,#1f4f8a 0%,#0f2f5f 100%)" }}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Verify OTP
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Resend */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-xs text-gray-400">
                      Resend OTP in{" "}
                      <span className="font-semibold text-(--color-primary) tabular-nums">
                        {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                        {String(countdown % 60).padStart(2, "0")}
                      </span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--color-primary) hover:text-(--color-primary-dark) transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── Step: Success ── */}
            {step === "success" && (
              <div className="p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[280px]">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center animate-in zoom-in-95">
                  <CheckCircle2 className="h-9 w-9 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-(--color-secondary)">
                    You&apos;re logged in!
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Redirecting you now…
                  </p>
                </div>
                <Loader2 className="h-5 w-5 text-(--color-primary) animate-spin" />
              </div>
            )}
          </div>

          {/* Mobile product strip */}
          <div className="lg:hidden mt-8">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase text-center mb-4">
              Top Products
            </p>
            <div className="grid grid-cols-3 gap-3">
              {FEATURED_PRODUCTS.slice(0, 3).map((p) => (
                <Link key={p.id} href={`/products/${p.id}`}
                  className="group rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image src={p.image} alt={p.name} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                    <p className="text-xs text-green-600 font-bold mt-0.5">{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
