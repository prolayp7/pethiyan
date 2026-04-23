"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight, Mail, User as UserIcon, Lock, Eye, EyeOff, ShieldCheck, Truck, Tag } from "lucide-react";
import Image from "next/image";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import Link from "next/link";
import MobileInput, { isValidIndianMobile } from "@/components/auth/MobileInput";
import OtpInput from "@/components/auth/OtpInput";
import { sendOtp, verifyOtp, resendOtp, registerUser, verifyMobile, loginWithPassword, googleCallback, forgotPasswordSendOtp, forgotPasswordReset, forgotPasswordResendOtp } from "@/lib/api";
import { signInWithGoogle } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type { AuthUser } from "@/context/AuthContext";
import { clearReturnToCookie, resolveLoginRedirect, writeReturnToCookie } from "@/lib/return-to";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  redirectTo?: string;
}

type Tab = "login" | "register";
type Step = "form" | "otp";
type LoginMode = "password" | "otp" | "forgot-password";
type ForgotStep = "identifier" | "reset" | "success";

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
  const { appName, logo, smsOtpEnabled, emailOtpEnabled } = useSiteSettings();
  const finalRedirectTo = resolveLoginRedirect(redirectTo, "/account");

  useEffect(() => {
    if (open && redirectTo) {
      writeReturnToCookie(redirectTo);
    }
  }, [open, redirectTo]);

  const completeLogin = useCallback((user: AuthUser) => {
    login(user);
    clearReturnToCookie();
    onClose();
    onSuccess?.();
    if (!onSuccess) {
      router.push(finalRedirectTo);
    }
  }, [finalRedirectTo, login, onClose, onSuccess, router]);

  const [tab, setTab] = useState<Tab>("login");
  const [step, setStep] = useState<Step>("form");

  // Login fields
  const [loginMode, setLoginMode] = useState<LoginMode>("password");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginMobile, setLoginMobile] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginOtpSentTo, setLoginOtpSentTo] = useState<{ sms: boolean; email: boolean }>({ sms: false, email: false });

  // Forgot-password fields
  const [forgotStep, setForgotStep] = useState<ForgotStep>("identifier");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMobile, setForgotMobile] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotConfirm, setShowForgotConfirm] = useState(false);
  const [forgotDemoOtp, setForgotDemoOtp] = useState<string | undefined>(undefined);
  const [forgotCountdown, setForgotCountdown] = useState(0);

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

  const pendingAuth = useRef<{
    user: AuthUser;
    smsOtpSent: boolean;
    emailOtpSent: boolean;
  } | null>(null);

  // Google new-user completion state
  const [googleIdToken, setGoogleIdToken] = useState<string | null>(null);
  const [googleNewUserMobile, setGoogleNewUserMobile] = useState("");
  const [googleNewUserPassword, setGoogleNewUserPassword] = useState("");
  const [googleNewUserConfirm, setGoogleNewUserConfirm] = useState("");
  const [showGooglePassword, setShowGooglePassword] = useState(false);
  const [showGoogleConfirm, setShowGoogleConfirm] = useState(false);
  const [googleStep, setGoogleStep] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<"form" | "google" | "resend" | "none">("none");

  const startLoading = (action: "form" | "google" | "resend") => {
    setLoadingAction(action);
    setLoading(true);
  };
  const stopLoading = () => {
    setLoadingAction("none");
    setLoading(false);
  };
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
      setLoginMobile(""); setLoginEmail(""); setLoginOtpSentTo({ sms: false, email: false });
      setForgotStep("identifier"); setForgotEmail(""); setForgotMobile("");
      setForgotOtp(""); setForgotNewPassword(""); setForgotConfirmPassword("");
      setShowForgotPassword(false); setShowForgotConfirm(false);
      setForgotDemoOtp(undefined); setForgotCountdown(0);
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
    setLoginMobile(""); setLoginEmail(""); setLoginOtpSentTo({ sms: false, email: false });
    setForgotStep("identifier"); setForgotEmail(""); setForgotMobile("");
    setForgotOtp(""); setForgotNewPassword(""); setForgotConfirmPassword("");
    setShowForgotPassword(false); setShowForgotConfirm(false);
    setForgotDemoOtp(undefined); setForgotCountdown(0);
    setOtp("");
    setErrors({});
    setShaking(new Set());
    setApiError("");
    setDemoOtp(undefined);
    setGoogleIdToken(null); setGoogleStep(false);
    setGoogleNewUserMobile(""); setGoogleNewUserPassword(""); setGoogleNewUserConfirm("");
    pendingAuth.current = null;
  }, [tab]);

  // Countdown timers
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (forgotCountdown <= 0) return;
    const t = setTimeout(() => setForgotCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [forgotCountdown]);

  const startCountdown = useCallback(() => setCountdown(RESEND_SECONDS), []);

  // Auto-submit when all 6 OTP digits are entered
  useEffect(() => {
    if (step === "otp" && otp.length === 6 && !loading) {
      if (tab === "login") handleLoginVerifyOtp();
      else handleRegisterVerifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  // Auto-submit for forgot password reset when all conditions meet
  useEffect(() => {
    if (
      forgotStep === "reset" &&
      forgotOtp.length === 6 &&
      forgotNewPassword &&
      forgotConfirmPassword === forgotNewPassword &&
      !validatePassword(forgotNewPassword) &&
      !loading
    ) {
      handleForgotReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forgotOtp, forgotNewPassword, forgotConfirmPassword]);

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
    if (smsOtpEnabled && loginMobile && !isValidIndianMobile(loginMobile)) {
      errs.loginMobile = "Enter a valid 10-digit mobile number";
    }
    if (emailOtpEnabled && loginEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      errs.loginEmail = "Enter a valid email address";
    }
    // At least one must be provided
    const hasMobile = smsOtpEnabled && isValidIndianMobile(loginMobile);
    const hasEmail  = emailOtpEnabled && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim());
    if (!hasMobile && !hasEmail) {
      if (smsOtpEnabled && emailOtpEnabled) {
        errs.loginOtpIdentifier = "Enter a mobile number or email address";
      } else if (smsOtpEnabled) {
        errs.loginMobile = "Enter a valid 10-digit mobile number";
      } else if (emailOtpEnabled) {
        errs.loginEmail = "Enter a valid email address";
      }
    }
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
    startLoading("form");
    try {
      const res = await loginWithPassword(loginIdentifier, loginPassword);
      if (res.success && res.user) { completeLogin(res.user); }
      else setApiError(res.message ?? "Invalid credentials. Please try again.");
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { stopLoading(); }
  }

  async function handleLoginSendOtp(e: React.SyntheticEvent) {
    e.preventDefault();
    setApiError("");
    if (!validateOtpLoginForm()) return;
    startLoading("form");
    try {
      const mobile = smsOtpEnabled && isValidIndianMobile(loginMobile) ? loginMobile : null;
      const email  = emailOtpEnabled && loginEmail.trim() ? loginEmail.trim() : null;
      const res = await sendOtp(mobile, email);
      if (res.success) {
        setDemoOtp(res.demoOtp);
        setLoginOtpSentTo({ sms: Boolean(res.smsOtpSent), email: Boolean(res.emailOtpSent) });
        setStep("otp");
        startCountdown();
      } else {
        setApiError(res.message ?? "Failed to send OTP. Please try again.");
      }
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { stopLoading(); }
  }

  async function handleLoginVerifyOtp(e?: React.SyntheticEvent) {
    e?.preventDefault();
    setApiError("");
    if (otp.length !== 6) { setErrors({ otp: "Enter the 6-digit OTP" }); return; }
    setErrors({});
    startLoading("form");
    try {
      const mobile = smsOtpEnabled && isValidIndianMobile(loginMobile) ? loginMobile : null;
      const email  = emailOtpEnabled && loginEmail.trim() ? loginEmail.trim() : undefined;
      const res = await verifyOtp(mobile, otp, email ? { email } : undefined);
      if (res.success && res.user) { completeLogin(res.user); }
      else setApiError(res.message ?? "Invalid OTP. Please try again.");
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { stopLoading(); }
  }

  // ── Register handlers ─────────────────────────────────────────────────────────

  async function handleRegisterSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setApiError("");
    if (!validateRegisterForm()) return;
    startLoading("form");
    try {
      const res = await registerUser({
        name: regName.trim(),
        email: regEmail.trim(),
        mobile: regMobile,
        password: regPassword,
        password_confirmation: regConfirmPassword,
      });
      if (res.success && res.user) {
        pendingAuth.current = {
          user: res.user,
          smsOtpSent: Boolean(res.smsOtpSent),
          emailOtpSent: Boolean(res.emailOtpSent),
        };
        setStep("otp");
        startCountdown();
      } else setApiError(res.message ?? "Registration failed. Please try again.");
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { stopLoading(); }
  }

  async function handleRegisterVerifyOtp(e?: React.SyntheticEvent) {
    e?.preventDefault();
    setApiError("");
    if (otp.length !== 6) { setErrors({ otp: "Enter the 6-digit OTP" }); return; }
    setErrors({});
    startLoading("form");
    try {
      const res = await verifyMobile(regMobile, otp);
      if (res.success && pendingAuth.current) { completeLogin(pendingAuth.current.user); }
      else setApiError(res.message ?? "Invalid OTP. Please try again.");
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { stopLoading(); }
  }

  // ── Google Sign-In ───────────────────────────────────────────────────────────

  async function handleGoogleSignIn() {
    setApiError("");
    startLoading("google");
    try {
      const { idToken } = await signInWithGoogle();
      const res = await googleCallback(idToken);

      if (res.success) {
        completeLogin(res.user);
        return;
      }

      if (res.isNewUser) {
        setGoogleIdToken(idToken);
        setGoogleStep(true);
        return;
      }

      setApiError(res.message ?? "Google sign-in failed. Please try again.");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      const message = (err as { message?: string })?.message;

      if (code === "auth/unauthorized-domain") {
        setApiError("Google sign-in failed: this domain is not authorized in Firebase.");
      } else if (code === "auth/invalid-api-key") {
        setApiError("Google sign-in failed: Firebase API key is invalid or missing.");
      } else if (code === "auth/configuration-not-found") {
        setApiError("Google sign-in failed: Google provider is not enabled in Firebase Authentication.");
      } else if (code === "auth/popup-blocked") {
        setApiError("Google sign-in failed: the browser blocked the popup. Please allow popups and try again.");
      } else if (code === "auth/network-request-failed") {
        setApiError("Google sign-in failed: network request failed. Please check your internet and Firebase config.");
      } else if (code) {
        setApiError(`Google sign-in failed: ${code}.`);
      } else if (message) {
        setApiError(`Google sign-in failed: ${message}`);
      } else {
        setApiError("Google sign-in failed. Please try again.");
      }

      console.error("Google sign-in error:", err);
    } finally {
      stopLoading();
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

    startLoading("form");
    try {
      const res = await googleCallback(googleIdToken!, {
        mobile: googleNewUserMobile,
        password: googleNewUserPassword,
        password_confirmation: googleNewUserConfirm,
      });
      if (res.success) {
        completeLogin(res.user);
      } else {
        setApiError(res.message ?? "Registration failed. Please try again.");
      }
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { stopLoading(); }
  }

  // ── Resend OTP ────────────────────────────────────────────────────────────────

  async function handleResend() {
    if (countdown > 0) return;
    setApiError("");
    startLoading("resend");
    try {
      let res;
      if (tab === "login") {
        const mobile = smsOtpEnabled && isValidIndianMobile(loginMobile) ? loginMobile : null;
        const email  = emailOtpEnabled && loginEmail.trim() ? loginEmail.trim() : null;
        res = await resendOtp(mobile, email);
      } else {
        res = await resendOtp(regMobile, null);
      }
      if (res.success) { setOtp(""); setDemoOtp(res.demoOtp); startCountdown(); }
      else setApiError(res.message ?? "Could not resend OTP.");
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { stopLoading(); }
  }

  // ── Forgot Password Handlers ──────────────────────────────────────────────────

  async function handleForgotStart(e: React.SyntheticEvent) {
    e.preventDefault();
    setApiError("");
    const errs: Record<string, string> = {};
    if (smsOtpEnabled && forgotMobile && !isValidIndianMobile(forgotMobile)) {
      errs.forgotMobile = "Enter a valid 10-digit mobile number";
    }
    if (emailOtpEnabled && forgotEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) {
      errs.forgotEmail = "Enter a valid email address";
    }
    const hasMobile = smsOtpEnabled && isValidIndianMobile(forgotMobile);
    const hasEmail = emailOtpEnabled && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim());
    if (!hasMobile && !hasEmail) {
      if (smsOtpEnabled && emailOtpEnabled) errs.forgotOtpIdentifier = "Enter your mobile number or email address";
      else if (smsOtpEnabled) errs.forgotMobile = "Enter a valid 10-digit mobile number";
      else if (emailOtpEnabled) errs.forgotEmail = "Enter a valid email address";
    }
    if (Object.keys(errs).length) { setErrors(errs); triggerShake(Object.keys(errs)); return; }

    startLoading("form");
    try {
      const mobile = smsOtpEnabled && isValidIndianMobile(forgotMobile) ? forgotMobile : null;
      const email = emailOtpEnabled && forgotEmail.trim() ? forgotEmail.trim() : null;
      const res = await forgotPasswordSendOtp(email, mobile);
      if (res.success) {
        setForgotDemoOtp(res.demoOtp);
        setForgotStep("reset");
        setForgotCountdown(RESEND_SECONDS);
      } else {
        setApiError(res.message ?? "Could not send OTP. Please try again.");
      }
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { stopLoading(); }
  }

  async function handleForgotReset(e?: React.SyntheticEvent) {
    if (e) e.preventDefault();
    setApiError("");
    const errs: Record<string, string> = {};
    if (forgotOtp.length !== 6) errs.forgotOtp = "Enter the 6-digit OTP";
    const pwErr = validatePassword(forgotNewPassword);
    if (pwErr) errs.forgotNewPassword = pwErr;
    if (forgotConfirmPassword !== forgotNewPassword) errs.forgotConfirmPassword = "Passwords do not match";
    
    if (Object.keys(errs).length) { setErrors(errs); triggerShake(Object.keys(errs)); return; }

    startLoading("form");
    try {
      const mobile = smsOtpEnabled && isValidIndianMobile(forgotMobile) ? forgotMobile : null;
      const email = emailOtpEnabled && forgotEmail.trim() ? forgotEmail.trim() : null;
      const res = await forgotPasswordReset(email, mobile, forgotOtp, forgotNewPassword, forgotConfirmPassword);
      if (res.success) {
        setForgotStep("success");
      } else {
        setApiError(res.message ?? "Failed to reset password. Please try again.");
      }
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { stopLoading(); }
  }

  async function handleForgotResend() {
    if (forgotCountdown > 0) return;
    setApiError("");
    startLoading("resend");
    try {
      const mobile = smsOtpEnabled && isValidIndianMobile(forgotMobile) ? forgotMobile : null;
      const email = emailOtpEnabled && forgotEmail.trim() ? forgotEmail.trim() : null;
      const res = await forgotPasswordResendOtp(email, mobile);
      if (res.success) {
        setForgotOtp("");
        setForgotDemoOtp(res.demoOtp);
        setForgotCountdown(RESEND_SECONDS);
      } else {
        setApiError(res.message ?? "Could not resend OTP.");
      }
    } catch { setApiError("Something went wrong. Please try again."); }
    finally { stopLoading(); }
  }

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  // ── Field class helper ────────────────────────────────────────────────────────

  function fieldCls(field: string, extra = "") {
    const hasErr = !!errors[field];
    const isShaking = shaking.has(field);
    return [
      "w-full rounded-xl border text-sm outline-none transition-all duration-200 bg-white",
      hasErr
        ? "border-red-400 ring-2 ring-red-100"
        : "border-[#e2e8f0] focus:border-[#2f6f9f] focus:ring-2 focus:ring-[#2f6f9f]/10",
      isShaking ? "shake" : "",
      extra,
    ].join(" ");
  }

  const isOtpStep = step === "otp";
  const handleVerifyOtp = tab === "login" ? handleLoginVerifyOtp : handleRegisterVerifyOtp;

  // Registration OTP destination
  const registerSmsOtpSent   = Boolean(pendingAuth.current?.smsOtpSent);
  const registerEmailOtpSent = Boolean(pendingAuth.current?.emailOtpSent);
  const registerOtpHeading   = registerSmsOtpSent && registerEmailOtpSent
    ? "Verify your account"
    : registerSmsOtpSent ? "Verify your mobile" : registerEmailOtpSent ? "Verify your email" : "Verify your mobile";
  const registerOtpDestination = (() => {
    const parts: string[] = [];
    if (registerSmsOtpSent) parts.push(`+91 ${regMobile}`);
    if (registerEmailOtpSent) parts.push(regEmail);
    return parts.join(" & ") || `+91 ${regMobile}`;
  })();

  // Login OTP destination
  const loginOtpHeading = loginOtpSentTo.sms && loginOtpSentTo.email
    ? "Verify your account"
    : loginOtpSentTo.sms ? "Verify your mobile" : loginOtpSentTo.email ? "Verify your email" : "Verify your account";
  const loginOtpDestination = (() => {
    const parts: string[] = [];
    if (loginOtpSentTo.sms && loginMobile) parts.push(`+91 ${loginMobile}`);
    if (loginOtpSentTo.email && loginEmail) parts.push(loginEmail);
    return parts.join(" & ") || (loginMobile ? `+91 ${loginMobile}` : loginEmail);
  })();

  const otpHeading     = tab === "login" ? loginOtpHeading     : registerOtpHeading;
  const otpDestination = tab === "login" ? loginOtpDestination : registerOtpDestination;

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      style={{ background: "rgba(8,20,45,0.7)", backdropFilter: "blur(8px)" }}
      onClick={handleBackdrop}
    >
      <div
        className="modal-enter relative w-full flex overflow-hidden rounded-2xl shadow-2xl"
        style={{ maxWidth: 820, minHeight: 520, boxShadow: "0 32px 80px rgba(8,20,45,0.35)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── LEFT BRAND PANEL ── */}
        <div
          className="hidden md:flex flex-col justify-between w-[280px] shrink-0 p-8 relative overflow-hidden"
          style={{ background: "linear-gradient(160deg,#0f2f5f 0%,#17396f 40%,#1e5a8a 70%,#2a7a4e 100%)" }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#fff 0%,transparent 70%)" }} />
          <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#49ad57 0%,transparent 70%)" }} />

          {/* Logo */}
          <div className="relative z-10">
            {logo ? (
              <Image src={logo} alt={appName} width={150} height={56} className="h-12 w-auto object-contain brightness-0 invert" unoptimized />
            ) : (
              <span className="text-2xl font-extrabold text-white tracking-tight">{appName}</span>
            )}
          </div>

          {/* Feature bullets */}
          <div className="relative z-10 space-y-4">
            {[
              { icon: ShieldCheck, text: "Secure & verified orders" },
              { icon: Truck, text: "Fast delivery across India" },
              { icon: Tag, text: "Best prices, GST invoices" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <Icon className="h-4 w-4 text-white/80" />
                </span>
                <span className="text-[13px] text-blue-100/80">{text}</span>
              </div>
            ))}
          </div>

          {/* Bottom tagline */}
          <div className="relative z-10">
            <p className="text-[11px] text-blue-200/50 whitespace-nowrap">
              © {new Date().getFullYear()} Pethiyan.com. All Rights Reserved.
            </p>
          </div>
        </div>

        {/* ── RIGHT FORM PANEL ── */}
        <div className="flex flex-col flex-1 bg-white overflow-y-auto" style={{ maxHeight: "90vh" }}>

          {/* Mobile logo strip */}
          <div
            className="md:hidden px-6 pt-6 pb-4 text-center"
            style={{ background: "linear-gradient(135deg,#0f2f5f 0%,#17396f 60%,#2a7a4e 100%)" }}
          >
            {logo ? (
              <Image src={logo} alt={appName} width={120} height={44} className="mx-auto h-10 w-auto object-contain brightness-0 invert" unoptimized />
            ) : (
              <span className="text-xl font-extrabold text-white">{appName}</span>
            )}
            <p className="mt-1 text-xs text-blue-200/70">The Power of Perfect Packaging</p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex items-center justify-center w-8 h-8 rounded-full transition-colors"
            style={{ background: "rgba(0,0,0,0.06)" }}
            aria-label="Close"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>

          {/* Tabs */}
          {!isOtpStep && !googleStep && (
            <div className="px-6 pt-6 pb-0">
              <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#f1f5f9" }}>
                {(["login", "register"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                    style={
                      tab === t
                        ? { background: "white", color: "#17396f", boxShadow: "0 1px 6px rgba(0,0,0,0.10)" }
                        : { background: "transparent", color: "#64748b" }
                    }
                  >
                    {t === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form body */}
          <div className="px-6 py-5 flex-1">

            {/* ── GOOGLE NEW USER STEP ── */}
            {googleStep ? (
              <form onSubmit={handleGoogleNewUserComplete} className="space-y-3">
                <button
                  type="button"
                  onClick={() => { setGoogleStep(false); setGoogleIdToken(null); setErrors({}); setApiError(""); }}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Back
                </button>
                <div className="space-y-0.5 mb-2">
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

                <PasswordField
                  placeholder="Create password *"
                  value={googleNewUserPassword}
                  show={showGooglePassword}
                  onToggle={() => setShowGooglePassword(s => !s)}
                  onChange={(v) => { setGoogleNewUserPassword(v); setFieldError("googlePassword", validatePassword(v)); if (googleNewUserConfirm) setFieldError("googleConfirm", v !== googleNewUserConfirm ? "Passwords do not match" : ""); }}
                  error={errors.googlePassword}
                  shaking={shaking.has("googlePassword")}
                  disabled={loading}
                  fieldCls={fieldCls}
                  fieldKey="googlePassword"
                />

                <PasswordField
                  placeholder="Confirm password *"
                  value={googleNewUserConfirm}
                  show={showGoogleConfirm}
                  onToggle={() => setShowGoogleConfirm(s => !s)}
                  onChange={(v) => { setGoogleNewUserConfirm(v); setFieldError("googleConfirm", v !== googleNewUserPassword ? "Passwords do not match" : ""); }}
                  error={errors.googleConfirm}
                  shaking={shaking.has("googleConfirm")}
                  disabled={loading}
                  fieldCls={fieldCls}
                  fieldKey="googleConfirm"
                />

                {apiError && <ApiError msg={apiError} />}

                <PrimaryButton loading={loadingAction === "form"} disabled={loading} label="Complete Sign Up" loadingLabel="Creating account…" />
              </form>

            ) : isOtpStep ? (

              /* ── OTP STEP ── */
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <button
                  type="button"
                  onClick={() => { setStep("form"); setOtp(""); setApiError(""); }}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Back
                </button>

                <div className="text-center space-y-1.5">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-1" style={{ background: "linear-gradient(135deg,#17396f,#2f6f9f)" }}>
                    <ShieldCheck className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{otpHeading}</h3>
                  <p className="text-sm text-gray-500">OTP sent to <span className="font-semibold text-gray-700">{otpDestination}</span></p>
                  {demoOtp && (
                    <p className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 inline-block">
                      Demo mode — use OTP: <span className="font-bold tracking-widest">{demoOtp}</span>
                    </p>
                  )}
                </div>

                <OtpInput value={otp} onChange={setOtp} error={errors.otp} autoFocus disabled={loading} />

                {apiError && <ApiError msg={apiError} />}

                <PrimaryButton loading={loadingAction === "form"} label="Verify & Continue" loadingLabel="Verifying…" disabled={loading || otp.length !== 6} />

                <p className="text-center text-xs text-gray-500">
                  Didn&apos;t receive it?{" "}
                  {countdown > 0
                    ? <span className="font-medium text-gray-400">Resend in {countdown}s</span>
                    : <button type="button" onClick={handleResend} disabled={loading} className="font-semibold" style={{ color: "#17396f" }}>Resend OTP</button>
                  }
                </p>
              </form>

            ) : tab === "login" ? (

              /* ── LOGIN FORM ── */
              loginMode === "password" ? (
                <form onSubmit={handleLoginWithPassword} className="space-y-3.5">
                  <div className="mb-1">
                    <h2 className="text-lg font-bold text-gray-900">Welcome back</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Sign in to continue to your account</p>
                  </div>

                  {/* Identifier */}
                  <FormField error={errors.loginIdentifier}>
                    <div className={`relative ${shaking.has("loginIdentifier") ? "shake" : ""}`}>
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <UserIcon className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Email or mobile number *"
                        value={loginIdentifier}
                        onChange={(e) => { setLoginIdentifier(e.target.value); setFieldError("loginIdentifier", validateIdentifier(e.target.value)); }}
                        disabled={loading}
                        autoFocus
                        className={fieldCls("loginIdentifier", "pl-10 pr-4 py-3")}
                      />
                    </div>
                  </FormField>

                  {/* Password */}
                  <PasswordField
                    placeholder="Password *"
                    value={loginPassword}
                    show={showLoginPassword}
                    onToggle={() => setShowLoginPassword(s => !s)}
                    onChange={(v) => { setLoginPassword(v); setFieldError("loginPassword", validateLoginPasswordField(v)); }}
                    error={errors.loginPassword}
                    shaking={shaking.has("loginPassword")}
                    disabled={loading}
                    fieldCls={fieldCls}
                    fieldKey="loginPassword"
                  />

                  <div className="flex items-center justify-between mt-1">
                    <button
                      type="button"
                      onClick={() => { setLoginMode("forgot-password"); setForgotStep("identifier"); setErrors({}); setApiError(""); }}
                      className="text-xs font-semibold hover:underline"
                      style={{ color: "#17396f" }}
                    >
                      Forgot password?
                    </button>
                    {(smsOtpEnabled || emailOtpEnabled) && (
                      <button
                        type="button"
                        onClick={() => { setLoginMode("otp"); setErrors({}); setApiError(""); }}
                        className="text-xs font-semibold hover:underline"
                        style={{ color: "#17396f" }}
                      >
                        Login with OTP
                      </button>
                    )}
                  </div>

                  {apiError && <ApiError msg={apiError} />}

                  <PrimaryButton loading={loadingAction === "form"} disabled={loading} label="Sign In" loadingLabel="Signing in…" />

                  <GoogleButton onClick={handleGoogleSignIn} loading={loadingAction === "google"} disabled={loading} label="Sign in with Google" />

                  <p className="text-center text-xs text-gray-500 pt-1">
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={() => setTab("register")} className="font-semibold hover:underline" style={{ color: "#17396f" }}>Create one</button>
                  </p>
                </form>
              ) : loginMode === "otp" ? (
                /* OTP login mode */
                <form onSubmit={handleLoginSendOtp} className="space-y-3.5">
                  <div className="mb-1">
                    <h2 className="text-lg font-bold text-gray-900">Login with OTP</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {smsOtpEnabled && emailOtpEnabled
                        ? "Enter your mobile number or email address — we'll send you a one-time password"
                        : smsOtpEnabled
                        ? "Enter your registered mobile number to receive a one-time password"
                        : "Enter your registered email address to receive a one-time password"}
                    </p>
                  </div>

                  {errors.loginOtpIdentifier && (
                    <p className="text-xs text-red-500 error-fade flex items-center gap-1" role="alert">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />{errors.loginOtpIdentifier}
                    </p>
                  )}

                  {smsOtpEnabled && (
                    <div className={shaking.has("loginMobile") || shaking.has("loginOtpIdentifier") ? "shake" : ""}>
                      <MobileInput
                        value={loginMobile}
                        onChange={(v) => {
                          setLoginMobile(v);
                          setFieldError("loginMobile", v && !isValidIndianMobile(v) ? "Enter a valid 10-digit mobile number" : "");
                          setFieldError("loginOtpIdentifier", "");
                        }}
                        error={errors.loginMobile}
                        disabled={loading}
                        autoFocus={smsOtpEnabled}
                      />
                    </div>
                  )}

                  {emailOtpEnabled && (
                    <FormField error={errors.loginEmail}>
                      <div className={`relative ${shaking.has("loginEmail") || shaking.has("loginOtpIdentifier") ? "shake" : ""}`}>
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <Mail className="h-4 w-4" />
                        </span>
                        <input
                          type="email"
                          placeholder={smsOtpEnabled ? "Email address (optional)" : "Email address *"}
                          value={loginEmail}
                          onChange={(e) => {
                            setLoginEmail(e.target.value);
                            setFieldError("loginEmail", e.target.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value.trim()) ? "Enter a valid email address" : "");
                            setFieldError("loginOtpIdentifier", "");
                          }}
                          disabled={loading}
                          autoFocus={!smsOtpEnabled && emailOtpEnabled}
                          className={fieldCls("loginEmail", "pl-10 pr-4 py-3")}
                        />
                      </div>
                    </FormField>
                  )}

                  {apiError && <ApiError msg={apiError} />}

                  <PrimaryButton loading={loadingAction === "form"} disabled={loading} label="Send OTP" loadingLabel="Sending OTP…" />

                  <div className="text-center space-y-1 pt-1">
                    <p className="text-xs text-gray-500">
                      <button
                        type="button"
                        onClick={() => { setLoginMode("password"); setErrors({}); setApiError(""); }}
                        className="font-semibold hover:underline"
                        style={{ color: "#17396f" }}
                      >
                        ← Back to password login
                      </button>
                    </p>
                    <p className="text-xs text-gray-500">
                      Don&apos;t have an account?{" "}
                      <button type="button" onClick={() => setTab("register")} className="font-semibold hover:underline" style={{ color: "#17396f" }}>Create one</button>
                    </p>
                  </div>
                </form>
              ) : (

                /* ── FORGOT PASSWORD ── */
                forgotStep === "identifier" ? (
                  <form onSubmit={handleForgotStart} className="space-y-3.5">
                    <button
                      type="button"
                      onClick={() => { setLoginMode("password"); setErrors({}); setApiError(""); }}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ← Back to login
                    </button>
                    <div className="mb-1">
                      <h2 className="text-lg font-bold text-gray-900">Forgot Password</h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {smsOtpEnabled && emailOtpEnabled
                          ? "Enter your mobile or email to reset password"
                          : smsOtpEnabled
                          ? "Enter your mobile number to reset password"
                          : "Enter your email address to reset password"}
                      </p>
                    </div>

                    {errors.forgotOtpIdentifier && (
                      <p className="text-xs text-red-500 error-fade flex items-center gap-1" role="alert">
                        <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />{errors.forgotOtpIdentifier}
                      </p>
                    )}

                    {smsOtpEnabled && (
                      <div className={shaking.has("forgotMobile") || shaking.has("forgotOtpIdentifier") ? "shake" : ""}>
                        <MobileInput
                          value={forgotMobile}
                          onChange={(v) => {
                            setForgotMobile(v);
                            setFieldError("forgotMobile", v && !isValidIndianMobile(v) ? "Enter a valid 10-digit mobile number" : "");
                            setFieldError("forgotOtpIdentifier", "");
                          }}
                          error={errors.forgotMobile}
                          disabled={loading}
                          autoFocus={smsOtpEnabled}
                        />
                      </div>
                    )}

                    {emailOtpEnabled && (
                      <FormField error={errors.forgotEmail}>
                        <div className={`relative ${shaking.has("forgotEmail") || shaking.has("forgotOtpIdentifier") ? "shake" : ""}`}>
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Mail className="h-4 w-4" />
                          </span>
                          <input
                            type="email"
                            placeholder={smsOtpEnabled ? "Email address (optional)" : "Email address *"}
                            value={forgotEmail}
                            onChange={(e) => {
                              setForgotEmail(e.target.value);
                              setFieldError("forgotEmail", e.target.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value.trim()) ? "Enter a valid email address" : "");
                              setFieldError("forgotOtpIdentifier", "");
                            }}
                            disabled={loading}
                            autoFocus={!smsOtpEnabled && emailOtpEnabled}
                            className={fieldCls("forgotEmail", "pl-10 pr-4 py-3")}
                          />
                        </div>
                      </FormField>
                    )}

                    {apiError && <ApiError msg={apiError} />}
                    <PrimaryButton loading={loadingAction === "form"} disabled={loading} label="Send OTP" loadingLabel="Sending…" />
                  </form>
                ) : forgotStep === "reset" ? (
                  <form onSubmit={handleForgotReset} className="space-y-4">
                    <button
                      type="button"
                      onClick={() => { setForgotStep("identifier"); setForgotOtp(""); setApiError(""); }}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ← Back
                    </button>
                    <div className="mb-2">
                      <h2 className="text-lg font-bold text-gray-900">Reset Password</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Enter the OTP sent to you and your new password</p>
                      {forgotDemoOtp && (
                        <p className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 inline-block mt-2">
                          Demo mode — use OTP: <span className="font-bold tracking-widest">{forgotDemoOtp}</span>
                        </p>
                      )}
                    </div>

                    <OtpInput value={forgotOtp} onChange={setForgotOtp} error={errors.forgotOtp} disabled={loading} autoFocus />

                    <PasswordField
                      placeholder="New password *"
                      value={forgotNewPassword}
                      show={showForgotPassword}
                      onToggle={() => setShowForgotPassword(s => !s)}
                      onChange={(v) => { setForgotNewPassword(v); setFieldError("forgotNewPassword", validatePassword(v)); if (forgotConfirmPassword) setFieldError("forgotConfirmPassword", v !== forgotConfirmPassword ? "Passwords do not match" : ""); }}
                      error={errors.forgotNewPassword}
                      shaking={shaking.has("forgotNewPassword")}
                      disabled={loading}
                      fieldCls={fieldCls}
                      fieldKey="forgotNewPassword"
                    />

                    <PasswordField
                      placeholder="Confirm new password *"
                      value={forgotConfirmPassword}
                      show={showForgotConfirm}
                      onToggle={() => setShowForgotConfirm(s => !s)}
                      onChange={(v) => { setForgotConfirmPassword(v); setFieldError("forgotConfirmPassword", v !== forgotNewPassword ? "Passwords do not match" : ""); }}
                      error={errors.forgotConfirmPassword}
                      shaking={shaking.has("forgotConfirmPassword")}
                      disabled={loading}
                      fieldCls={fieldCls}
                      fieldKey="forgotConfirmPassword"
                    />

                    {apiError && <ApiError msg={apiError} />}
                    
                    <PrimaryButton loading={loadingAction === "form"} label="Reset Password" loadingLabel="Resetting…" disabled={loading || forgotOtp.length !== 6} />

                    <p className="text-center text-xs text-gray-500">
                      Didn&apos;t receive it?{" "}
                      {forgotCountdown > 0
                        ? <span className="font-medium text-gray-400">Resend in {forgotCountdown}s</span>
                        : <button type="button" onClick={handleForgotResend} disabled={loading} className="font-semibold" style={{ color: "#17396f" }}>Resend OTP</button>
                      }
                    </p>
                  </form>
                ) : (
                  <div className="text-center space-y-4 py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-2">
                      <ShieldCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Password Reset Successful</h2>
                    <p className="text-sm text-gray-500 pb-4">Your password has been securely updated.</p>
                    <PrimaryButton 
                      loading={false} 
                      label="Back to Login" 
                      loadingLabel="" 
                    />
                    <div className="absolute inset-0 z-10 cursor-pointer" onClick={() => { setLoginMode("password"); setForgotStep("identifier"); setErrors({}); setApiError(""); }} />
                  </div>
                )
              )

            ) : (

              /* ── REGISTER FORM ── */
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="mb-1">
                  <h2 className="text-lg font-bold text-gray-900">Create your account</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Fill in your details to get started</p>
                </div>

                {/* Full name */}
                <FormField error={errors.regName}>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <UserIcon className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Full name *"
                      value={regName}
                      onChange={(e) => { setRegName(e.target.value); setFieldError("regName", validateName(e.target.value)); }}
                      disabled={loading}
                      autoFocus
                      className={fieldCls("regName", "pl-10 pr-4 py-3")}
                    />
                  </div>
                </FormField>

                {/* Email */}
                <FormField error={errors.regEmail}>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      placeholder="Email address *"
                      value={regEmail}
                      onChange={(e) => { setRegEmail(e.target.value); setFieldError("regEmail", validateEmail(e.target.value)); }}
                      disabled={loading}
                      className={fieldCls("regEmail", "pl-10 pr-4 py-3")}
                    />
                  </div>
                </FormField>

                {/* Mobile */}
                <div className={shaking.has("regMobile") ? "shake" : ""}>
                  <MobileInput
                    value={regMobile}
                    onChange={(v) => { setRegMobile(v); setFieldError("regMobile", isValidIndianMobile(v) ? "" : "Enter a valid 10-digit mobile number"); }}
                    error={errors.regMobile}
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <PasswordField
                  placeholder="Password *"
                  value={regPassword}
                  show={showPassword}
                  onToggle={() => setShowPassword(s => !s)}
                  onChange={(v) => { setRegPassword(v); setFieldError("regPassword", validatePassword(v)); if (regConfirmPassword) setFieldError("regConfirmPassword", v !== regConfirmPassword ? "Passwords do not match" : ""); }}
                  error={errors.regPassword}
                  shaking={shaking.has("regPassword")}
                  disabled={loading}
                  fieldCls={fieldCls}
                  fieldKey="regPassword"
                />

                {/* Confirm password */}
                <PasswordField
                  placeholder="Confirm password *"
                  value={regConfirmPassword}
                  show={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(s => !s)}
                  onChange={(v) => { setRegConfirmPassword(v); setFieldError("regConfirmPassword", v !== regPassword ? "Passwords do not match" : ""); }}
                  error={errors.regConfirmPassword}
                  shaking={shaking.has("regConfirmPassword")}
                  disabled={loading}
                  fieldCls={fieldCls}
                  fieldKey="regConfirmPassword"
                />

                {apiError && <ApiError msg={apiError} />}

                <PrimaryButton loading={loadingAction === "form"} disabled={loading} label="Create Account & Verify" loadingLabel="Creating account…" />

                <GoogleButton onClick={handleGoogleSignIn} loading={loadingAction === "google"} disabled={loading} label="Sign up with Google" />

                <p className="text-center text-xs text-gray-500 pt-1">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setTab("login")} className="font-semibold hover:underline" style={{ color: "#17396f" }}>Sign in</button>
                </p>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 pt-2 text-center border-t border-gray-100">
            <p className="text-[11px] text-gray-400">
              By continuing you agree to our{" "}
              <Link href="/terms-and-conditions" className="underline hover:text-gray-600 transition-colors">Terms & Conditions</Link>{" "}
              &amp;{" "}
              <Link href="/privacy-policy" className="underline hover:text-gray-600 transition-colors">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-enter {
          animation: modalSlideIn 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
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
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FormField({ children, error }: { children: React.ReactNode; error?: string }) {
  return (
    <div>
      {children}
      {error && <p className="mt-1 text-xs text-red-500 error-fade flex items-center gap-1" role="alert"><span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />{error}</p>}
    </div>
  );
}

function PasswordField({
  placeholder, value, show, onToggle, onChange, error, shaking, disabled, fieldCls, fieldKey,
}: {
  placeholder: string; value: string; show: boolean; onToggle: () => void;
  onChange: (v: string) => void; error?: string; shaking: boolean;
  disabled: boolean; fieldCls: (f: string, e?: string) => string; fieldKey: string;
}) {
  return (
    <FormField error={error}>
      <div className={`relative ${shaking ? "shake" : ""}`}>
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Lock className="h-4 w-4" />
        </span>
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={fieldCls(fieldKey, "pl-10 pr-11 py-3")}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </FormField>
  );
}

function PrimaryButton({ loading, label, loadingLabel, disabled }: { loading: boolean; label: string; loadingLabel: string; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
      style={{
        background: "linear-gradient(135deg,#17396f 0%,#2f6f9f 52%,#49ad57 100%)",
        boxShadow: "0 6px 20px rgba(23,57,111,0.25)",
      }}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

function ApiError({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs text-red-600 error-fade" style={{ background: "#fef2f2", border: "1px solid #fecaca" }} role="alert">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1" />
      {msg}
    </div>
  );
}

function GoogleButton({ onClick, loading, disabled, label }: { onClick: () => void; loading: boolean; disabled?: boolean; label: string }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400 font-medium">or continue with</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border text-sm font-medium text-gray-700 transition-all duration-200 disabled:opacity-60 hover:bg-gray-50"
        style={{ borderColor: "#e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
        )}
        {label}
      </button>
    </>
  );
}
