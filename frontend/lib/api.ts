// ─── API base ────────────────────────────────────────────────────────────────
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const LS_TOKEN_KEY = "auth_token";

// ─── API Types ────────────────────────────────────────────────────────────────

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image?: string;
  parent_id?: number | null;
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  price: string | number;
  compare_price?: string | number | null;
  sale_price?: string | number | null;
  rating?: number | null;
  reviews_count?: number | null;
  thumbnail?: string | null;
  images?: string[];
  video_url?: string | null;
  category?: ApiCategory | null;
  brand?: { id: number; name: string } | null;
  stock?: number | null;
  min_order_qty?: number | null;
  is_featured?: boolean;
  tags?: string[];
  specifications?: { key: string; value: string }[];
}

export interface ApiReview {
  id: number;
  rating: number;
  comment: string;
  user?: { name: string };
  created_at: string;
}

export interface ApiFaq {
  id: number;
  question: string;
  answer: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page?: number;
  last_page?: number;
  total?: number;
  per_page?: number;
}

// ─── Additional Types ─────────────────────────────────────────────────────────

export interface ApiVariantAttribute {
  id: number;
  name: string;           // e.g. "Size"
  values: {
    id: number;
    value: string;        // e.g. "500ml"
    price_modifier?: number;
  }[];
}

export interface ApiProductVariant {
  id: number;
  sku?: string;
  price: number;
  stock?: number | null;
  attribute_values: { attribute_id: number; value_id: number }[];
}

export interface ApiAddress {
  id: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export interface ApiOrder {
  id: number;
  order_number: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  subtotal: number;
  shipping_charge: number;
  discount?: number;
  gst_amount?: number;
  created_at: string;
  updated_at: string;
  items: ApiOrderItem[];
  address?: ApiAddress;
  payment_method?: string;
  transaction_id?: string;
  tracking?: ApiTrackingStep[];
}

export interface ApiOrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  variant_label?: string;
  quantity: number;
  price: number;
  image?: string | null;
}

export interface ApiTrackingStep {
  status: string;
  label: string;
  description?: string;
  completed: boolean;
  timestamp?: string;
}

export interface ApiCouponResult {
  valid: boolean;
  code: string;
  discount_type: "percentage" | "fixed" | "free_shipping";
  discount_value: number;
  discount_amount: number;
  message?: string;
}

export interface ApiShippingRate {
  id: number;
  label: string;
  charge: number;
  estimated_days: string;
  is_free: boolean;
}

export interface ApiCheckoutPayload {
  address_id: number;
  shipping_rate_id: number;
  coupon_code?: string;
  payment_method: "razorpay" | "cod";
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  items: { product_id: number; variant_id?: number; quantity: number }[];
}

export interface ApiRazorpayOrder {
  razorpay_order_id: string;
  amount: number;           // in paise
  currency: string;
  key: string;              // Razorpay public key
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LS_TOKEN_KEY);
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json", ...options?.headers },
      cache: "no-store",
      ...options,
    });
    // Always parse JSON — error responses (4xx/5xx) carry a message body we need to show
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

