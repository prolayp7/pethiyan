"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight, Mail, User as UserIcon, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MobileInput, { isValidIndianMobile } from "@/components/auth/MobileInput";
import OtpInput from "@/components/auth/OtpInput";
import { sendOtp, verifyOtp, resendOtp, registerUser, verifyMobile, loginWithPassword, googleCallback } from "@/lib/api";
import { signInWithGoogle } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type { AuthUser } from "@/context/AuthContext";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  redirectTo?: string;
}

type Tab = "login" | "register";
type Step = "form" | "otp";

const RESEND_SECONDS = 60;

// ── Validators ──────────────────────────────────────────────────────────────

function validateName(name: string): string {
  if (!name) return "Full name is required";
  if (/^\s|\s$/.test(name)) return "No leading or trailing spaces allowed";
  if (/  /.test(name)) return "Only one space between words is allowed";
  if (!/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(name)) return "Only letters and single spaces between words are allowed";
  return "";
}

function validateEmail(email: string): string {
  if (!email) return "Email address is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
  return "";
}

function validatePassword(pw: string): string {
  if (!pw) return "Password is required";
  if (/\s/.test(pw)) return "Password must not contain spaces";
  if (pw.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(pw)) return "At least one uppercase letter required";
  if (!/[a-z]/.test(pw)) return "At least one lowercase letter required";
  if (!/[0-9]/.test(pw)) return "At least one number required";
  if (!/[#_%$@!]/.test(pw)) return "At least one special character required (#  _  %  $  @  !)";
  if (/[^A-Za-z0-9#_%$@!]/.test(pw)) return "Only # _ % $ @ ! are allowed as special characters";
  return "";
}

// ── Component ────────────────────────────────────────────────────────────────

export default function LoginModal({ open, onClose, onSuccess, redirectTo }: LoginModalProps) {
  const router = useRouter();
  const { login } = useAuth();

  const completeLogin = useCallback((user: AuthUser, token: string) => {
    login(user, token);
    onClose();
    onSuccess?.();
    if (!onSuccess) {
      router.push(redirectTo || "/account");
    }
  }, [login, onClose, onSuccess, redirectTo, router]);

  const [tab, setTab] = useState<Tab>("login");
  const [step, setStep] = useState<Step>("form");

  // Login fields
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [loginIdentifier, setLoginIdentifier] = useState(""); // email or mobile for password login
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginMobile, setLoginMobile] = useState(""); // mobile for OTP login

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP
  const [otp, setOtp] = useState("");

  // After register, hold the token until mobile is verified
  const pendingAuth = useRef<{ token: string; user: AuthUser } | null>(null);

  // Google new-user completion state
  const [googleIdToken, setGoogleIdToken] = useState<string | null>(null);
  const [googleNewUserMobile, setGoogleNewUserMobile] = useState("");
  const [googleNewUserPassword, setGoogleNewUserPassword] = useState("");
  const [googleNewUserConfirm, setGoogleNewUserConfirm] = useState("");
  const [showGooglePassword, setShowGooglePassword] = useState(false);
  const [showGoogleConfirm, setShowGoogleConfirm] = useState(false);
  const [googleStep, setGoogleStep] = useState(false); // true = collecting mobile+pw for new Google user

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState<Set<string>>(new Set());
  const [apiError, setApiError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [demoOtp, setDemoOtp] = useState<string | undefined>(undefined);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setStep("form");
      setLoginMode("password");
      setLoginIdentifier(""); setLoginPassword(""); setShowLoginPassword(false);
      setLoginMobile("");
      setRegName(""); setRegEmail(""); setRegMobile("");
      setRegPassword(""); setRegConfirmPassword("");
      setOtp("");
      setErrors({});
      setShaking(new Set());
      setApiError("");
      setCountdown(0);
      setDemoOtp(undefined);
      setGoogleIdToken(null); setGoogleStep(false);
      setGoogleNewUserMobile(""); setGoogleNewUserPassword(""); setGoogleNewUserConfirm("");
      pendingAuth.current = null;
    }
  }, [open]);

  // Reset when switching tabs
  useEffect(() => {
    setStep("form");
    setLoginMode("password");
    setLoginIdentifier(""); setLoginPassword(""); setShowLoginPassword(false);
    setLoginMobile("");
    setOtp("");
    setErrors({});
    setShaking(new Set());
    setApiError("");
    setDemoOtp(undefined);
    setGoogleIdToken(null); setGoogleStep(false);
    setGoogleNewUserMobile(""); setGoogleNewUserPassword(""); setGoogleNewUserConfirm("");
    pendingAuth.current = null;
  }, [tab]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const startCountdown = useCallback(() => setCountdown(RESEND_SECONDS), []);

  // Auto-submit when all 6 OTP digits are entered
  useEffect(() => {
    if (step === "otp" && otp.length === 6 && !loading) {
      if (tab === "login") handleLoginVerifyOtp();
      else handleRegisterVerifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  if (!open) return null;

  // ── Helpers ───────────────────────────────────────────────────────────────────

  function triggerShake(fields: string[]) {
    setShaking(new Set(fields));
    setTimeout(() => setShaking(new Set()), 520);
  }

  function setFieldError(field: string, msg: string) {
    setErrors((prev) => {
      if (prev[field] === msg) return prev;
      if (!msg) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return { ...prev, [field]: msg };
    });
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  function validateIdentifier(val: string): string {
    if (!val.trim()) return "Enter your email or mobile number";
    const isNumeric = /^\d+$/.test(val.trim());
    if (isNumeric) return isValidIndianMobile(val.trim()) ? "" : "Enter a valid 10-digit mobile number";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) ? "" : "Enter a valid email address";
  }

  function validateLoginPasswordField(pw: string): string {
    if (!pw) return "Password is required";
    return "";
  }

  function validatePasswordLoginForm(): boolean {
    const errs: Record<string, string> = {};
    const idErr = validateIdentifier(loginIdentifier);
    if (idErr) errs.loginIdentifier = idErr;
    const pwErr = validateLoginPasswordField(loginPassword);
    if (pwErr) errs.loginPassword = pwErr;
    setErrors(errs);
    if (Object.keys(errs).length) triggerShake(Object.keys(errs));
    return Object.keys(errs).length === 0;
  }

  function validateOtpLoginForm(): boolean {
    const errs: Record<string, string> = {};
    if (!isValidIndianMobile(loginMobile)) errs.loginMobile = "Enter a valid 10-digit mobile number";
    setErrors(errs);
    if (Object.keys(errs).length) triggerShake(Object.keys(errs));
    return Object.keys(errs).length === 0;
  }

  function validateRegisterForm(): boolean {
    const errs: Record<string, string> = {};
    const nameErr = validateName(regName);
    if (nameErr) errs.regName = nameErr;
    const emailErr = validateEmail(regEmail);
    if (emailErr) errs.regEmail = emailErr;
    if (!isValidIndianMobile(regMobile)) errs.regMobile = "Enter a valid 10-digit mobile number";
    const pwErr = validatePassword(regPassword);
    if (pwErr) errs.regPassword = pwErr;
    if (!regConfirmPassword) {
      errs.regConfirmPassword = "Please confirm your password";
    } else if (regPassword !== regConfirmPassword) {
      errs.regConfirmPassword = "Passwords do not match";
    }
    setErrors(errs);
    if (Object.keys(errs).length) triggerShake(Object.keys(errs));
    return Object.keys(errs).length === 0;
  }

  // ── Login handlers ────────────────────────────────────────────────────────────

  async function handleLoginWithPassword(e: React.SyntheticEvent) {
    e.preventDefault();
    setApiError("");
    if (!validatePasswordLoginForm()) return;
    setLoading(true);
    try {
      const res = await loginWithPassword(loginIdentifier, loginPassword);
      if (res.success && res.token && res.user) { completeLogin(res.user, res.token); }
      else setApiError(res.message ?? "Invalid credentials. Please try again.");
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  async function handleLoginSendOtp(e: React.SyntheticEvent) {
    e.preventDefault();
    setApiError("");
    if (!validateOtpLoginForm()) return;
    setLoading(true);
    try {
      const res = await sendOtp(loginMobile);
      if (res.success) { setDemoOtp(res.demoOtp); setStep("otp"); startCountdown(); }
      else setApiError(res.message ?? "Failed to send OTP. Please try again.");
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  async function handleLoginVerifyOtp(e?: React.SyntheticEvent) {
    e?.preventDefault();
    setApiError("");
    if (otp.length !== 6) { setErrors({ otp: "Enter the 6-digit OTP" }); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await verifyOtp(loginMobile, otp);
      if (res.success && res.token && res.user) { completeLogin(res.user, res.token); }
      else setApiError(res.message ?? "Invalid OTP. Please try again.");
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  // ── Register handlers ─────────────────────────────────────────────────────────

  async function handleRegisterSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setApiError("");
    if (!validateRegisterForm()) return;
    setLoading(true);
    try {
      const res = await registerUser({
        name: regName.trim(),
        email: regEmail.trim(),
        mobile: regMobile,
        password: regPassword,
        password_confirmation: regConfirmPassword,
      });
      if (res.success && res.token && res.user) {
        pendingAuth.current = { token: res.token, user: res.user };
        setStep("otp");
        startCountdown();
      } else setApiError(res.message ?? "Registration failed. Please try again.");
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  async function handleRegisterVerifyOtp(e?: React.SyntheticEvent) {
    e?.preventDefault();
    setApiError("");
    if (otp.length !== 6) { setErrors({ otp: "Enter the 6-digit OTP" }); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await verifyMobile(regMobile, otp);
      if (res.success && pendingAuth.current) { completeLogin(pendingAuth.current.user, pendingAuth.current.token); }
      else setApiError(res.message ?? "Invalid OTP. Please try again.");
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  // ── Google Sign-In ───────────────────────────────────────────────────────────

  async function handleGoogleSignIn() {
    setApiError("");
    setLoading(true);
    try {
      const { idToken } = await signInWithGoogle();
      const res = await googleCallback(idToken);

      if (res.success) {
        completeLogin(res.user, res.token);
        return;
      }

      if (res.isNewUser) {
        // Need mobile + password to complete registration
        setGoogleIdToken(idToken);
        setGoogleStep(true);
        return;
      }

      setApiError(res.message ?? "Google sign-in failed. Please try again.");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      setApiError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleNewUserComplete(e: React.SyntheticEvent) {
    e.preventDefault();
    setApiError("");
    const errs: Record<string, string> = {};
    if (!isValidIndianMobile(googleNewUserMobile)) errs.googleMobile = "Enter a valid 10-digit mobile number";
    const pwErr = validatePassword(googleNewUserPassword);
    if (pwErr) errs.googlePassword = pwErr;
    if (googleNewUserPassword !== googleNewUserConfirm) errs.googleConfirm = "Passwords do not match";
    if (Object.keys(errs).length) { setErrors(errs); triggerShake(Object.keys(errs)); return; }

    setLoading(true);
    try {
      const res = await googleCallback(googleIdToken!, {
        mobile: googleNewUserMobile,
        password: googleNewUserPassword,
        password_confirmation: googleNewUserConfirm,
      });
      if (res.success) {
        completeLogin(res.user, res.token);
      } else {
        setApiError(res.message ?? "Registration failed. Please try again.");
      }
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  // ── Resend OTP ────────────────────────────────────────────────────────────────

  async function handleResend() {
    if (countdown > 0) return;
    setApiError("");
    setLoading(true);
    try {
      const mobile = tab === "login" ? loginMobile : regMobile;
      const res = await resendOtp(mobile);
      if (res.success) { setOtp(""); setDemoOtp(res.demoOtp); startCountdown(); }
      else setApiError(res.message ?? "Could not resend OTP.");
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  // ── Field class helper ────────────────────────────────────────────────────────

  function fieldCls(field: string, extra = "") {
    const hasErr = !!errors[field];
    const isShaking = shaking.has(field);
    return [
      "w-full rounded-xl border text-sm outline-none transition-colors bg-gray-50 focus:bg-white",
      hasErr ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400",
      isShaking ? "shake" : "",
      extra,
    ].join(" ");
  }

  const isOtpStep = step === "otp";
  const mobileSummary = tab === "login" ? loginMobile : regMobile;
  const handleVerifyOtp = tab === "login" ? handleLoginVerifyOtp : handleRegisterVerifyOtp;

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      style={{ background: "rgba(15,47,95,0.55)", backdropFilter: "blur(4px)" }}
      onClick={handleBackdrop}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close">
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Brand strip */}
        <div className="px-8 pt-8 pb-5 text-center" style={{ background: "linear-gradient(135deg,#1f4f8a 0%,#0f2f5f 100%)" }}>
          <Image src="/pethiyan-logo.png" alt="Pethiyan" width={120} height={60} className="mx-auto h-14 w-auto object-contain brightness-0 invert" />
          <p className="mt-2 text-sm text-blue-200">The Power of Perfect Packaging</p>
        </div>

        {/* Tabs */}
        {!isOtpStep && !googleStep && (
          <div className="flex border-b border-gray-100">
            {(["login", "register"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className="flex-1 py-3.5 text-sm font-semibold transition-colors relative" style={{ color: tab === t ? "#1f4f8a" : "#6b7280" }}>
                {t === "login" ? "Sign In" : "Create Account"}
                {tab === t && <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full" style={{ background: "#4caf50" }} />}
              </button>
            ))}
          </div>
        )}

        <div className="px-8 py-6">

          {/* ── GOOGLE NEW USER STEP ── */}
          {googleStep ? (
            <form onSubmit={handleGoogleNewUserComplete} className="space-y-3">
              <button type="button" onClick={() => { setGoogleStep(false); setGoogleIdToken(null); setErrors({}); setApiError(""); }} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                ← Back
              </button>
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-gray-900">Almost there!</h3>
                <p className="text-xs text-gray-500">Add your mobile and set a password to complete sign-up</p>
              </div>

              <div className={shaking.has("googleMobile") ? "shake" : ""}>
                <MobileInput
                  value={googleNewUserMobile}
                  onChange={(v) => { setGoogleNewUserMobile(v); setFieldError("googleMobile", isValidIndianMobile(v) ? "" : "Enter a valid 10-digit mobile number"); }}
                  error={errors.googleMobile}
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div>
                <div className={`relative flex items-center ${shaking.has("googlePassword") ? "shake" : ""}`}>
                  <span className="absolute left-4 text-gray-400"><Lock className="h-4 w-4" /></span>
                  <input type={showGooglePassword ? "text" : "password"} placeholder="Create password *"
                    value={googleNewUserPassword}
                    onChange={(e) => { setGoogleNewUserPassword(e.target.value); setFieldError("googlePassword", validatePassword(e.target.value)); if (googleNewUserConfirm) setFieldError("googleConfirm", e.target.value !== googleNewUserConfirm ? "Passwords do not match" : ""); }}
                    disabled={loading}
                    className={fieldCls("googlePassword", "pl-11 pr-11 py-2.5")}
                  />
                  <button type="button" onClick={() => setShowGooglePassword(s => !s)} className="absolute right-4 text-gray-400 hover:text-gray-600">
                    {showGooglePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.googlePassword && <p className="mt-1 text-xs text-red-500 error-fade" role="alert">{errors.googlePassword}</p>}
              </div>

              <div>
                <div className={`relative flex items-center ${shaking.has("googleConfirm") ? "shake" : ""}`}>
                  <span className="absolute left-4 text-gray-400"><Lock className="h-4 w-4" /></span>
                  <input type={showGoogleConfirm ? "text" : "password"} placeholder="Confirm password *"
                    value={googleNewUserConfirm}
                    onChange={(e) => { setGoogleNewUserConfirm(e.target.value); setFieldError("googleConfirm", e.target.value !== googleNewUserPassword ? "Passwords do not match" : ""); }}
                    disabled={loading}
                    className={fieldCls("googleConfirm", "pl-11 pr-11 py-2.5")}
                  />
                  <button type="button" onClick={() => setShowGoogleConfirm(s => !s)} className="absolute right-4 text-gray-400 hover:text-gray-600">
                    {showGoogleConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.googleConfirm && <p className="mt-1 text-xs text-red-500 error-fade" role="alert">{errors.googleConfirm}</p>}
              </div>

              {apiError && <p className="text-xs text-red-500 error-fade" role="alert">{apiError}</p>}

              <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? "Creating account…" : "Complete Sign Up"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

          ) : isOtpStep ? (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <button type="button" onClick={() => { setStep("form"); setOtp(""); setApiError(""); }} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                ← Back
              </button>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-gray-900">Verify your mobile</h3>
                <p className="text-sm text-gray-500">OTP sent to <span className="font-semibold text-gray-700">+91 {mobileSummary}</span></p>
                {demoOtp && (
                  <p className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 inline-block">
                    Demo mode — use OTP: <span className="font-bold tracking-widest">{demoOtp}</span>
                  </p>
                )}
              </div>

              <OtpInput value={otp} onChange={setOtp} error={errors.otp} autoFocus disabled={loading} />

              {apiError && <p className="text-xs text-red-500 text-center" role="alert">{apiError}</p>}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? "Verifying…" : "Verify & Continue"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>

              <p className="text-center text-xs text-gray-500">
                Didn&apos;t receive it?{" "}
                {countdown > 0
                  ? <span className="font-medium text-gray-400">Resend in {countdown}s</span>
                  : <button type="button" onClick={handleResend} disabled={loading} className="font-semibold" style={{ color: "#1f4f8a" }}>Resend OTP</button>
                }
              </p>
            </form>

          ) : tab === "login" ? (

            /* ── LOGIN FORM ── */
            loginMode === "password" ? (
              <form onSubmit={handleLoginWithPassword} className="space-y-4">
                <p className="text-sm text-gray-500 text-center mb-1">Sign in to your account</p>

                {/* Identifier — email or mobile */}
                <div>
                  <div className={`relative flex items-center ${shaking.has("loginIdentifier") ? "shake" : ""}`}>
                    <span className="absolute left-4 text-gray-400"><UserIcon className="h-4 w-4" /></span>
                    <input
                      type="text"
                      placeholder="Email or mobile number *"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        setFieldError("loginIdentifier", validateIdentifier(e.target.value));
                      }}
                      disabled={loading}
                      autoFocus
                      className={fieldCls("loginIdentifier", "pl-11 pr-4 py-2.5")}
                    />
                  </div>
                  {errors.loginIdentifier && (
                    <p className="mt-1 text-xs text-red-500 error-fade" role="alert">{errors.loginIdentifier}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className={`relative flex items-center ${shaking.has("loginPassword") ? "shake" : ""}`}>
                    <span className="absolute left-4 text-gray-400"><Lock className="h-4 w-4" /></span>
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Password *"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setFieldError("loginPassword", validateLoginPasswordField(e.target.value));
                      }}
                      disabled={loading}
                      className={fieldCls("loginPassword", "pl-11 pr-11 py-2.5")}
                    />
                    <button type="button" onClick={() => setShowLoginPassword((s) => !s)} className="absolute right-4 text-gray-400 hover:text-gray-600">
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.loginPassword && (
                    <p className="mt-1 text-xs text-red-500 error-fade" role="alert">{errors.loginPassword}</p>
                  )}
                </div>

                {apiError && <p className="text-xs text-red-500 text-center error-fade" role="alert">{apiError}</p>}

                <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? "Signing in…" : "Sign In"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>

                <GoogleButton onClick={handleGoogleSignIn} loading={loading} label="Sign in with Google" />

                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-500">
                    Forgot password?{" "}
                    <button
                      type="button"
                      onClick={() => { setLoginMode("otp"); setErrors({}); setApiError(""); }}
                      className="font-semibold"
                      style={{ color: "#1f4f8a" }}
                    >
                      Login with OTP instead
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={() => setTab("register")} className="font-semibold" style={{ color: "#1f4f8a" }}>Create one</button>
                  </p>
                </div>
              </form>
            ) : (
              /* OTP login mode */
              <form onSubmit={handleLoginSendOtp} className="space-y-4">
                <p className="text-sm text-gray-500 text-center mb-1">Enter your mobile number to receive an OTP</p>

                <div className={shaking.has("loginMobile") ? "shake" : ""}>
                  <MobileInput
                    value={loginMobile}
                    onChange={(v) => {
                      setLoginMobile(v);
                      setFieldError("loginMobile", isValidIndianMobile(v) ? "" : "Enter a valid 10-digit mobile number");
                    }}
                    error={errors.loginMobile}
                    disabled={loading}
                    autoFocus
                  />
                </div>

                {apiError && <p className="text-xs text-red-500 error-fade" role="alert">{apiError}</p>}

                <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? "Sending OTP…" : "Send OTP"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>

                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-500">
                    <button
                      type="button"
                      onClick={() => { setLoginMode("password"); setErrors({}); setApiError(""); }}
                      className="font-semibold"
                      style={{ color: "#1f4f8a" }}
                    >
                      ← Back to password login
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={() => setTab("register")} className="font-semibold" style={{ color: "#1f4f8a" }}>Create one</button>
                  </p>
                </div>
              </form>
            )

          ) : (

            /* ── REGISTER FORM ── */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <p className="text-sm text-gray-500 text-center mb-1">Fill in your details to get started</p>

              {/* Full name */}
              <div>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400"><UserIcon className="h-4 w-4" /></span>
                  <input
                    type="text"
                    placeholder="Full name *"
                    value={regName}
                    onChange={(e) => { setRegName(e.target.value); setFieldError("regName", validateName(e.target.value)); }}
                    disabled={loading}
                    autoFocus
                    className={fieldCls("regName", "pl-11 pr-4 py-2.5")}
                  />
                </div>
                {errors.regName && (
                  <p className="mt-1 text-xs text-red-500 error-fade" role="alert">{errors.regName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400"><Mail className="h-4 w-4" /></span>
                  <input
                    type="email"
                    placeholder="Email address *"
                    value={regEmail}
                    onChange={(e) => { setRegEmail(e.target.value); setFieldError("regEmail", validateEmail(e.target.value)); }}
                    disabled={loading}
                    className={fieldCls("regEmail", "pl-11 pr-4 py-2.5")}
                  />
                </div>
                {errors.regEmail && (
                  <p className="mt-1 text-xs text-red-500 error-fade" role="alert">{errors.regEmail}</p>
                )}
              </div>

              {/* Mobile */}
              <div className={shaking.has("regMobile") ? "shake" : ""}>
                <MobileInput
                  value={regMobile}
                  onChange={(v) => {
                    setRegMobile(v);
                    setFieldError("regMobile", isValidIndianMobile(v) ? "" : "Enter a valid 10-digit mobile number");
                  }}
                  error={errors.regMobile}
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400"><Lock className="h-4 w-4" /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password *"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      setFieldError("regPassword", validatePassword(e.target.value));
                      // Re-validate confirm if it has been touched
                      if (regConfirmPassword) setFieldError("regConfirmPassword", e.target.value !== regConfirmPassword ? "Passwords do not match" : "");
                    }}
                    disabled={loading}
                    className={fieldCls("regPassword", "pl-11 pr-11 py-2.5")}
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-4 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.regPassword && (
                  <p className="mt-1 text-xs text-red-500 error-fade" role="alert">{errors.regPassword}</p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400"><Lock className="h-4 w-4" /></span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password *"
                    value={regConfirmPassword}
                    onChange={(e) => {
                      setRegConfirmPassword(e.target.value);
                      setFieldError("regConfirmPassword", e.target.value !== regPassword ? "Passwords do not match" : "");
                    }}
                    disabled={loading}
                    className={fieldCls("regConfirmPassword", "pl-11 pr-11 py-2.5")}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword((s) => !s)} className="absolute right-4 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.regConfirmPassword && (
                  <p className="mt-1 text-xs text-red-500 error-fade" role="alert">{errors.regConfirmPassword}</p>
                )}
              </div>

              {apiError && <p className="text-xs text-red-500" role="alert">{apiError}</p>}

              <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? "Creating account…" : "Create Account & Verify"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>

              <GoogleButton onClick={handleGoogleSignIn} loading={loading} label="Sign up with Google" />

              <p className="text-center text-xs text-gray-500">
                Already have an account?{" "}
                <button type="button" onClick={() => setTab("login")} className="font-semibold" style={{ color: "#1f4f8a" }}>Sign in</button>
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-5 text-center">
          <p className="text-[11px] text-gray-400">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>{" "}
            &amp;{" "}
            <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
          </p>
        </div>

        <style jsx>{`
          .btn-primary {
            background: linear-gradient(135deg, #17396f 0%, #2f6f9f 52%, #49ad57 100%);
            color: white;
            font-weight: 600;
            font-size: 0.875rem;
            padding: 0.65rem 1.5rem;
            border-radius: 9999px;
            transition: opacity 0.2s, box-shadow 0.2s;
            border: none;
            cursor: pointer;
            box-shadow: 0 8px 22px rgba(23, 57, 111, 0.22);
          }
          .btn-primary:hover:not(:disabled) {
            opacity: 0.95;
            box-shadow: 0 10px 24px rgba(23, 57, 111, 0.28);
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            15%       { transform: translateX(-6px); }
            30%       { transform: translateX(6px); }
            45%       { transform: translateX(-4px); }
            60%       { transform: translateX(4px); }
            75%       { transform: translateX(-2px); }
            90%       { transform: translateX(2px); }
          }
          .shake { animation: shake 0.5s ease-in-out; }

          @keyframes errorFadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .error-fade { animation: errorFadeIn 0.2s ease-out; }
        `}</style>
      </div>
    </div>
  );
}

// ── Google button sub-component ───────────────────────────────────────────────

function GoogleButton({ onClick, loading, label }: { onClick: () => void; loading: boolean; label: string }) {
  return (
    <>
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
      >
        {/* Google "G" logo */}
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        {label}
      </button>
    </>
  );
}
