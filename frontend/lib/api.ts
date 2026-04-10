// ─── API base ────────────────────────────────────────────────────────────────
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const LS_TOKEN_KEY = "auth_token";

// ─── API Types ────────────────────────────────────────────────────────────────

export interface ApiCategory {
  id: number;
  name: string;   // mapped from title for backwards compat
  title: string;
  slug: string;
  description?: string;
  image?: string;
  banner?: string;
  icon?: string;
  active_icon?: string;
  background_color?: string;
  background_type?: string;
  background_image?: string;
  font_color?: string;
  parent_id?: number | null;
  parent_slug?: string | null;
  subcategory_count?: number;
  product_count?: number;
  status?: string;
  is_indexable?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_card?: string | null;
  twitter_image?: string | null;
  schema_mode?: "auto" | "custom" | null;
  schema_json_ld?: string | null;
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

export interface ApiAddressMutationResult {
  success: boolean;
  address?: ApiAddress;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiOrder {
  id: number;
  slug: string;
  order_number: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  final_total: number;
  subtotal: number;
  shipping_charge: number;
  delivery_charge: number;
  discount?: number;
  gst_amount?: number;
  promo_discount?: number;
  gift_card_discount?: number;
  currency_code?: string;
  payment_method?: string;
  payment_status?: string;
  created_at: string;
  updated_at: string;
  items: ApiOrderItem[];
  address?: ApiAddress;
  tracking?: ApiTrackingStep[];
}

export interface ApiOrderItem {
  id: number;
  product_id: number;
  // product_name is mapped from title or product.name
  product_name: string;
  product_slug: string;
  variant_label?: string;
  quantity: number;
  price: number;
  subtotal?: number;
  status?: string;
  image?: string | null;
  product?: { id: number; name: string; slug: string; image?: string | null };
  variant?: { id: number; title: string; slug: string; image?: string | null };
  store?: { id: number; name: string; slug: string };
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
  delivery_charge?: number;   // actual charge from selected shipping rate
  coupon_code?: string;
  payment_method: "razorpay" | "easepay" | "cod";
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  items: { product_id: number; variant_id?: number; quantity: number }[];
}

// Backend field names (mapped from ApiCheckoutPayload)
interface OrderApiPayload {
  address_id: number;
  payment_type: string;         // "razorpayPayment" | "cod"
  promo_code?: string;
  transaction_id?: string;      // razorpay_payment_id
  razorpay_order_id?: string;
  razorpay_signature?: string;
  delivery_charge?: number;
  shipping_rate_id?: number;
}

export interface ApiRazorpayOrder {
  razorpay_order_id: string;
  amount: number;           // in paise
  currency: string;
  key: string;              // Razorpay public key
}

export interface ApiEasepayOrder {
  txnid: string;
  access_key: string;
  payment_url: string;
}

export interface ApiPaymentSettings {
  razorpayEnabled: boolean;
  easepayEnabled: boolean;
  codEnabled: boolean;
}

export interface ApiSystemSettings {
  appName: string;
  logo: string | null;
  favicon: string | null;
  // Product grid display toggles
  showVariantColorsInGrid: boolean;
  showGstInGrid:           boolean;
  showCategoryNameInGrid:  boolean;
  showMinQtyInGrid:        boolean;
}

export interface ApiWebSettings {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LS_TOKEN_KEY);
}

function normalizeMediaUrl(src?: string | null): string | null {
  if (!src) return null;
  const trimmed = String(src).trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const incoming = new URL(trimmed);
      const apiBase = new URL(API_BASE);

      // If backend returns localhost/127.0.0.1 URLs, rewrite them to the configured API origin.
      if (["127.0.0.1", "localhost"].includes(incoming.hostname)) {
        return `${apiBase.origin}${incoming.pathname}${incoming.search}${incoming.hash}`;
      }
    } catch {
      // If URL parsing fails, fall through to original value.
    }
    return trimmed;
  }

  const base = API_BASE.replace(/\/+$/, "");
  if (trimmed.startsWith("/")) return `${base}${trimmed}`;
  if (trimmed.startsWith("storage/") || trimmed.startsWith("uploads/")) return `${base}/${trimmed}`;
  return `${base}/storage/${trimmed}`;
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

// ─── Real API Product types (actual response shape from the backend) ──────────