async function apiAuth<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown
): Promise<T | null> {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<ApiProduct[]> {
  const res = await apiFetch<ApiResponse<ApiProduct[]> | ApiProduct[] | PaginatedResponse<ApiProduct>>(
    "/api/products/store-wise"
  );
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if ("data" in res) {
    if (Array.isArray(res.data)) return res.data;
  }
  return [];
}

export async function searchProducts(keywords: string): Promise<ApiProduct[]> {
  const res = await apiFetch<ApiResponse<ApiProduct[]> | ApiProduct[]>(
    `/api/products/search-by-keywords?keywords=${encodeURIComponent(keywords)}`
  );
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if ("data" in res && Array.isArray(res.data)) return res.data;
  return [];
}

export async function getProduct(slug: string): Promise<ApiProduct | null> {
  const res = await apiFetch<ApiResponse<ApiProduct> | ApiProduct>(
    `/api/products/${slug}`
  );
  if (!res) return null;
  if ("data" in res && typeof res.data === "object" && "id" in (res.data as object))
    return res.data as ApiProduct;
  if ("id" in (res as object)) return res as ApiProduct;
  return null;
}

export async function getProductReviews(slug: string): Promise<ApiReview[]> {
  const res = await apiFetch<ApiResponse<ApiReview[]> | ApiReview[]>(
    `/api/products/${slug}/reviews`
  );
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if ("data" in res && Array.isArray(res.data)) return res.data;
  return [];
}

export async function getProductFaqs(slug: string): Promise<ApiFaq[]> {
  const res = await apiFetch<ApiResponse<ApiFaq[]> | ApiFaq[]>(
    `/api/products/${slug}/faqs`
  );
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if ("data" in res && Array.isArray(res.data)) return res.data;
  return [];
}

export async function getCategories(): Promise<ApiCategory[]> {
  const res = await apiFetch<ApiResponse<ApiCategory[]> | ApiCategory[]>(
    "/api/categories"
  );
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if ("data" in res && Array.isArray(res.data)) return res.data;
  return [];
}

// ─── Normalise price to number ────────────────────────────────────────────────
export function toNum(val: string | number | null | undefined): number {
  if (val == null) return 0;
  return typeof val === "number" ? val : parseFloat(val) || 0;
}

// ─── Product variants ─────────────────────────────────────────────────────────

export async function getProductVariants(slug: string): Promise<{
  attributes: ApiVariantAttribute[];
  variants: ApiProductVariant[];
}> {
  const res = await apiFetch<ApiResponse<{ attributes: ApiVariantAttribute[]; variants: ApiProductVariant[] }>>(
    `/api/products/${slug}/variants`
  );
  if (res && "data" in res) return res.data;
  return { attributes: [], variants: [] };
}

// ─── Authentication ───────────────────────────────────────────────────────────

type GoogleCallbackResponse =
  | { success: true;  token: string; user: import("@/context/AuthContext").AuthUser; isNewUser: false; message?: string }
  | { success: false; isNewUser: true;  name: string | null; email: string | null; message?: string }
  | { success: false; isNewUser: false; message: string };

export async function googleCallback(
  idToken: string,
  extra?: { mobile: string; password: string; password_confirmation: string }
): Promise<GoogleCallbackResponse> {
  const res = await apiFetch<{
    success: boolean;
    message?: string;
    access_token?: string;
    data?: import("@/context/AuthContext").AuthUser & { new_user?: boolean; name?: string; email?: string };
  }>("/api/auth/google/callback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, ...extra }),
  });

  if (!res) return { success: false, isNewUser: false, message: "Request failed" };

  // Existing user logged in
  if (res.success && res.access_token && res.data) {
    return { success: true, token: res.access_token, user: res.data, isNewUser: false, message: res.message };
  }

  // New user — backend needs mobile + password
  if (!res.success && (res.data as { new_user?: boolean } | undefined)?.new_user) {
    return {
      success: false,
      isNewUser: true,
      name:  (res.data as { name?: string } | undefined)?.name ?? null,
      email: (res.data as { email?: string } | undefined)?.email ?? null,
      message: res.message,
    };
  }

  return { success: false, isNewUser: false, message: res.message ?? "Google sign-in failed" };
}

export async function registerUser(data: {
  name: string;
  email: string;
  mobile: string;
  password: string;
  password_confirmation: string;
  country_code?: string;
}): Promise<{ success: boolean; token?: string; user?: import("@/context/AuthContext").AuthUser; message?: string }> {
  const res = await apiFetch<{
    success: boolean;
    message?: string;
    access_token?: string;
    data?: { user: import("@/context/AuthContext").AuthUser };
  }>("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country_code: "+91", ...data }),
  });
  if (!res) return { success: false, message: "Request failed" };
  return { success: res.success, message: res.message, token: res.access_token, user: res.data?.user };
}

export async function verifyMobile(
  mobile: string,
  otp: string
): Promise<{ success: boolean; message?: string }> {
  const res = await apiFetch<{ success?: boolean; status?: boolean; message?: string }>(
    "/api/verify-mobile",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp, country_code: "+91" }),
    }
  );
  if (!res) return { success: false, message: "Request failed" };
  return { success: !!(res.success ?? res.status), message: res.message };
}

