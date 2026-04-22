"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2, ChevronRight, Loader2, MapPin, Plus, Edit2,
  Truck, CreditCard, ShoppingBag, Tag, X, Banknote, ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";
import {
  getAddresses, getShippingRates, applyCoupon,
  createAddressDetailed, updateAddressDetailed,
  createRazorpayOrder, verifyRazorpayPayment, createEasepayOrder, getPaymentSettings, syncCartToServer, createCheckout,
  type ApiAddress, type ApiShippingRate, type ApiCouponResult,
} from "@/lib/api";
import { trackBeginCheckout, storePurchaseEvent } from "@/lib/analytics";
import { readLastPincodeFromCookie, writeLastPincodeCookie } from "@/lib/location-preferences";

// ─── Razorpay types ───────────────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  image?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeFmt(symbol: string) {
  return (n: number) =>
    `${symbol}${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtWeight(weightG: number): string {
  return weightG >= 1000
    ? `${(weightG / 1000).toFixed(2).replace(/\.?0+$/, "")} kg`
    : `${weightG} g`;
}

function formatItemTotalWeight(weight?: number, weightUnit?: string, quantity = 1): string | null {
  if (weight == null || weight <= 0) return null;

  const unit = (weightUnit ?? "g").toLowerCase();
  const unitG = unit === "kg" ? weight * 1000 : weight;
  const totalG = unitG * quantity;

  return `Total weight: ${fmtWeight(totalG)} (${fmtWeight(unitG)} x ${quantity})`;
}

function shouldBypassOptimizer(src?: string | null): boolean {
  if (!src) return false;
  return /^https?:\/\//i.test(src);
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

type Step = 1 | 2 | 3;
type PaymentMethod = "razorpay" | "easepay" | "cod";

const BLANK_ADDRESS = {
  name: "", phone: "", company_name: "", address_line1: "", address_line2: "",
  city: "", state: "", pincode: "", gstin: "",
};

const COMPANY_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9\s.,&()'/-]*$/;
const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

function normalizeCompanyName(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeGstin(value: string): string {
  return value.replace(/[^0-9A-Za-z]/g, "").toUpperCase().slice(0, 15);
}

function validateBusinessFields(value: typeof BLANK_ADDRESS): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  const companyName = normalizeCompanyName(value.company_name);
  const gstin = normalizeGstin(value.gstin);

  if (companyName && !COMPANY_NAME_PATTERN.test(companyName)) {
    errors.company_name = ["Company name contains invalid characters."];
  }

  if (gstin) {
    if (gstin.length !== 15) {
      errors.gstin = ["GSTIN must be exactly 15 characters long."];
    } else if (!GSTIN_PATTERN.test(gstin)) {
      errors.gstin = ["GSTIN format is invalid. Use a value like 07AAAAA0000A1Z5."];
    }
  }

  return errors;
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: "Address" },
    { n: 2, label: "Shipping" },
    { n: 3, label: "Payment" },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map(({ n, label }, i) => {
        const done = step > n;
        const active = step === n;
        return (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? "bg-green-500 text-white"
                    : active
                    ? "text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
                style={active ? { background: "linear-gradient(135deg,#1f4f8a,#0f2f5f)" } : undefined}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : n}
              </div>
              <span
                className={`text-[11px] mt-1 font-medium ${
                  active ? "text-(--color-primary)" : done ? "text-green-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-1 mb-4 rounded-full transition-colors ${
                  step > n ? "bg-green-400" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Address Form ─────────────────────────────────────────────────────────────

interface AddressFormProps {
  value: typeof BLANK_ADDRESS;
  onChange: (v: typeof BLANK_ADDRESS) => void;
  onSave: () => void;
  onCancel?: () => void;
  saving: boolean;
  errorMessage?: string;
  fieldErrors?: Record<string, string[]>;
  isEditing?: boolean;
}

function AddressForm({ value, onChange, onSave, onCancel, saving, errorMessage, fieldErrors, isEditing }: AddressFormProps) {
  const set = (field: keyof typeof BLANK_ADDRESS) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => onChange({ ...value, [field]: e.target.value });

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-(--color-primary) focus:bg-white transition-colors";
  const getInputCls = (field: keyof typeof BLANK_ADDRESS) => `${inputCls} ${fieldErrors?.[field]?.length ? "border-red-300 bg-red-50 focus:border-red-400" : ""}`;
  const renderFieldError = (field: keyof typeof BLANK_ADDRESS) => {
    const message = fieldErrors?.[field]?.[0];
    return message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null;
  };

  return (
    <div className="space-y-3 mt-4 p-5 rounded-2xl border border-gray-200 bg-gray-50">
      <h3 className="text-sm font-bold text-(--color-secondary)">{isEditing ? "Edit Address" : "New Address"}</h3>
      {(errorMessage || (fieldErrors && Object.keys(fieldErrors).length > 0)) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">
          {errorMessage && <p className="text-xs font-semibold text-red-700 mb-1">{errorMessage}</p>}
          <ul className="list-disc pl-4 space-y-0.5">
            {Object.values(fieldErrors ?? {}).flat().map((msg, i) => (
              <li key={`${msg}-${i}`} className="text-xs text-red-700">
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Full Name *</label>
          <input className={getInputCls("name")} placeholder="e.g. Rahul Sharma" value={value.name} onChange={set("name")} />
          {renderFieldError("name")}
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Mobile Number *</label>
          <input className={getInputCls("phone")} placeholder="10-digit mobile" value={value.phone}
            onChange={(e) => onChange({ ...value, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            inputMode="numeric" />
          {renderFieldError("phone")}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Company Name</label>
        <input className={getInputCls("company_name")} placeholder="Company / Business name (optional)" value={value.company_name} onChange={set("company_name")} />
        {renderFieldError("company_name")}
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">GSTIN</label>
        <input
          className={getInputCls("gstin")}
          placeholder="e.g. 07AAAAA0000A1Z5"
          value={value.gstin}
          onChange={(e) => onChange({ ...value, gstin: normalizeGstin(e.target.value) })}
          maxLength={15}
          autoCapitalize="characters"
        />
        {renderFieldError("gstin")}
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Address Line 1 *</label>
        <input className={getInputCls("address_line1")} placeholder="Flat / House No., Building, Street" value={value.address_line1} onChange={set("address_line1")} />
        {renderFieldError("address_line1")}
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Address Line 2</label>
        <input className={getInputCls("address_line2")} placeholder="Area, Colony, Locality (optional)" value={value.address_line2} onChange={set("address_line2")} />
        {renderFieldError("address_line2")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">City *</label>
          <input className={getInputCls("city")} placeholder="City" value={value.city} onChange={set("city")} />
          {renderFieldError("city")}
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">State *</label>
          <select className={getInputCls("state")} value={value.state} onChange={set("state")} title="State">
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {renderFieldError("state")}
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Pincode *</label>
          <input className={getInputCls("pincode")} placeholder="6-digit PIN" value={value.pincode}
            onChange={(e) => onChange({ ...value, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
            inputMode="numeric" />
          {renderFieldError("pincode")}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onSave}
          disabled={saving || !value.name || !value.phone || !value.address_line1 || !value.city || !value.state || !value.pincode}
          className="btn-brand flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isEditing ? "Update Address" : "Save Address"}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Order Summary sidebar ────────────────────────────────────────────────────

interface OrderSummaryProps {
  subtotal: number;
  totalGst: number;
  discount: number;
  shippingCharge: number;
  shippingLabel?: string | null;
  shippingEta?: string | null;
  couponResult: ApiCouponResult | null;
  currencySymbol: string;
  items: { name: string; quantity: number; price: number; image?: string | null; weight?: number; weightUnit?: string }[];
}

function OrderSummary({ subtotal, totalGst, discount, shippingCharge, shippingLabel, shippingEta, couponResult, currencySymbol, items }: OrderSummaryProps) {
  const fmt = makeFmt(currencySymbol);
  const grand = Math.max(subtotal - discount, 0) + totalGst + shippingCharge;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-28">
      <h3 className="text-sm font-extrabold text-(--color-secondary) mb-4">Order Summary</h3>

      {/* Items preview */}
      <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto">
        {items.map((item, i) => {
          const weightSummary = formatItemTotalWeight(item.weight, item.weightUnit, item.quantity);

          return (
          <div key={i} className="flex items-center gap-3">
            <div className="relative shrink-0 w-10 h-10 mt-1.5 mr-1.5">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 relative">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-gray-300" />
                  </div>
                )}
              </div>
              <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 rounded-full bg-(--color-primary) text-white text-[9px] flex items-center justify-center font-bold z-10">
                {item.quantity > 99 ? "99+" : item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-(--color-secondary) line-clamp-1">{item.name}</p>
              {weightSummary && (
                <p className="text-[10px] text-gray-400 mt-0.5">{weightSummary}</p>
              )}
            </div>
            <p className="text-xs font-bold text-(--color-secondary) shrink-0">
              {fmt(item.price * item.quantity)}
            </p>
          </div>
        );})}
      </div>

      {/* Coupon badge */}
      {couponResult && (
        <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-green-50 border border-green-100">
          <Tag className="h-3.5 w-3.5 text-green-600 shrink-0" />
          <span className="text-xs font-semibold text-green-700">{couponResult.code}</span>
          <span className="text-xs text-green-600 ml-auto">−{fmt(discount)}</span>
        </div>
      )}

      {/* Breakdown */}
      <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold text-(--color-secondary)">{fmt(subtotal)}</span>
        </div>
        {shippingLabel && (
          <div className="flex items-start justify-between gap-3 text-gray-600">
            <div>
              <p>Shipping</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{shippingLabel}{shippingEta ? ` · ${shippingEta}` : ""}</p>
            </div>
            <span className="font-semibold text-(--color-secondary)">
              {shippingCharge === 0 ? <span className="text-green-600">Free</span> : fmt(shippingCharge)}
            </span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-semibold">−{fmt(discount)}</span>
          </div>
        )}
        {totalGst > 0 && (
          <div className="flex justify-between text-xs text-gray-400 border-t border-dashed border-gray-100 pt-3">
            <span>GST</span>
            <span>{fmt(totalGst)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
        <span className="font-extrabold text-(--color-secondary)">Total</span>
        <span className="text-lg font-extrabold text-(--color-secondary)">{fmt(grand)}</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CheckoutClient() {
  const router = useRouter();
  const { user, updateUser, isLoading: authLoading, isLoggedIn } = useAuth();
  const { items, total, totalGst, clearCart, removeItem } = useCart();
  const currencySymbol = items[0]?.currencySymbol ?? "₹";
  const fmt = makeFmt(currencySymbol);

  const [step, setStep] = useState<Step>(1);
  const [loginModalDismissed, setLoginModalDismissed] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState(BLANK_ADDRESS);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressSaveError, setAddressSaveError] = useState("");
  const [addressFieldErrors, setAddressFieldErrors] = useState<Record<string, string[]>>({});

  // Shipping state
  const [shippingRates, setShippingRates] = useState<ApiShippingRate[]>([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [selectedRateId, setSelectedRateId] = useState<number | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<ApiCouponResult | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<PaymentMethod[]>([]);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [lastPincode, setLastPincode] = useState("");

  // Set to true synchronously before clearCart() on payment success so the guard below never fires
  const orderSuccessRef = useRef(false);
  // When syncing/removing items during checkout we temporarily suppress the "empty cart -> redirect" guard
  const suppressEmptyCartRedirectRef = useRef(false);

  // Redirect if cart empty — skip when we just completed an order
  useEffect(() => {
    if (items.length === 0 && !orderSuccessRef.current && !suppressEmptyCartRedirectRef.current) router.replace("/cart");
  }, [items.length, router]);

  useEffect(() => {
    setLastPincode(readLastPincodeFromCookie());
  }, [user?.company_name, user?.gstin]);

  // Restore coupon applied on the cart page
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("applied_coupon");
      if (saved) {
        const parsed = JSON.parse(saved) as ApiCouponResult;
        if (parsed?.valid) {
          setCouponCode(parsed.code);
          setCouponResult(parsed);
        }
      }
    } catch {}
  }, [user?.company_name, user?.gstin]);

  // Fire begin_checkout once when the page mounts with a non-empty cart
  useEffect(() => {
    if (items.length === 0) return;
    trackBeginCheckout({
      value: total,
      items: items.map((i) => ({
        item_id:   String(i.productId ?? i.id.split("-")[0]),
        item_name: i.name,
        price:     i.price,
        quantity:  i.quantity,
      })),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load addresses once auth is ready (prevents empty load before token rehydration).
  useEffect(() => {
    if (authLoading || !isLoggedIn) return;

    getAddresses().then((list) => {
      setAddresses(list);
      const byPincode = lastPincode
        ? list.find((a) => a.pincode === lastPincode)
        : undefined;
      const def = list.find((a) => a.is_default) ?? byPincode ?? list[0];
      if (def) setSelectedAddressId(def.id);
      if (list.length === 0) setShowAddressForm(true);
      setAddressLoading(false);
    });
  }, [authLoading, isLoggedIn, lastPincode]);

  useEffect(() => {
    if (!showAddressForm) return;

    setNewAddress((current) => (
      {
        ...current,
        pincode: current.pincode || lastPincode,
        company_name: current.company_name || user?.company_name || "",
        gstin: current.gstin || user?.gstin || "",
      }
    ));
  }, [showAddressForm, lastPincode, user?.company_name, user?.gstin]);

  useEffect(() => {
    getPaymentSettings()
      .then((settings) => {
        const methods: PaymentMethod[] = [];
        if (settings.razorpayEnabled) methods.push("razorpay");
        if (settings.easepayEnabled) methods.push("easepay");
        if (settings.codEnabled) methods.push("cod");
        if (methods.length === 0) methods.push("cod");
        setAvailablePaymentMethods(methods);
        setPaymentMethod((current) => (methods.includes(current) ? current : methods[0]));
      })
      .catch(() => {
        // Fallback: show razorpay + cod if settings fetch fails
        setAvailablePaymentMethods(["razorpay", "cod"]);
      });
  }, []);

  // Derived values
  const discount = couponResult?.discount_amount ?? 0;
  const selectedRate = shippingRates.find((r) => r.id === selectedRateId);
  const shippingCharge = selectedRate?.charge ?? 0;
  const grandTotal = Math.max(total - discount, 0) + totalGst + shippingCharge;
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  // ── Handlers ──

  const handleEditAddress = useCallback((addr: ApiAddress) => {
    setEditingAddressId(addr.id);
    setNewAddress({
      name: addr.name,
      phone: addr.phone,
      company_name: addr.company_name ?? user?.company_name ?? "",
      address_line1: addr.address_line1,
      address_line2: addr.address_line2 ?? "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      gstin: user?.gstin ?? "",
    });
    setAddressSaveError("");
    setAddressFieldErrors({});
    setShowAddressForm(true);
  }, [user?.company_name, user?.gstin]);

  const handleSaveAddress = useCallback(async () => {
    setAddressSaveError("");
    const businessFieldErrors = validateBusinessFields(newAddress);
    if (Object.keys(businessFieldErrors).length > 0) {
      setAddressFieldErrors(businessFieldErrors);
      setAddressSaveError("Please fix the highlighted fields.");
      return;
    }

    setAddressFieldErrors({});
    setSavingAddress(true);

    const normalizedCompanyName = normalizeCompanyName(newAddress.company_name);
    const normalizedGstin = normalizeGstin(newAddress.gstin);

    if (editingAddressId !== null) {
      // ── Update existing address ──
      const result = await updateAddressDetailed(editingAddressId, {
        name: newAddress.name,
        phone: newAddress.phone,
        company_name: normalizedCompanyName,
        address_line1: newAddress.address_line1,
        address_line2: newAddress.address_line2,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
        gstin: normalizedGstin,
      });
      setSavingAddress(false);
      if (result.success && result.address) {
        setAddresses((prev) => prev.map((a) => (a.id === editingAddressId ? result.address! : a)));
        writeLastPincodeCookie(result.address.pincode);
        setLastPincode(result.address.pincode);
        setSelectedAddressId(result.address.id);
        updateUser({
          company_name: normalizedCompanyName || null,
          gstin: normalizedGstin || null,
        });
        setShowAddressForm(false);
        setEditingAddressId(null);
        setNewAddress(BLANK_ADDRESS);
        setAddressSaveError("");
        setAddressFieldErrors({});
      } else {
        setAddressSaveError(result.message ?? "Failed to update address. Please try again.");
        setAddressFieldErrors(result.errors ?? {});
      }
      return;
    }

    // ── Create new address ──
    const result = await createAddressDetailed({
      name: newAddress.name,
      phone: newAddress.phone,
      company_name: normalizedCompanyName,
      address_line1: newAddress.address_line1,
      address_line2: newAddress.address_line2,
      city: newAddress.city,
      state: newAddress.state,
      pincode: newAddress.pincode,
      gstin: normalizedGstin,
    });
    setSavingAddress(false);
    if (result.success && result.address) {
      setAddresses((prev) => [...prev, result.address as ApiAddress]);
      setSelectedAddressId(result.address.id);
      updateUser({
        company_name: normalizedCompanyName || null,
        gstin: normalizedGstin || null,
      });
      writeLastPincodeCookie(result.address.pincode);
      setLastPincode(result.address.pincode);
      setShowAddressForm(false);
      setNewAddress(BLANK_ADDRESS);
      setAddressSaveError("");
      setAddressFieldErrors({});
    } else {
      setAddressSaveError(result.message ?? "Failed to save address.");
      setAddressFieldErrors(result.errors ?? {});
    }
  }, [newAddress, editingAddressId, updateUser]);

  const handleContinueToShipping = useCallback(async () => {
    if (!selectedAddress) return;
    writeLastPincodeCookie(selectedAddress.pincode);
    setLastPincode(selectedAddress.pincode);
    setStep(2);
    setShippingLoading(true);
    // Calculate total weight in grams from all cart items
    const totalWeightGrams = items.reduce((sum, item) => {
      if (item.weight == null || item.weight <= 0) return sum;
      const unit = (item.weightUnit ?? "g").toLowerCase();
      const unitGrams = unit === "kg" ? item.weight * 1000 : item.weight;
      return sum + unitGrams * item.quantity;
    }, 0);
    const rates = await getShippingRates(selectedAddress.pincode, total - discount, totalWeightGrams || undefined);
    setShippingRates(rates);
    if (rates.length > 0) setSelectedRateId(rates[0].id);
    setShippingLoading(false);
  }, [selectedAddress, total, discount, items]);

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    setCouponLoading(true);
    const result = await applyCoupon(couponCode.trim().toUpperCase(), total);
    setCouponLoading(false);
    if (result.valid) {
      setCouponResult(result);
      setCouponCode("");
      sessionStorage.setItem("applied_coupon", JSON.stringify(result));
    } else {
      setCouponError(result.message ?? "Invalid coupon code.");
    }
  }, [couponCode, total]);

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedAddressId || selectedRateId === null) return;
    setPaymentError("");
    setProcessingPayment(true);

    const checkoutItems = items.map((item) => ({
      product_id: item.productId ?? parseInt(item.id.split("-")[0]),
      ...(item.variantId ? { variant_id: item.variantId } : {}),
      quantity: item.quantity,
    }));

    // Sync local cart to server-side cart before placing order
    const syncableItems = items.filter((i) => i.variantId && i.storeId);
    if (syncableItems.length > 0) {
      console.log("[handlePlaceOrder] syncing cart to server...");
      const synced = await syncCartToServer(
        syncableItems.map((i) => ({ variantId: i.variantId!, storeId: i.storeId!, quantity: i.quantity }))
      );
      console.log("[handlePlaceOrder] cart sync result:", synced);
      if (!synced.success) {
        // Remove items that failed to sync from local cart so user isn't stuck in a loop
        if (synced.failedVariantIds && synced.failedVariantIds.length > 0) {
          // suppress redirect while we remove items (avoid immediate redirect to /cart)
          suppressEmptyCartRedirectRef.current = true;
          for (const item of items) {
            if (item.variantId && synced.failedVariantIds.includes(item.variantId)) {
              removeItem(item.id);
            }
          }
          // leave suppression active briefly so the removal render doesn't trigger a redirect
          setTimeout(() => { suppressEmptyCartRedirectRef.current = false; }, 1500);
        }
        setPaymentError(synced.message ?? "Failed to sync cart. Please try again.");
        setProcessingPayment(false);
        return;
      }
    } else {
      console.warn("[handlePlaceOrder] no syncable items (missing variantId or storeId):", items);
    }

    if (paymentMethod === "cod") {
      const result = await createCheckout({
        address_id: selectedAddressId,
        shipping_rate_id: selectedRateId,
        delivery_charge: shippingCharge,
        coupon_code: couponResult?.code,
        payment_method: "cod",
        items: checkoutItems,
      });
      if (result.success) {
        storePurchaseEvent({
          transaction_id: result.order_number ?? "",
          value:          grandTotal,
          currency:       "INR",
          items: items.map((i) => ({
            item_id:   String(i.productId ?? i.id.split("-")[0]),
            item_name: i.name,
            price:     i.price,
            quantity:  i.quantity,
          })),
        });
        orderSuccessRef.current = true;
        clearCart();
        sessionStorage.removeItem("applied_coupon");
        console.log("[checkout] navigation to order-confirmed (COD):", { order_number: result.order_number, order_id: result.order_id });
        {
          const slug = (result as any).slug ?? (result as any).order_slug ?? "";
          const href = `/order-confirmed?order_number=${result.order_number ?? ""}&order_id=${result.order_id ?? ""}&order_slug=${encodeURIComponent(slug)}`;
          try { (window.top as any)?.location && ((window.top as any).location.href = href); } catch (e) { window.location.href = href; }
        }
      } else {
        setProcessingPayment(false);
        setPaymentError(result.message ?? "Order failed. Please try again.");
      }
      return;
    }

    if (paymentMethod === "easepay") {
      const result = await createCheckout({
        address_id: selectedAddressId,
        shipping_rate_id: selectedRateId,
        delivery_charge: shippingCharge,
        coupon_code: couponResult?.code,
        payment_method: "easepay",
        items: checkoutItems,
      });

      if (!result.success || !result.order_id) {
        setPaymentError(result.message ?? "Order failed. Please try again.");
        setProcessingPayment(false);
        return;
      }

      const easepayOrder = await createEasepayOrder(result.order_id, grandTotal);
      if (!easepayOrder?.payment_url) {
        setPaymentError("Could not initiate Easepay payment. Please try again.");
        setProcessingPayment(false);
        return;
      }

      storePurchaseEvent({
        transaction_id: result.order_id ? String(result.order_id) : "",
        value:          grandTotal,
        currency:       "INR",
        items: items.map((i) => ({
          item_id:   String(i.productId ?? i.id.split("-")[0]),
          item_name: i.name,
          price:     i.price,
          quantity:  i.quantity,
        })),
      });
      {
        const url = easepayOrder.payment_url;
        try { (window.top as any)?.location && ((window.top as any).location.href = url); } catch (e) { window.location.href = url; }
      }
      return;
    }

    // Razorpay flow
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setPaymentError("Failed to load payment gateway. Please try again.");
      setProcessingPayment(false);
      return;
    }

    const amountInPaise = Math.round(grandTotal * 100);
    const rzpOrder = await createRazorpayOrder(amountInPaise);
    if (!rzpOrder) {
      setPaymentError("Could not initiate payment. Please try again.");
      setProcessingPayment(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: rzpOrder.key,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      order_id: rzpOrder.razorpay_order_id,
      name: "Pethiyan",
      description: "Packaging Products",
      image: "/pethiyan-logo.png",
      prefill: {
        name: user?.name ?? "",
        contact: `+91${user?.mobile ?? ""}`,
        email: user?.email ?? "",
      },
      theme: { color: "#1f4f8a" },
      handler: async (response) => {
        console.group("[Razorpay handler]");
        console.log("Razorpay response:", response);

        // Verify payment signature
        console.log("Step 1 — verifying payment signature...");
        const verified = await verifyRazorpayPayment({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
        console.log("Verify result:", verified);

        if (!verified.success) {
          console.warn("Signature verification failed:", verified.message);
          console.groupEnd();
          setPaymentError("Payment verification failed. Contact support.");
          setProcessingPayment(false);
          return;
        }

        // Create order
        console.log("Step 2 — placing order...");
        console.log("address_id:", selectedAddressId, "shipping_rate_id:", selectedRateId);
        const result = await createCheckout({
          address_id: selectedAddressId!,
          shipping_rate_id: selectedRateId!,
          delivery_charge: shippingCharge,
          coupon_code: couponResult?.code,
          payment_method: "razorpay",
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          items: checkoutItems,
        });
        console.log("createCheckout result:", result);
        console.groupEnd();

        if (result.success) {
          storePurchaseEvent({
            transaction_id: result.order_number ?? "",
            value:          grandTotal,
            currency:       "INR",
            items: items.map((i) => ({
              item_id:   String(i.productId ?? i.id.split("-")[0]),
              item_name: i.name,
              price:     i.price,
              quantity:  i.quantity,
            })),
          });
          orderSuccessRef.current = true;
          clearCart();
          sessionStorage.removeItem("applied_coupon");
          console.log("[checkout] navigation to order-confirmed (Razorpay):", { order_number: result.order_number, order_id: result.order_id });
          {
            const slug = (result as any).slug ?? (result as any).order_slug ?? "";
            const href = `/order-confirmed?order_number=${result.order_number ?? ""}&order_id=${result.order_id ?? ""}&order_slug=${encodeURIComponent(slug)}`;
            try { (window.top as any)?.location && ((window.top as any).location.href = href); } catch (e) { window.location.href = href; }
          }
        } else {
          setProcessingPayment(false);
          setPaymentError(result.message ?? "Order placement failed. Contact support.");
        }
      },
      modal: {
        ondismiss: () => setProcessingPayment(false),
      },
    });
    rzp.open();
  }, [
    selectedAddressId, selectedRateId, paymentMethod, items,
    couponResult, grandTotal, user, clearCart, router, shippingCharge,
  ]);

  // ── Render ──

  if (items.length === 0) return null;
  if (authLoading) return null;

  if (!isLoggedIn) {
    const loginOpen = !loginModalDismissed;
    return (
      <div style={{ background: "var(--background)", minHeight: "100vh" }}>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <h1 className="text-2xl font-extrabold text-(--color-secondary) mb-3">Login Required</h1>
            <p className="text-gray-500 mb-6">
              Please sign in or register to continue checkout.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setLoginModalDismissed(false)}
                className="btn-brand px-6 py-3 rounded-xl text-sm font-bold"
              >
                Login / Register
              </button>
              <Link href="/cart" className="px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
                Back to Cart
              </Link>
            </div>
          </div>
        </div>

        <LoginModal
          open={loginOpen}
          onClose={() => setLoginModalDismissed(true)}
          onSuccess={() => setLoginModalDismissed(false)}
        />
      </div>
    );
  }

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-(--color-primary)">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/cart" className="hover:text-(--color-primary)">Cart</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-(--color-secondary) font-medium">Checkout</span>
        </nav>

        <h1 className="text-2xl font-extrabold text-(--color-secondary) mb-6">Checkout</h1>

        <StepIndicator step={step} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Main content ── */}
          <div className="lg:col-span-7 space-y-5">

            {/* ═══ STEP 1: Address ═══ */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="h-5 w-5 text-(--color-primary)" />
                  <h2 className="text-base font-extrabold text-(--color-secondary)">
                    Delivery Address
                  </h2>
                </div>

                {addressLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-(--color-primary)" />
                  </div>
                ) : (
                  <>
                    {addresses.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {addresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedAddressId === addr.id
                                ? "border-transparent bg-blue-50 shadow-[0_0_0_2px_#17396f,0_0_0_3.5px_#49ad57]"
                                : "border-gray-100 hover:border-gray-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name="address"
                              value={addr.id}
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-0.5 accent-(--color-primary)"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-(--color-secondary)">{addr.name}</span>
                                {addr.is_default && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-(--color-primary) text-white">
                                    Default
                                  </span>
                                )}
                              </div>
                              {addr.company_name && (
                                <p className="text-sm text-gray-500 mt-0.5">{addr.company_name}</p>
                              )}
                              <p className="text-sm text-gray-500 mt-0.5">
                                {addr.address_line1}
                                {addr.address_line2 ? `, ${addr.address_line2}` : ""}
                              </p>
                              <p className="text-sm text-gray-500">
                                {addr.city}, {addr.state} — {addr.pincode}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">📞 +91 {addr.phone}</p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); handleEditAddress(addr); }}
                              className="p-1.5 rounded-lg text-gray-300 hover:text-(--color-primary) hover:bg-blue-50 transition-colors shrink-0 mt-0.5"
                              aria-label="Edit address"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          </label>
                        ))}
                      </div>
                    )}

                    {!showAddressForm ? (
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="flex items-center gap-2 text-sm font-semibold text-(--color-primary) hover:gap-3 transition-all"
                      >
                        <Plus className="h-4 w-4" />
                        Add a new address
                      </button>
                    ) : (
                      <AddressForm
                        value={newAddress}
                        onChange={setNewAddress}
                        onSave={handleSaveAddress}
                        onCancel={addresses.length > 0 ? () => { setShowAddressForm(false); setEditingAddressId(null); setNewAddress(BLANK_ADDRESS); } : undefined}
                        saving={savingAddress}
                        errorMessage={addressSaveError}
                        fieldErrors={addressFieldErrors}
                        isEditing={editingAddressId !== null}
                      />
                    )}
                  </>
                )}

                {!showAddressForm && selectedAddressId && (
                  <button
                    onClick={handleContinueToShipping}
                    className="btn-brand mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                  >
                    Continue to Shipping
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* ═══ STEP 2: Shipping ═══ */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-(--color-primary)" />
                    <h2 className="text-base font-extrabold text-(--color-secondary)">Shipping Method</h2>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-gray-400 hover:text-(--color-primary) flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Change address
                  </button>
                </div>

                {/* Selected address summary */}
                {selectedAddress && (
                  <div className="mb-4 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600">
                    <span className="font-semibold text-(--color-secondary)">{selectedAddress.name}</span>
                    {selectedAddress.company_name ? <><span>{" · "}</span>{selectedAddress.company_name}</> : null}
                    {" · "}{selectedAddress.address_line1}, {selectedAddress.city}, {selectedAddress.pincode}
                  </div>
                )}

                {shippingLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-(--color-primary)" />
                  </div>
                ) : shippingRates.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-500">
                      No shipping options available for this pincode. Please check your address.
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="mt-3 text-sm font-semibold text-(--color-primary)"
                    >
                      Change Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {shippingRates.map((rate) => (
                      <label
                        key={rate.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedRateId === rate.id
                            ? "border-transparent bg-blue-50 shadow-[0_0_0_2px_#17396f,0_0_0_3.5px_#49ad57]"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={rate.id}
                          checked={selectedRateId === rate.id}
                          onChange={() => setSelectedRateId(rate.id)}
                          className="accent-(--color-primary)"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-(--color-secondary)">{rate.label}</span>
                            {rate.is_free && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                FREE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Estimated delivery: {rate.estimated_days}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-(--color-secondary)">
                          {rate.is_free || rate.charge === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            fmt(rate.charge)
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {selectedRateId !== null && (
                  <button
                    onClick={() => setStep(3)}
                    className="btn-brand mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                  >
                    Continue to Payment
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* ═══ STEP 3: Payment ═══ */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-(--color-primary)" />
                    <h2 className="text-base font-extrabold text-(--color-secondary)">Payment</h2>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-gray-400 hover:text-(--color-primary) flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Change shipping
                  </button>
                </div>

                {selectedRate && (
                  <div className="mb-6 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selected Shipping</p>
                        <p className="text-sm font-semibold text-(--color-secondary) mt-1">{selectedRate.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Estimated delivery: {selectedRate.estimated_days}</p>
                      </div>
                      <p className="text-sm font-bold text-(--color-secondary)">
                        {selectedRate.is_free || selectedRate.charge === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          fmt(selectedRate.charge)
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Coupon in payment step */}
                <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    <Tag className="h-3 w-3 inline mr-1" />
                    Coupon Code
                  </p>
                  {couponResult ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-700">{couponResult.code}</span>
                        <span className="text-sm text-green-600">— {fmt(discount)} off</span>
                      </div>
                      <button onClick={() => { setCouponResult(null); sessionStorage.removeItem("applied_coupon"); }} className="text-green-400 hover:text-green-600" aria-label="Remove coupon" title="Remove coupon">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-mono tracking-wider outline-none focus:border-(--color-primary) transition-colors"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || couponLoading}
                        className="btn-brand px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
                      >
                        {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
                </div>

                {/* Payment method */}
                <div className="space-y-3 mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Method</p>

                  {availablePaymentMethods.length === 0 ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-16 rounded-xl border-2 border-gray-100 bg-gray-50 animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    availablePaymentMethods.map((method) => (
                      <label
                        key={method}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === method ? "border-transparent bg-blue-50 shadow-[0_0_0_2px_#17396f,0_0_0_3.5px_#49ad57]" : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="accent-(--color-primary)"
                        />
                        {method === "cod" ? (
                          <Banknote className="h-5 w-5 text-green-600" />
                        ) : (
                          <CreditCard className="h-5 w-5 text-(--color-primary)" />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-(--color-secondary)">
                            {method === "cod"
                              ? "Cash on Delivery"
                              : method === "easepay"
                                ? "Easebuzz"
                                : "Razorpay"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {method === "cod"
                              ? "Pay when your order arrives"
                              : method === "easepay"
                                ? "UPI, Cards, Net Banking via Easebuzz"
                                : "UPI, Cards, Net Banking via Razorpay"}
                          </p>
                        </div>
                        {method === "razorpay" && (
                          <img src="/razorpay-logo.svg" alt="Razorpay" className="h-5 ml-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        )}
                      </label>
                    ))
                  )}
                </div>

                {/* Error */}
                {paymentError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                    {paymentError}
                  </div>
                )}

                {/* Place order button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={processingPayment}
                  className="btn-brand w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing…
                    </>
                  ) : paymentMethod === "razorpay" ? (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Pay {fmt(grandTotal)}
                    </>
                  ) : paymentMethod === "easepay" ? (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Pay with Easepay — {fmt(grandTotal)}
                    </>
                  ) : (
                    <>
                      <Banknote className="h-4 w-4" />
                      Place Order (COD) — {fmt(grandTotal)}
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-gray-400 mt-4">
                  🔒 Secured by 256-bit encryption · By placing this order you agree to our{" "}
                  <Link href="/terms-and-conditions" className="underline">Terms</Link>
                </p>
              </div>
            )}
          </div>

          {/* ── Order Summary sidebar ── */}
          <div className="lg:col-span-5">
            <OrderSummary
              subtotal={total}
              totalGst={totalGst}
              discount={discount}
              shippingCharge={shippingCharge}
              shippingLabel={selectedRate?.label ?? null}
              shippingEta={selectedRate?.estimated_days ?? null}
              couponResult={couponResult}
              currencySymbol={currencySymbol}
              items={items}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