export interface RealApiStorePricing {
  store_id: number;
  store_name: string;
  store_slug: string;
  store_state_name?: string;
  store_state_code?: string;
  sku: string;
  price: number;
  special_price: number;
  cost: string;
  stock: number;
  stock_status: "in_stock" | "out_of_stock";
  gst: {
    taxable_amount: number;
    gst_rate: number;
    gst_type: "intra" | "inter" | string;
    cgst_rate: number;
    cgst_amount: number;
    sgst_rate: number;
    sgst_amount: number;
    igst_rate: number;
    igst_amount: number;
    total_tax_amount: number;
    total_amount: number;
  };
}

export interface RealApiVariant {
  id: number;
  title: string;
  slug: string;
  image: string;
  barcode: string;
  is_default: boolean;
  availability: boolean;
  weight: number | null;
  weight_unit: string;
  height?: number | null;
  height_unit?: string;
  breadth: number | null;
  breadth_unit: string;
  length: number | null;
  length_unit: string;
  capacity?: number | null;
  capacity_unit?: string;
  attributes: Record<string, string>;
  store_pricing: RealApiStorePricing[];
  metadata?: {
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
    twitter_title?: string | null;
    twitter_description?: string | null;
    twitter_card?: string | null;
    twitter_image?: string | null;
    schema_mode?: "auto" | "custom" | null;
    schema_json_ld?: string | null;
  } | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_card?: string | null;
  twitter_image?: string | null;
  schema_mode?: "auto" | "custom" | null;
  schema_json_ld?: string | null;
  is_indexable?: boolean;
}

export interface RealApiProduct {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  type: "simple" | "variant";
  status: string;
  featured: string;        // "1" | "0"
  description: string;
  short_description: string;
  tags: string[];
  images: {
    main_image: string;
    additional_images: string[];
    variant_images: string[];
    all: string[];
  };
  features: {
    made_in?: string;
    warranty_period?: string;
    guarantee_period?: string;
    metadata?: {
      seo_title?: string | null;
      seo_description?: string | null;
      seo_keywords?: string | null;
      og_title?: string | null;
      og_description?: string | null;
      og_image?: string | null;
      twitter_title?: string | null;
      twitter_description?: string | null;
      twitter_card?: string | null;
      twitter_image?: string | null;
      schema_mode?: "auto" | "custom" | null;
      schema_json_ld?: string | null;
    } | null;
    is_indexable?: boolean;
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
    twitter_title?: string | null;
    twitter_description?: string | null;
    twitter_card?: string | null;
    twitter_image?: string | null;
    schema_mode?: "auto" | "custom" | null;
    schema_json_ld?: string | null;
  };
  policies: {
    minimum_order_quantity: number;
    quantity_step_size?: number;
    is_returnable: boolean;
    is_cancelable: boolean;
    requires_otp?: boolean;
  };
  tax: {
    gst_rate: string;
    hsn_code: string;
    is_inclusive_tax: boolean;
    tax_groups?: string[];
    customer_state_code?: string;
  };
  video?: {
    video_link?: string;
  };
  currency?: {
    symbol: string;
    code: string;
  };
  category_id?: number | null;
  category?: { id: number; title: string; slug: string } | null;
  variants: RealApiVariant[];
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function getProducts(params?: Record<string, string>): Promise<RealApiProduct[]> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  try {
    const res = await fetch(`${API_BASE}/api/products${query}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: ["products"] },
    } as RequestInit);
    if (!res.ok) return [];
    const json = await res.json();
    if ("data" in json) {
      const d = json.data;
      if (Array.isArray(d)) return d;
      if (d && "data" in d && Array.isArray(d.data)) return d.data;
    }
    return [];
  } catch {
    return [];
  }
}

export async function getFeaturedProducts(): Promise<RealApiProduct[]> {
  try {
    // Use fetch directly so Next.js ISR cache + tags work on the server.
    // In the browser the `next` option is ignored and data is fetched fresh.
    const res = await fetch(`${API_BASE}/api/products/featured`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: ["featured-products"] },
    } as RequestInit);
    if (!res.ok) return [];
    const json = await res.json();
    if ("data" in json && Array.isArray(json.data)) return json.data;
    return [];
  } catch {
    return [];
  }
}

export async function getNewArrivals(days = 30, limit = 40): Promise<RealApiProduct[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/products/new-arrivals?days=${days}&limit=${limit}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60, tags: ["new-arrivals"] },
      } as RequestInit
    );
    if (!res.ok) return [];
    const json = await res.json();
    if ("data" in json && Array.isArray(json.data)) return json.data;
    return [];
  } catch {
    return [];
  }
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

export async function getProduct(slug: string, customerStateCode?: string): Promise<RealApiProduct | null> {
  const params = customerStateCode ? `?customer_state_code=${encodeURIComponent(customerStateCode)}` : "";
  const res = await apiFetch<{ success: boolean; data: RealApiProduct }>(
    `/api/products/${slug}${params}`
  );
  if (!res) return null;
  if ("data" in res && res.data && "id" in (res.data as object)) return res.data;
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

function normaliseCats(raw: unknown[]): ApiCategory[] {
  return raw.map((c: unknown) => {
    const cat = c as Record<string, unknown>;
    const title = (cat.title ?? cat.name ?? "") as string;
    return { ...cat, title, name: title } as ApiCategory;
  });
}

function extractCatArray(json: unknown): ApiCategory[] {
  if (Array.isArray(json)) return normaliseCats(json);
  const j = json as Record<string, unknown>;
  // paginated: { data: { data: [...] } }
  if (j.data && typeof j.data === "object" && !Array.isArray(j.data)) {
    const inner = (j.data as Record<string, unknown>).data;
    if (Array.isArray(inner)) return normaliseCats(inner);
  }
  if (Array.isArray(j.data)) return normaliseCats(j.data as unknown[]);
  return [];
}

export async function getCategories(params?: Record<string, string>): Promise<ApiCategory[]> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  try {
    const res = await fetch(`${API_BASE}/api/categories${query}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300, tags: ["categories"] },
    } as RequestInit);
    if (!res.ok) return [];
    return extractCatArray(await res.json());
  } catch {
    return [];
  }
}