export async function loginWithPassword(
  identifier: string,
  password: string
): Promise<{ success: boolean; token?: string; user?: import("@/context/AuthContext").AuthUser; message?: string }> {
  // Backend accepts either `email` or `mobile` + `password`
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());
  const body = isEmail
    ? { email: identifier.trim(), password }
    : { mobile: identifier.trim(), password };

  const res = await apiFetch<{
    success: boolean;
    message?: string;
    access_token?: string;
    data?: import("@/context/AuthContext").AuthUser;
  }>("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res) return { success: false, message: "Request failed" };
  return { success: res.success, message: res.message, token: res.access_token, user: res.data };
}

export async function sendOtp(mobile: string): Promise<{ success: boolean; message?: string; demoOtp?: string }> {
  const res = await apiFetch<{ success: boolean; message?: string; data?: { demo_otp?: string } }>(
    "/api/auth/otp/send",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, country_code: "+91" }),
    }
  );
  if (!res) return { success: false, message: "Request failed" };
  return { success: res.success, message: res.message, demoOtp: res.data?.demo_otp };
}

export async function verifyOtp(
  mobile: string,
  otp: string,
  extra?: { name?: string; email?: string }
): Promise<{ success: boolean; token?: string; user?: import("@/context/AuthContext").AuthUser; message?: string }> {
  const res = await apiFetch<{
    success: boolean;
    message?: string;
    data?: {
      access_token: string;
      user: import("@/context/AuthContext").AuthUser;
    };
  }>("/api/auth/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, country_code: "+91", otp, ...extra }),
  });
  if (!res) return { success: false, message: "Verification failed" };
  return {
    success: res.success,
    message: res.message,
    token: res.data?.access_token,
    user: res.data?.user,
  };
}

export async function resendOtp(mobile: string): Promise<{ success: boolean; message?: string; demoOtp?: string }> {
  const res = await apiFetch<{ success: boolean; message?: string; data?: { demo_otp?: string } }>(
    "/api/auth/otp/resend",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, country_code: "+91" }),
    }
  );
  if (!res) return { success: false, message: "Request failed" };
  return { success: res.success, message: res.message, demoOtp: res.data?.demo_otp };
}

export async function getProfile(): Promise<import("@/context/AuthContext").AuthUser | null> {
  const res = await apiAuth<ApiResponse<import("@/context/AuthContext").AuthUser>>("/api/auth/profile");
  if (res && "data" in res) return res.data;
  return null;
}

export async function updateProfile(
  data: Partial<{ name: string; email: string }>
): Promise<{ success: boolean; message?: string }> {
  const res = await apiAuth<{ success: boolean; message?: string }>(
    "/api/auth/profile",
    "PUT",
    data
  );
  return res ?? { success: false };
}

// ─── Addresses ────────────────────────────────────────────────────────────────

export async function getAddresses(): Promise<ApiAddress[]> {
  const res = await apiAuth<ApiResponse<ApiAddress[]> | ApiAddress[]>("/api/addresses");
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if ("data" in res && Array.isArray(res.data)) return res.data;
  return [];
}

export async function createAddress(
  data: Omit<ApiAddress, "id" | "is_default">
): Promise<ApiAddress | null> {
  const res = await apiAuth<ApiResponse<ApiAddress>>("/api/addresses", "POST", data);
  if (res && "data" in res) return res.data;
  return null;
}

export async function updateAddress(
  id: number,
  data: Partial<Omit<ApiAddress, "id">>
): Promise<ApiAddress | null> {
  const res = await apiAuth<ApiResponse<ApiAddress>>(`/api/addresses/${id}`, "PUT", data);
  if (res && "data" in res) return res.data;
  return null;
}

export async function deleteAddress(id: number): Promise<boolean> {
  const res = await apiAuth<{ success: boolean }>(`/api/addresses/${id}`, "DELETE");
  return res?.success ?? false;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getOrders(): Promise<ApiOrder[]> {
  const res = await apiAuth<ApiResponse<ApiOrder[]> | PaginatedResponse<ApiOrder>>("/api/orders");
  if (!res) return [];
  if ("data" in res && Array.isArray(res.data)) return res.data;
  return [];
}

export async function getOrder(id: number | string): Promise<ApiOrder | null> {
  const res = await apiAuth<ApiResponse<ApiOrder>>(`/api/orders/${id}`);
  if (res && "data" in res) return res.data;
  return null;
}

export async function trackOrder(
  orderNumber: string,
  phone: string
): Promise<ApiOrder | null> {
  const res = await apiFetch<ApiResponse<ApiOrder>>("/api/orders/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_number: orderNumber, phone }),
  });
  if (res && "data" in res) return res.data;
  return null;
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function applyCoupon(
  code: string,
  cartTotal: number
): Promise<ApiCouponResult> {
  const res = await apiFetch<ApiCouponResult>("/api/coupons/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, cart_total: cartTotal }),
  });
  return res ?? { valid: false, code, discount_type: "fixed", discount_value: 0, discount_amount: 0, message: "Invalid coupon" };
}