export async function getSubCategories(): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/api/categories/sub-categories`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300, tags: ["categories"] },
    } as RequestInit);
    if (!res.ok) return [];
    return extractCatArray(await res.json());
  } catch {
    return [];
  }
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
  const normalize = (addr: Record<string, unknown>): ApiAddress => ({
    id: Number(addr.id),
    name: String(addr.name ?? ""),
    phone: String(addr.phone ?? addr.mobile ?? ""),
    address_line1: String(addr.address_line1 ?? ""),
    address_line2: (addr.address_line2 as string | undefined) ?? "",
    city: String(addr.city ?? ""),
    state: String(addr.state ?? ""),
    pincode: String(addr.pincode ?? addr.zipcode ?? ""),
    is_default: Boolean(addr.is_default),
  });

  if (Array.isArray(res)) {
    return res.map((a) => normalize(a as unknown as Record<string, unknown>));
  }

  if ("data" in res) {
    // Shape A: { data: [...] }
    if (Array.isArray(res.data)) {
      return res.data.map((a) => normalize(a as unknown as Record<string, unknown>));
    }

    // Shape B (paginated): { data: { data: [...], current_page, ... } }
    if (
      res.data &&
      typeof res.data === "object" &&
      "data" in (res.data as Record<string, unknown>) &&
      Array.isArray((res.data as Record<string, unknown>).data)
    ) {
      const nested = (res.data as { data: unknown[] }).data;
      return nested.map((a) => normalize(a as Record<string, unknown>));
    }
  }

  return [];
}

export async function createAddress(
  data: Omit<ApiAddress, "id" | "is_default">
): Promise<ApiAddress | null> {
  const result = await createAddressDetailed(data);
  return result.success ? result.address ?? null : null;
}

export async function createAddressDetailed(
  data: Omit<ApiAddress, "id" | "is_default">
): Promise<ApiAddressMutationResult> {
  const token = getToken();

  // Backend expects mobile/zipcode/country/country_code.
  const payload = {
    name: data.name,
    address_line1: data.address_line1,
    address_line2: data.address_line2,
    city: data.city,
    state: data.state,
    zipcode: data.pincode,
    mobile: data.phone,
    country: "India",
    country_code: "IN",
    address_type: "home",
  };

  try {
    const res = await fetch(`${API_BASE}/api/addresses`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    const json = (await res.json().catch(() => null)) as
      | { success?: boolean; message?: string; data?: Record<string, unknown> | Record<string, string[]> }
      | null;

    if (res.ok && json?.data && !Array.isArray(json.data)) {
      const raw = json.data as Record<string, unknown>;
      return {
        success: true,
        address: {
          id: Number(raw.id),
          name: String(raw.name ?? ""),
          phone: String(raw.phone ?? raw.mobile ?? ""),
          address_line1: String(raw.address_line1 ?? ""),
          address_line2: (raw.address_line2 as string | undefined) ?? "",
          city: String(raw.city ?? ""),
          state: String(raw.state ?? ""),
          pincode: String(raw.pincode ?? raw.zipcode ?? ""),
          is_default: Boolean(raw.is_default),
        },
        message: json.message,
      };
    }

    return {
      success: false,
      message: json?.message ?? "Failed to save address.",
      errors:
        json?.data && !Array.isArray(json.data)
          ? (json.data as Record<string, string[]>)
          : undefined,
    };
  } catch {
    return { success: false, message: "Request failed. Please try again." };
  }
}

export async function updateAddress(
  id: number,
  data: Partial<Omit<ApiAddress, "id">>
): Promise<ApiAddress | null> {
  const payload = {
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(data.address_line1 !== undefined ? { address_line1: data.address_line1 } : {}),
    ...(data.address_line2 !== undefined ? { address_line2: data.address_line2 } : {}),
    ...(data.city !== undefined ? { city: data.city } : {}),
    ...(data.state !== undefined ? { state: data.state } : {}),
    ...(data.pincode !== undefined ? { zipcode: data.pincode } : {}),
    ...(data.phone !== undefined ? { mobile: data.phone } : {}),
    ...(data.is_default !== undefined ? { is_default: data.is_default } : {}),
    country: "India",
    country_code: "IN",
  };
  const res = await apiAuth<ApiResponse<Record<string, unknown>>>(`/api/addresses/${id}`, "PUT", payload);
  if (res && "data" in res && res.data) {
    const raw = res.data;
    return {
      id: Number(raw.id),
      name: String(raw.name ?? ""),
      phone: String(raw.phone ?? raw.mobile ?? ""),
      address_line1: String(raw.address_line1 ?? ""),
      address_line2: (raw.address_line2 as string | undefined) ?? "",
      city: String(raw.city ?? ""),
      state: String(raw.state ?? ""),
      pincode: String(raw.pincode ?? raw.zipcode ?? ""),
      is_default: Boolean(raw.is_default),
    };
  }
  return null;
}

export async function deleteAddress(id: number): Promise<boolean> {
  const res = await apiAuth<{ success: boolean }>(`/api/addresses/${id}`, "DELETE");
  return res?.success ?? false;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

function normalizeOrder(raw: Record<string, unknown>): ApiOrder {
  const items = ((raw.items ?? []) as Record<string, unknown>[]).map((item) => ({
    ...(item as object),
    product_name:
      (item.title as string) ??
      ((item.product as Record<string, unknown>)?.name as string) ??
      "Unknown",
    product_slug:
      ((item.product as Record<string, unknown>)?.slug as string) ?? "",
    variant_label:
      (item.variant_title as string) ??
      ((item.variant as Record<string, unknown>)?.title as string) ??
      undefined,
    image:
      normalizeMediaUrl(
        (item.image as string) ??
        ((item.variant as Record<string, unknown>)?.image as string) ??
        ((item.product as Record<string, unknown>)?.image as string) ??
        null
      ),
  })) as ApiOrderItem[];

  return {
    ...(raw as object),
    order_number: (raw.slug as string) ?? String(raw.id),
    total: parseFloat(String(raw.final_total ?? raw.total_payable ?? 0)),
    shipping_charge: parseFloat(String(raw.delivery_charge ?? 0)),
    items,
  } as ApiOrder;
}

export async function getOrder(id: number | string): Promise<ApiOrder | null> {
  const res = await apiAuth<{ success: boolean; data: Record<string, unknown> | unknown[]; message?: string }>(
    `/api/user/orders/${id}`
  );

  if (!res?.success) return null;
  if (!res.data || Array.isArray(res.data) || typeof res.data !== "object") return null;

  return normalizeOrder(res.data as Record<string, unknown>);
}

export async function getOrders(): Promise<ApiOrder[]> {
  const res = await apiAuth<{ success: boolean; data: { data: Record<string, unknown>[] } }>(
    "/api/user/orders"
  );
  if (!res?.success) return [];
  const rows = res?.data?.data;
  if (!Array.isArray(rows)) return [];
  return rows.map(normalizeOrder);
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
  cartTotal: number,
  weightGrams?: number
): Promise<ApiShippingRate[]> {
  const body: Record<string, unknown> = { pincode, cart_total: cartTotal };
  if (weightGrams != null && weightGrams > 0) body.weight = String(weightGrams);
  const res = await apiFetch<ApiResponse<Record<string, unknown>> | ApiShippingRate[]>(
    "/api/shipping/rates",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res) return [];

  // Legacy: data is already a flat array of ApiShippingRate
  if (Array.isArray(res)) return res;

  // Current API shape: { success, data: { rates: [...], delivery_time, ... } }
  if ("data" in res && res.data && typeof res.data === "object" && !Array.isArray(res.data)) {
    const data = res.data as Record<string, unknown>;
    const deliveryTime = String(data.delivery_time ?? "");
    const rates = Array.isArray(data.rates) ? data.rates : [];
    return rates.map((r: Record<string, unknown>) => ({
      id: Number(r.delivery_partner_id ?? 0),
      label: String(r.delivery_partner ?? ""),
      charge: Number(r.total ?? 0),
      estimated_days: deliveryTime,
      is_free: Number(r.total ?? 0) === 0,
    }));
  }

  // Fallback: data is already a flat array
  if ("data" in res && Array.isArray(res.data)) return res.data as ApiShippingRate[];

  return [];
}

// ─── Checkout & Payment ───────────────────────────────────────────────────────

export async function createRazorpayOrder(
  amount: number
): Promise<ApiRazorpayOrder | null> {
  const res = await apiAuth<ApiResponse<ApiRazorpayOrder>>(
    "/api/razorpay/create-order",
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
  console.log("[verifyRazorpayPayment] sending:", data);
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE}/api/razorpay/verify-payment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
      body: JSON.stringify(data),
    });
    const body = await res.json();
    console.log("[verifyRazorpayPayment] HTTP", res.status, body);
    if (!res.ok) return { success: false, message: (body as { message?: string })?.message ?? `HTTP ${res.status}` };
    return body as { success: boolean; message?: string };
  } catch (err) {
    console.error("[verifyRazorpayPayment] fetch error:", err);
    return { success: false, message: "Network error during verification." };
  }
}

export async function createEasepayOrder(
  orderId: number,
  amount: number
): Promise<ApiEasepayOrder | null> {
  const res = await apiAuth<ApiResponse<ApiEasepayOrder>>(
    "/api/easepay/create-order",
    "POST",
    { order_id: orderId, amount }
  );
  if (res && "data" in res) return res.data;
  return null;
}

export async function getPaymentSettings(): Promise<ApiPaymentSettings> {
  const fallback: ApiPaymentSettings = {
    razorpayEnabled: true,
    easepayEnabled: false,
    codEnabled: true,
  };

  try {
    const res = await apiFetch<{
      success?: boolean;
      data?: Record<string, unknown>;
    }>("/api/settings/payment");

    if (!res || !res.success || !res.data) return fallback;

    // Response: { data: { variable: "payment", value: { razorpayPayment: true, ... } } }
    const data = res.data as Record<string, unknown>;
    const value = (data.value ?? data) as Record<string, unknown>;

    return {
      razorpayEnabled: Boolean(value.razorpayPayment),
      easepayEnabled: Boolean(value.easepayPayment),
      codEnabled: Boolean(value.cod),
    };
  } catch {
    return fallback;
  }
}

export async function getSystemSettings(): Promise<ApiSystemSettings | null> {
  // Use fetch directly (not apiFetch) so Next.js ISR caching works server-side.
  const res = await fetch(`${API_BASE}/api/settings/system`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600, tags: ["site-settings"] },
  } as RequestInit).then((r) => r.json()).catch(() => null) as {
    success?: boolean;
    data?: { value?: Record<string, unknown> } | Record<string, unknown>;
  } | null;

  if (!res || !res.success || !res.data) return null;

  const setting = ("value" in res.data ? res.data.value : res.data) as Record<string, unknown> | undefined;
  if (!setting) return null;

  const appName = typeof setting.appName === "string" ? setting.appName.trim() : "";
  const logoRaw = typeof setting.logo === "string" ? setting.logo.trim() : "";
  const faviconRaw = typeof setting.favicon === "string" ? setting.favicon.trim() : "";

  return {
    appName: appName || "Pethiyan",
    logo: normalizeMediaUrl(logoRaw),
    favicon: normalizeMediaUrl(faviconRaw),
    showVariantColorsInGrid: setting.showVariantColorsInGrid !== false,
    showGstInGrid:           setting.showGstInGrid           === true,
    showCategoryNameInGrid:  setting.showCategoryNameInGrid  !== false,
    showMinQtyInGrid:        setting.showMinQtyInGrid        === true,
  };
}

export async function getWebSettings(): Promise<ApiWebSettings | null> {
  const res = await fetch(`${API_BASE}/api/settings/web`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600, tags: ["web-settings"] },
  } as RequestInit).then((r) => r.json()).catch(() => null) as {
    success?: boolean;
    data?: { value?: Record<string, unknown> } | Record<string, unknown>;
  } | null;

  if (!res || !res.success || !res.data) return null;

  const s = ("value" in res.data ? res.data.value : res.data) as Record<string, unknown> | undefined;
  if (!s) return null;

  const str = (key: string) => (typeof s[key] === "string" ? (s[key] as string).trim() : "");

  return {
    googleAnalyticsId:   str("googleAnalyticsId"),
    googleTagManagerId:  str("googleTagManagerId"),
    facebookPixelId:     str("facebookPixelId"),
    metaTitle:           str("metaTitle"),
    metaDescription:     str("metaDescription"),
    metaKeywords:        str("metaKeywords"),
    googleSiteVerification: str("googleSiteVerification"),
    bingSiteVerification:   str("bingSiteVerification"),
  };
}

// ─── SEO Advanced Settings ────────────────────────────────────────────────────

export interface ApiSeoAdvancedSettings {
  robotsDisallowRules: string[];
  sitemapCustomUrls: Array<{ url: string; priority: string; changeFreq: string }>;
  sitemapExcludeUrls: string[];
}

export async function getSeoAdvancedSettings(): Promise<ApiSeoAdvancedSettings | null> {
  const res = await fetch(`${API_BASE}/api/settings/seo-advanced`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600, tags: ["seo-advanced-settings"] },
  } as RequestInit).then((r) => r.json()).catch(() => null) as {
    success?: boolean;
    data?: Record<string, unknown>;
  } | null;

  if (!res?.success || !res.data) return null;

  const d = res.data as Record<string, unknown>;
  return {
    robotsDisallowRules: Array.isArray(d.robotsDisallowRules) ? (d.robotsDisallowRules as string[]).filter(Boolean) : [],
    sitemapCustomUrls:   Array.isArray(d.sitemapCustomUrls)   ? (d.sitemapCustomUrls as ApiSeoAdvancedSettings["sitemapCustomUrls"]) : [],
    sitemapExcludeUrls:  Array.isArray(d.sitemapExcludeUrls)  ? (d.sitemapExcludeUrls as string[]).filter(Boolean) : [],
  };
}

// ─── Server Cart API ──────────────────────────────────────────────────────────

export async function serverCartAdd(
  variantId: number,
  storeId: number,
  quantity: number
): Promise<number | null> {
  const token = getToken();
  console.log("[serverCartAdd] token present:", !!token, "variantId:", variantId, "storeId:", storeId, "qty:", quantity);
  if (!token) { console.warn("[serverCartAdd] no token, skipping"); return null; }
  try {
    const res = await fetch(`${API_BASE}/api/user/cart/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify({ product_variant_id: variantId, store_id: storeId, quantity }),
    });
    const body = await res.json();
    console.log("[serverCartAdd] HTTP", res.status, JSON.stringify(body));
    if (!res.ok) return null;
    const typed = body as { success?: boolean; data?: { items?: { id: number; product_variant_id: number; store_id: number }[] } };
    if (!typed.success || !typed.data?.items) {
      console.warn("[serverCartAdd] unexpected body shape:", body);
      return null;
    }
    const item = typed.data.items.find(
      (i) => i.product_variant_id === variantId && i.store_id === storeId
    );
    console.log("[serverCartAdd] matched item:", item);
    return item?.id ?? null;
  } catch (err) {
    console.error("[serverCartAdd] fetch error:", err);
    return null;
  }
}

export async function serverCartUpdateQty(
  cartItemId: number,
  quantity: number
): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/api/user/cart/item/${cartItemId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify({ quantity }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function serverCartRemove(cartItemId: number): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/api/user/cart/item/${cartItemId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function serverCartClear(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/api/user/cart/clear-cart`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncCartToServer(
  items: { variantId: number; storeId: number; quantity: number }[]
): Promise<{ success: boolean; message?: string }> {
  console.log("[syncCartToServer] items:", items);
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE}/api/user/cart/sync`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
      body: JSON.stringify({
        items: items.map((i) => ({
          product_variant_id: i.variantId,
          store_id:           i.storeId,
          quantity:           i.quantity,
        })),
      }),
    });
    const body = await res.json() as { success?: boolean; message?: string };
    console.log("[syncCartToServer] HTTP", res.status, body);
    return { success: !!body.success, message: body.message };
  } catch (err) {
    console.error("[syncCartToServer] error:", err);
    return { success: false, message: "Cart sync failed." };
  }
}

export async function createCheckout(
  payload: ApiCheckoutPayload
): Promise<{ success: boolean; order_id?: number; order_number?: string; message?: string }> {
  // Map frontend field names → backend field names
  const mapped: OrderApiPayload = {
    address_id:          payload.address_id,
    payment_type:
      payload.payment_method === "razorpay"
        ? "razorpayPayment"
        : payload.payment_method === "easepay"
          ? "easepayPayment"
          : "cod",
    ...(payload.coupon_code          ? { promo_code: payload.coupon_code }                : {}),
    ...(payload.razorpay_payment_id  ? { transaction_id: payload.razorpay_payment_id }    : {}),
    ...(payload.razorpay_order_id    ? { razorpay_order_id: payload.razorpay_order_id }   : {}),
    ...(payload.razorpay_signature   ? { razorpay_signature: payload.razorpay_signature } : {}),
    ...(payload.delivery_charge !== undefined ? { delivery_charge: payload.delivery_charge } : {}),
    ...(payload.shipping_rate_id     ? { shipping_rate_id: payload.shipping_rate_id }     : {}),
  };

  console.group("[createCheckout]");
  console.log("original payload:", payload);
  console.log("mapped to backend:", mapped);

  const token = getToken();
  console.log("auth token present:", !!token);

  let httpStatus = 0;
  let rawBody: unknown = null;
  try {
    const res = await fetch(`${API_BASE}/api/user/orders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
      body: JSON.stringify(mapped),
    });
    httpStatus = res.status;
    rawBody = await res.json();
    console.log("HTTP status:", httpStatus);
    console.log("raw response:", rawBody);
    console.groupEnd();

    if (!res.ok) {
      const msg = (rawBody as { message?: string })?.message ?? `HTTP ${httpStatus}`;
      return { success: false, message: msg };
    }

    const data = rawBody as { success?: boolean; message?: string; data?: { id?: number; order_number?: string } };
    if (data.success && data.data) {
      return {
        success: true,
        order_id:     data.data.id,
        order_number: data.data.order_number,
        message:      data.message,
      };
    }
    return { success: false, message: data.message ?? "Order placement failed." };
  } catch (err) {
    console.error("createCheckout fetch error:", err);
    console.groupEnd();
    return { success: false, message: "Network error. Please try again." };
  }
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

export interface AddToWishlistPayload {
  product_id: number;
  store_id: number;
  product_variant_id?: number | null;
  wishlist_title?: string;
}

export async function addToWishlist(
  payload: AddToWishlistPayload
): Promise<{ success: boolean; message: string }> {
  const token = getToken();
  if (!token) {
    return { success: false, message: "Please login to add wishlist items." };
  }

  try {
    const res = await fetch(`${API_BASE}/api/user/wishlists`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    const body = (await res.json()) as { success?: boolean; message?: string };
    return {
      success: !!body.success,
      message: body.message ?? (res.ok ? "Wishlist updated." : "Failed to update wishlist."),
    };
  } catch {
    return { success: false, message: "Network error while updating wishlist." };
  }
}

export async function getWishlistSummary(): Promise<{ total_wishlists: number; total_items: number } | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/api/user/wishlists/summary`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const body = (await res.json()) as {
      success?: boolean;
      data?: { total_wishlists?: number; total_items?: number };
    };
    if (!res.ok || !body.success || !body.data) return null;
    return {
      total_wishlists: Number(body.data.total_wishlists ?? 0),
      total_items: Number(body.data.total_items ?? 0),
    };
  } catch {
    return null;
  }
}

export interface ApiWishlistItemRecord {
  id: number;
  wishlist_id: number;
  product: {
    id: number;
    title: string;
    slug: string;
    image?: string | null;
  } | null;
  variant?: {
    id: number;
    price?: number | null;
    special_price?: number | null;
  } | null;
}

export async function getWishlistItems(): Promise<ApiWishlistItemRecord[]> {
  const token = getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE}/api/user/wishlists`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const body = (await res.json()) as {
      success?: boolean;
      data?: { data?: Array<{ items?: ApiWishlistItemRecord[] }> } | Array<{ items?: ApiWishlistItemRecord[] }>;
    };
    if (!res.ok || !body.success || !body.data) return [];

    const wishlistRows = Array.isArray(body.data) ? body.data : (body.data.data ?? []);
    return wishlistRows.flatMap((w) => w.items ?? []);
  } catch {
    return [];
  }
}

export async function removeWishlistItem(itemId: number): Promise<{ success: boolean; message: string }> {
  const token = getToken();
  if (!token) return { success: false, message: "Please login first." };

  try {
    const res = await fetch(`${API_BASE}/api/user/wishlists/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const body = (await res.json()) as { success?: boolean; message?: string };
    return {
      success: !!body.success,
      message: body.message ?? (res.ok ? "Removed from wishlist." : "Failed to remove item."),
    };
  } catch {
    return { success: false, message: "Network error while deleting wishlist item." };
  }
}