// ─── Shipping ─────────────────────────────────────────────────────────────────

export async function getShippingRates(
  pincode: string,
  cartTotal: number
): Promise<ApiShippingRate[]> {
  const res = await apiFetch<ApiResponse<ApiShippingRate[]> | ApiShippingRate[]>(
    "/api/shipping/rates",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pincode, cart_total: cartTotal }),
    }
  );
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if ("data" in res && Array.isArray(res.data)) return res.data;
  return [];
}

// ─── Checkout & Payment ───────────────────────────────────────────────────────

export async function createRazorpayOrder(
  amount: number
): Promise<ApiRazorpayOrder | null> {
  const res = await apiAuth<ApiResponse<ApiRazorpayOrder>>(
    "/api/payments/razorpay/create",
    "POST",
    { amount }
  );
  if (res && "data" in res) return res.data;
  return null;
}

export async function verifyRazorpayPayment(data: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}): Promise<{ success: boolean; message?: string }> {
  const res = await apiAuth<{ success: boolean; message?: string }>(
    "/api/payments/razorpay/verify",
    "POST",
    data
  );
  return res ?? { success: false };
}

export async function createCheckout(
  payload: ApiCheckoutPayload
): Promise<{ success: boolean; order_id?: number; order_number?: string; message?: string }> {
  const res = await apiAuth<{
    success: boolean;
    order_id?: number;
    order_number?: string;
    message?: string;
  }>("/api/checkout", "POST", payload);
  return res ?? { success: false, message: "Checkout failed" };
}

// ─── Wishlist (server-side sync) ──────────────────────────────────────────────

export async function syncWishlist(
  productIds: number[]
): Promise<{ success: boolean }> {
  const res = await apiAuth<{ success: boolean }>(
    "/api/wishlist/sync",
    "POST",
    { product_ids: productIds }
  );
  return res ?? { success: false };
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

export interface ApiHeroSlide {
  id: number;
  image: string;
  eyebrow: string;
  heading: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export interface ApiHeroBadge {
  id: number;
  iconName: string;
  label: string;
}

export interface ApiHeroSection {
  slides: ApiHeroSlide[];
  badges: ApiHeroBadge[];
  settings: {
    autoplayEnabled: boolean;
    autoplayDelay: number;
  };
}

/** Fetches hero section data with ISR caching (revalidates via "hero-section" cache tag). */
export async function getHeroSection(): Promise<ApiHeroSection | null> {
  try {
    const res = await fetch(`${API_BASE}/api/hero-section`, {
      headers: { Accept: "application/json" },
      next: { tags: ["hero-section"] },
    });
    if (!res.ok) return null;
    return res.json() as Promise<ApiHeroSection>;
  } catch {
    return null;
  }
}

// ─── Products by category ─────────────────────────────────────────────────────

export async function getProductsByCategory(categorySlug: string): Promise<ApiProduct[]> {
  const res = await apiFetch<ApiResponse<ApiProduct[]> | ApiProduct[] | PaginatedResponse<ApiProduct>>(
    `/api/products?category=${encodeURIComponent(categorySlug)}`,
    { next: { revalidate: 3600 } } as RequestInit
  );
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if ("data" in res && Array.isArray(res.data)) return res.data;
  return [];
}

export async function getCategory(slug: string): Promise<ApiCategory | null> {
  const res = await apiFetch<ApiResponse<ApiCategory> | ApiCategory>(
    `/api/categories/${slug}`
  );
  if (!res) return null;
  if ("data" in res && typeof res.data === "object") return res.data as ApiCategory;
  if ("id" in (res as object)) return res as ApiCategory;
  return null;
}