export async function clearAllWishlistItems(): Promise<{ success: boolean; message: string }> {
  const token = getToken();
  if (!token) return { success: false, message: "Please login first." };

  try {
    const res = await fetch(`${API_BASE}/api/user/wishlists/items`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const body = (await res.json()) as { success?: boolean; message?: string };
    return {
      success: !!body.success,
      message: body.message ?? (res.ok ? "Wishlist cleared." : "Failed to clear wishlist."),
    };
  } catch {
    return { success: false, message: "Network error while clearing wishlist." };
  }
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
    heroHeight: number;
  };
}

/** Fetches hero section data with tag-based cache (invalidated on admin updates). */
export async function getHeroSection(): Promise<ApiHeroSection | null> {
  try {
    const res = await fetch(`${API_BASE}/api/hero-section`, {
      headers: { Accept: "application/json" },
      next: { tags: ["hero-section"], revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<ApiHeroSection>;
  } catch {
    return null;
  }
}

export interface ApiVideoStoryItem {
  id: number;
  title: string;
  videoUrl: string;
}

export interface ApiVideoStorySection {
  videos: ApiVideoStoryItem[];
  settings: {
    isActive: boolean;
    eyebrow: string;
    heading: string;
    subheading: string;
    autoplayEnabled: boolean;
    autoplayDelay: number;
    transitionDuration: number;
    animationStyle: "slide" | "fade" | "none";
  };
}

export async function getVideoStorySection(): Promise<ApiVideoStorySection | null> {
  try {
    const res = await fetch(`${API_BASE}/api/video-story-section`, {
      headers: { Accept: "application/json" },
      next: { tags: ["video-story-section"], revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<ApiVideoStorySection>;
  } catch {
    return null;
  }
}

export interface ApiNewsletterSection {
  is_active: boolean;
  badge_text: string;
  heading: string;
  heading_highlight: string;
  subheading: string;
  perks: string[];
  form_title: string;
  form_subtitle: string;
}

export async function getNewsletterSection(): Promise<ApiNewsletterSection | null> {
  try {
    const res = await fetch(`${API_BASE}/api/newsletter-section`, {
      headers: { Accept: "application/json" },
      next: { tags: ["newsletter-section"], revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<ApiNewsletterSection>;
  } catch {
    return null;
  }
}

// ─── Products by category ─────────────────────────────────────────────────────

export async function getProductsByCategory(categorySlug: string): Promise<RealApiProduct[]> {
  // Use fetch directly (not apiFetch) so Next.js ISR cache works.
  // Fix: API expects ?categories= (plural), not ?category=
  try {
    const res = await fetch(
      `${API_BASE}/api/products?categories=${encodeURIComponent(categorySlug)}&per_page=100&include_child_categories=1`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 300, tags: ["products", `category-${categorySlug}`] },
      } as RequestInit
    );
    if (!res.ok) return [];
    const json = await res.json() as {
      data?: RealApiProduct[] | { data?: RealApiProduct[] };
    } | RealApiProduct[];
    if (Array.isArray(json)) return json;
    if ("data" in json) {
      const d = json.data;
      // Paginated wrapper: { data: { data: [...] } }
      if (d && !Array.isArray(d) && "data" in d && Array.isArray(d.data)) return d.data;
      // Flat: { data: [...] }
      if (Array.isArray(d)) return d;
    }
    return [];
  } catch {
    return [];
  }
}

export async function getCategory(slug: string): Promise<ApiCategory | null> {
  const res = await apiFetch<ApiResponse<ApiCategory> | ApiCategory>(
    `/api/categories/${slug}`
  );
  if (!res) return null;
  const raw = ("data" in res && typeof res.data === "object")
    ? res.data as ApiCategory
    : ("id" in (res as object) ? res as ApiCategory : null);
  if (!raw) return null;
  // Normalise: API returns `title`, component expects `name`
  const title = (raw as unknown as Record<string, string>).title ?? raw.name ?? "";
  return { ...raw, title, name: title };
}
