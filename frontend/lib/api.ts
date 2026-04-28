// ─── API base ────────────────────────────────────────────────────────────────
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

import toast from "react-hot-toast";

const LS_TOKEN_KEY = "auth_token";
const AUTH_SESSION_MARKER = "__http_only_session__";

function getApiErrorMessage(payload: unknown): string | undefined {
  if (!payload) return undefined;

  const record = typeof payload === "object" ? (payload as Record<string, unknown>) : null;
  if (!record) return undefined;

  // 1. Check for explicit error string
  const data = typeof record.data === "object" && record.data !== null
    ? (record.data as Record<string, unknown>)
    : null;

  if (data?.error) return String(data.error);
  if (record.error) return String(record.error);

  // 2. Check for validation errors (Laravel default or custom)
  const errors = record.errors ?? data?.errors;
  if (errors && typeof errors === "object") {
    const firstError = Object.values(errors).flat().find(Boolean);
    if (firstError) return String(firstError);
  }

  // 3. Fallback to message
  if (typeof payload === "object" && payload !== null && "message" in payload) {
    return String(payload.message);
  }
  return undefined;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface ApiCategory {
  id: number;
  sort_order?: number;
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
  sku?: string;
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

export interface ApiMutationResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
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
  company_name?: string;
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

type ApiAddressInput = Omit<ApiAddress, "id" | "is_default"> & {
  gstin?: string;
  is_default?: boolean;
};

export interface ApiOrder {
  id: number;
  uuid: string;
  slug: string;
  order_number: string;
  status: "pending" | "awaiting_store_response" | "partially_accepted" | "accepted_by_seller" | "ready_for_pickup" | "assigned" | "preparing" | "collected" | "out_for_delivery" | "processing" | "shipped" | "delivered" | "cancelled" | "failed" | "rejected_by_seller" | string;
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
  tracking_code?: string;
  admin_note?: string;
  invoice_downloadable?: boolean;
  management_history?: ApiOrderManagementHistory[];
  created_at: string;
  updated_at: string;
  items: ApiOrderItem[];
  address?: ApiAddress;
  tracking?: ApiTrackingStep[];
}

export interface ApiOrderManagementHistory {
  changed_fields: string[];
  previous_status?: string;
  new_status?: string;
  previous_payment_status?: string;
  new_payment_status?: string;
  tracking_code?: string | null;
  admin_note?: string | null;
  created_at: string;
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

export interface ApiPromoPopupProduct {
  id: number;
  title: string;
  slug: string;
  image_url: string | null;
  price: number;
}

export interface ApiPromoPopupData {
  promo: {
    id: number;
    code: string;
    description?: string | null;
    discount_type: "percent" | "flat" | "free_shipping";
    discount_amount: number;
    discount_label: string;
    start_date?: string | null;
    end_date?: string | null;
  };
  products: ApiPromoPopupProduct[];
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
  // OTP channel toggles (from /api/settings/auth-config)
  smsOtpEnabled:   boolean;
  emailOtpEnabled: boolean;
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
  metaCanonicalUrl: string;
  metaRobots: string;
  metaAuthor: string;
  metaPublisher: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  seoSchemaJson: string;
}

export interface ApiFooterLink {
  id?: number;
  label: string;
  href: string;
  target?: string;
}

export interface ApiFooterMenu {
  id: number;
  name: string;
  slug: string;
  title: string;
  links: ApiFooterLink[];
}

export interface ApiFooterSocialLink {
  platform: string;
  label: string;
  url: string;
}

export interface ApiFooterHighlightTickerItem {
  highlight: string;
  text: string;
}

export interface ApiFeaturedProductsSection {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  subheading: string;
  productCount: number;
  viewAllLink: string;
  categories: Array<{
    id: number;
    title: string;
    slug: string;
  }>;
  products: RealApiProduct[];
}

export interface ApiFooterData {
  brand: {
    appName: string;
    logo: string | null;
    footerLogo: string | null;
    copyrightText: string;
    shortDescription: string;
    companyGstin: string;
    address: string;
    supportEmail: string;
    supportNumber: string;
    socialLinks: ApiFooterSocialLink[];
  };
  menus: {
    navigation: ApiFooterMenu[];
    legal: ApiFooterMenu | null;
  };
  footerSeo: {
    enabled: boolean;
    homepageOnly: boolean;
    introHtml: string;
  };
  highlightTicker: {
    homepageOnly: boolean;
    items: ApiFooterHighlightTickerItem[];
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LS_TOKEN_KEY);
}

function getAuthHeaders(token: string | null): Record<string, string> {
  if (!token || token === AUTH_SESSION_MARKER) return {};
  return { Authorization: `Bearer ${token}` };
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
      credentials: "include",
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
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    // Always parse JSON — error responses (4xx/5xx) carry a message body we need to show
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
  discount_percent?: number | null;
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

export interface ResolvedStorePricingDisplay {
  mainPrice: number;
  comparePrice: number | null;
  discountPercent: number | null;
  hasDiscount: boolean;
}

export function selectPrimaryStorePricing<T extends Pick<RealApiStorePricing, "stock_status" | "stock">>(
  pricingList?: T[] | null
): T | undefined {
  if (!pricingList || pricingList.length === 0) return undefined;

  return pricingList.find((pricing) => pricing.stock_status === "in_stock" && pricing.stock > 0) ?? pricingList[0];
}

export function resolveStorePricingDisplay(pricing?: Partial<RealApiStorePricing> | null): ResolvedStorePricingDisplay {
  const gstIncludedPrice = toNum(pricing?.price ?? 0);
  const costPrice = toNum(pricing?.cost ?? 0);
  const specialPrice = toNum(pricing?.special_price ?? 0);
  const taxableAmount = toNum(pricing?.gst?.taxable_amount ?? 0);
  const rawDiscountPercent = pricing?.discount_percent;
  const discountPercent =
    rawDiscountPercent === null || rawDiscountPercent === undefined
      ? null
      : toNum(rawDiscountPercent);

  const mainPrice = taxableAmount > 0
    ? taxableAmount
    : specialPrice > 0
    ? specialPrice
    : costPrice > 0
      ? costPrice
      : gstIncludedPrice;

  return {
    mainPrice,
    comparePrice: discountPercent !== null && costPrice > 0 ? costPrice : null,
    discountPercent,
    hasDiscount: discountPercent !== null,
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
  sku?: string | number | null;
  options?: Array<{ value?: string } | string> | null;
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
    total_allowed_quantity?: number | null;
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
  faqs?: ApiFaq[];
  reviews?: ApiReview[];
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function getProducts(params?: Record<string, string>): Promise<RealApiProduct[]> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  try {
    const res = await fetch(`${API_BASE}/api/products${query}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
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

export interface ProductsPageResult {
  products: RealApiProduct[];
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
  total: number;
}

export async function getProductsPage(page = 1, perPage = 24): Promise<ProductsPageResult> {
  const empty: ProductsPageResult = { products: [], currentPage: page, lastPage: page, hasMore: false, total: 0 };
  try {
    const res = await fetch(
      `${API_BASE}/api/products?page=${page}&perPage=${perPage}`,
      { headers: { Accept: "application/json" }, next: { revalidate: 60 } } as RequestInit,
    );
    if (!res.ok) return empty;
    const json = await res.json();
    const d = json?.data;
    if (!d || !Array.isArray(d.data)) return empty;
    // API returns: { page, lastPage, hasNext, perPage, total, data: [...] }
    const currentPage = Number(d.page     ?? page);
    const lastPage    = Number(d.lastPage ?? page);
    return {
      products:  d.data as RealApiProduct[],
      currentPage,
      lastPage,
      hasMore:   Boolean(d.hasNext),
      total:     Number(d.total ?? 0),
    };
  } catch {
    return empty;
  }
}

export async function getFeaturedProducts(): Promise<RealApiProduct[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products/featured`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    } as RequestInit);
    if (!res.ok) return [];
    const json = await res.json();
    if ("data" in json && Array.isArray(json.data)) return json.data;
    return [];
  } catch {
    return [];
  }
}

export async function getFeaturedProductsSection(): Promise<ApiFeaturedProductsSection | null> {
  try {
    const res = await fetch(`${API_BASE}/api/settings/featured-products-section`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: ["featured-products"] },
    } as RequestInit);

    if (!res.ok) return null;

    const json = await res.json();
    const data = (json?.data ?? null) as Record<string, unknown> | null;
    if (!data) return null;

    return {
      enabled: typeof data.enabled === "boolean" ? data.enabled : Boolean(data.enabled),
      eyebrow: typeof data.eyebrow === "string" ? data.eyebrow.trim() : "",
      heading: typeof data.heading === "string" ? data.heading.trim() : "",
      subheading: typeof data.subheading === "string" ? data.subheading.trim() : "",
      productCount: typeof data.productCount === "number" ? data.productCount : Number(data.productCount ?? 0),
      viewAllLink: typeof data.viewAllLink === "string" ? data.viewAllLink.trim() : "/shop",
      categories: Array.isArray(data.categories)
        ? data.categories
            .map((entry) => {
              const item = entry as Record<string, unknown>;
              const id = Number(item.id ?? 0);
              const title = typeof item.title === "string" ? item.title.trim() : "";
              const slug = typeof item.slug === "string" ? item.slug.trim() : "";
              if (!id || !title || !slug) return null;
              return { id, title, slug };
            })
            .filter((item): item is { id: number; title: string; slug: string } => Boolean(item))
        : [],
      products: Array.isArray(data.products) ? (data.products as RealApiProduct[]) : [],
    };
  } catch {
    return null;
  }
}

export async function getNewArrivals(days = 30, limit = 40): Promise<RealApiProduct[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/products/new-arrivals?days=${days}&limit=${limit}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
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

export async function getBestSellers(limit = 40): Promise<RealApiProduct[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/products/best-sellers?limit=${limit}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
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

export async function getProductsByIds(
  ids: number[],
  customerStateCode?: string
): Promise<RealApiProduct[]> {
  const normalized = Array.from(
    new Set(
      ids
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0)
    )
  );

  if (normalized.length === 0) return [];

  const params = new URLSearchParams({
    ids: normalized.join(","),
  });

  if (customerStateCode) {
    params.set("customer_state_code", customerStateCode);
  }

  const res = await apiFetch<ApiResponse<RealApiProduct[]> | RealApiProduct[]>(
    `/api/products/by-ids?${params.toString()}`
  );
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if ("data" in res && Array.isArray(res.data)) return res.data;
  return [];
}

export async function getProductReviews(slug: string): Promise<ApiReview[]> {
  const res = await apiFetch<ApiResponse<ApiReview[]> | ApiReview[]>(
    `/api/products/${slug}/reviews`
  );
  if (!res) return [];
  if (Array.isArray(res)) return res;
  // Paginated wrapper: { data: { data: { reviews: [...] } } }
  const raw = res as unknown as Record<string, unknown>;
  const outer = raw.data as Record<string, unknown> | undefined;
  const inner = outer?.data as Record<string, unknown> | undefined;
  if (inner && Array.isArray(inner.reviews)) return inner.reviews as ApiReview[];
  // Simple array at data.data
  if (outer && Array.isArray(outer.data)) return outer.data as ApiReview[];
  if ("data" in res && Array.isArray(res.data)) return res.data;
  return [];
}

export async function getAvailableOrderItemsForProduct(slug: string): Promise<Array<{id:number, order_id:number, product_id:number}>> {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(slug)}/available-order-items`, {
      headers: { Accept: 'application/json', ...getAuthHeaders(token) },
      credentials: 'include',
    } as RequestInit);
    if (!res.ok) return [];
    const json = await res.json();
    if (json && json.success && json.data) return Array.isArray(json.data) ? json.data : [];
    return [];
  } catch {
    return [];
  }
}

export async function submitReview(formData: FormData): Promise<ApiMutationResponse | null> {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE}/api/reviews`, {
      method: 'POST',
      headers: { Accept: 'application/json', ...getAuthHeaders(token) },
      credentials: 'include',
      body: formData,
    } as RequestInit);
    return await res.json() as ApiMutationResponse;
  } catch {
    return null;
  }
}

export async function getProductFaqs(slug: string): Promise<ApiFaq[]> {
  const res = await apiFetch<ApiResponse<ApiFaq[]> | ApiFaq[]>(
    `/api/products/${slug}/faqs`
  );
  if (!res) return [];
  if (Array.isArray(res)) return res;
  // Paginated wrapper: { data: { data: [...] } }
  const raw = res as unknown as Record<string, unknown>;
  const outer = raw.data as Record<string, unknown> | undefined;
  if (outer && Array.isArray(outer.data)) return outer.data as ApiFaq[];
  if ("data" in res && Array.isArray(res.data)) return res.data;
  return [];
}

function normaliseCats(raw: unknown[]): ApiCategory[] {
  return raw.map((c: unknown) => {
    const cat = c as Record<string, unknown>;
    const title = (cat.title ?? cat.name ?? "") as string;
    const sortOrder = Number(cat.sort_order);

    return {
      ...cat,
      title,
      name: title,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : undefined,
    } as ApiCategory;
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
      next: { revalidate: 30 },
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
      next: { revalidate: 30 },
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
  if (res.success && res.data) {
    return { success: true, token: AUTH_SESSION_MARKER, user: res.data, isNewUser: false, message: res.message };
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

  return {
    success: false,
    isNewUser: false,
    message: getApiErrorMessage({ message: res.message }) ?? "Google sign-in failed",
  };
}

export async function registerUser(data: {
  name: string;
  email: string;
  mobile: string;
  password: string;
  password_confirmation: string;
  country_code?: string;
}): Promise<{
  success: boolean;
  token?: string;
  user?: import("@/context/AuthContext").AuthUser;
  message?: string;
  smsOtpSent?: boolean;
  emailOtpSent?: boolean;
}> {
  const res = await apiFetch<{
    success: boolean;
    message?: string;
    access_token?: string;
    data?: {
      user: import("@/context/AuthContext").AuthUser;
      sms_otp_sent?: boolean;
      email_otp_sent?: boolean;
    };
  }>("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country_code: "+91", ...data }),
  });
  if (!res) return { success: false, message: "Request failed" };
  return {
    success: res.success,
    message: res.message,
    token: res.success && res.data?.user ? AUTH_SESSION_MARKER : undefined,
    user: res.data?.user,
    smsOtpSent: res.data?.sms_otp_sent,
    emailOtpSent: res.data?.email_otp_sent,
  };
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
  return { success: res.success, message: res.message, token: res.success && res.data ? AUTH_SESSION_MARKER : undefined, user: res.data };
}

export async function sendOtp(
  mobile: string | null,
  email?: string | null
): Promise<{ success: boolean; message?: string; demoOtp?: string; smsOtpSent?: boolean; emailOtpSent?: boolean; emailSentTo?: string }> {
  const body: Record<string, string> = {};
  if (mobile) { body.mobile = mobile; body.country_code = "+91"; }
  if (email)  { body.email = email; }

  const res = await apiFetch<{
    success: boolean;
    message?: string;
    data?: { demo_otp?: string; sms_otp_sent?: boolean; email_otp_sent?: boolean; email_sent_to?: string };
  }>("/api/auth/otp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res) return { success: false, message: "Request failed" };
  return {
    success: res.success,
    message: res.message,
    demoOtp: res.data?.demo_otp,
    smsOtpSent: res.data?.sms_otp_sent,
    emailOtpSent: res.data?.email_otp_sent,
    emailSentTo: res.data?.email_sent_to,
  };
}

export async function verifyOtp(
  mobile: string | null,
  otp: string,
  extra?: { name?: string; email?: string }
): Promise<{ success: boolean; token?: string; user?: import("@/context/AuthContext").AuthUser; message?: string }> {
  const body: Record<string, string | undefined> = { otp, ...extra };
  if (mobile) { body.mobile = mobile; body.country_code = "+91"; }

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
    body: JSON.stringify(body),
  });
  if (!res) return { success: false, message: "Verification failed" };
  return {
    success: res.success,
    message: res.message,
    token: res.success && res.data?.user ? AUTH_SESSION_MARKER : undefined,
    user: res.data?.user,
  };
}

export async function forgotPasswordSendOtp(
  email: string | null,
  mobile?: string | null
): Promise<{ success: boolean; message?: string; demoOtp?: string }> {
  const body: Record<string, string> = {};
  if (email)  { body.email = email; }
  if (mobile) { body.mobile = mobile; }

  const res = await apiFetch<{ success: boolean; message?: string; data?: { demo_otp?: string } }>(
    "/api/auth/forgot-password/send-otp",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res) return { success: false, message: "Request failed" };
  return { success: res.success, message: res.message, demoOtp: res.data?.demo_otp };
}

export async function forgotPasswordReset(
  email: string | null,
  mobile: string | null,
  otp: string,
  password: string,
  password_confirmation: string
): Promise<{ success: boolean; message?: string }> {
  const body: Record<string, string> = { otp, password, password_confirmation };
  if (email)  { body.email = email; }
  if (mobile) { body.mobile = mobile; }

  const res = await apiFetch<{ success: boolean; message?: string }>(
    "/api/auth/forgot-password/reset",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res) return { success: false, message: "Request failed" };
  return { success: res.success, message: res.message };
}

export async function forgotPasswordResendOtp(
  email: string | null,
  mobile?: string | null
): Promise<{ success: boolean; message?: string; demoOtp?: string }> {
  return forgotPasswordSendOtp(email, mobile);
}

export async function resendOtp(
  mobile: string | null,
  email?: string | null
): Promise<{ success: boolean; message?: string; demoOtp?: string; emailSentTo?: string }> {
  const body: Record<string, string> = {};
  if (mobile) { body.mobile = mobile; body.country_code = "+91"; }
  if (email)  { body.email = email; }

  const res = await apiFetch<{ success: boolean; message?: string; data?: { demo_otp?: string; email_sent_to?: string } }>(
    "/api/auth/otp/resend",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res) return { success: false, message: "Request failed" };
  return { success: res.success, message: res.message, demoOtp: res.data?.demo_otp, emailSentTo: res.data?.email_sent_to };
}

export async function getProfile(): Promise<import("@/context/AuthContext").AuthUser | null> {
  const res = await apiAuth<ApiResponse<import("@/context/AuthContext").AuthUser>>("/api/user/profile");
  if (res && "data" in res) return res.data;
  return null;
}

export async function updateProfile(
  data: Partial<{ name: string; email: string; company_name: string; gstin: string }>
): Promise<{ success: boolean; message?: string }> {
  const res = await apiAuth<{ success: boolean; message?: string }>(
    "/api/user/profile",
    "POST",
    data
  );
  if (!res) return { success: false, message: "Request failed" };
  return {
    success: res.success ?? false,
    message: getApiErrorMessage(res) ?? res.message,
  };
}

export async function changePassword(data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<{ success: boolean; message?: string }> {
  const res = await apiAuth<{ success?: boolean; message?: string; errors?: Record<string, string[]> }>(
    "/api/user/password-update",
    "POST",
    data
  );
  if (!res) return { success: false, message: "Request failed" };
  return {
    success: res.success ?? false,
    message: getApiErrorMessage(res) ?? res.message,
  };
}

export async function logoutUserSession(): Promise<void> {
  await apiFetch("/api/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}

// ─── Addresses ────────────────────────────────────────────────────────────────

export async function getAddresses(): Promise<ApiAddress[]> {
  const res = await apiAuth<ApiResponse<ApiAddress[]> | ApiAddress[]>("/api/addresses");
  if (!res) return [];
  const normalize = (addr: Record<string, unknown>): ApiAddress => ({
    id: Number(addr.id),
    name: String(addr.name ?? ""),
    phone: String(addr.phone ?? addr.mobile ?? ""),
    company_name: String(addr.company_name ?? ""),
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
  data: ApiAddressInput
): Promise<ApiAddress | null> {
  const result = await createAddressDetailed(data);
  return result.success ? result.address ?? null : null;
}

export async function createAddressDetailed(
  data: ApiAddressInput
): Promise<ApiAddressMutationResult> {
  const token = getToken();

  // Backend expects mobile/zipcode/country/country_code.
  const payload = {
    name: data.name,
    company_name: data.company_name,
    address_line1: data.address_line1,
    address_line2: data.address_line2,
    city: data.city,
    state: data.state,
    zipcode: data.pincode,
    mobile: data.phone,
    gstin: data.gstin,
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
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
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
          company_name: String(raw.company_name ?? ""),
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
  const result = await updateAddressDetailed(id, data);
  return result.success ? result.address ?? null : null;
}

export async function updateAddressDetailed(
  id: number,
  data: Partial<ApiAddressInput>
): Promise<ApiAddressMutationResult> {
  const payload = {
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(data.company_name !== undefined ? { company_name: data.company_name } : {}),
    ...(data.address_line1 !== undefined ? { address_line1: data.address_line1 } : {}),
    ...(data.address_line2 !== undefined ? { address_line2: data.address_line2 } : {}),
    ...(data.city !== undefined ? { city: data.city } : {}),
    ...(data.state !== undefined ? { state: data.state } : {}),
    ...(data.pincode !== undefined ? { zipcode: data.pincode } : {}),
    ...(data.phone !== undefined ? { mobile: data.phone } : {}),
    ...(data.gstin !== undefined ? { gstin: data.gstin } : {}),
    ...(data.is_default !== undefined ? { is_default: data.is_default } : {}),
    address_type: "home",
    country: "India",
    country_code: "IN",
  };

  try {
    const res = await fetch(`${API_BASE}/api/addresses/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...getAuthHeaders(getToken()),
      },
      cache: "no-store",
      credentials: "include",
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
          company_name: String(raw.company_name ?? ""),
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
      message: json?.message ?? "Failed to update address.",
      errors:
        json?.data && !Array.isArray(json.data)
          ? (json.data as Record<string, string[]>)
          : undefined,
    };
  } catch {
    return { success: false, message: "Request failed. Please try again." };
  }
}

export async function deleteAddress(id: number): Promise<boolean> {
  const res = await apiAuth<{ success: boolean }>(`/api/addresses/${id}`, "DELETE");
  return res?.success ?? false;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

function normalizeOrder(raw: Record<string, unknown>): ApiOrder {
  const pickFirstMediaField = (...values: unknown[]): string | null => {
    for (const value of values) {
      if (typeof value === "string" && value.trim()) {
        return normalizeMediaUrl(value);
      }
    }
    return null;
  };

  const items = ((raw.items ?? []) as Record<string, unknown>[]).map((item) => {
    const product = (item.product as Record<string, unknown> | undefined) ?? {};
    const variant = (item.variant as Record<string, unknown> | undefined) ?? {};

    return {
      ...(item as object),
      price: parseFloat(String(item.price ?? item.unit_price ?? 0)),
      subtotal: parseFloat(String(item.subtotal ?? item.total ?? 0)),
      product_name:
        (item.title as string) ??
        (product.name as string) ??
        "Unknown",
      product_slug:
        (product.slug as string) ?? "",
      variant_label:
        (item.variant_title as string) ??
        (variant.title as string) ??
        undefined,
      image: pickFirstMediaField(
        item.image,
        item.image_url,
        item.thumbnail,
        item.thumbnail_url,
        variant.image,
        variant.image_url,
        variant.thumbnail,
        variant.thumbnail_url,
        product.image,
        product.image_url,
        product.thumbnail,
        product.thumbnail_url,
        product.main_image
      ),
    };
  }) as ApiOrderItem[];

  return {
    ...(raw as object),
    uuid: (raw.uuid as string) ?? (raw.slug as string) ?? String(raw.id),
    order_number: (raw.order_number as string) ?? (raw.slug as string) ?? String(raw.id),
    total: parseFloat(String(raw.final_total ?? raw.total_payable ?? 0)),
    final_total: parseFloat(String(raw.final_total ?? raw.total_payable ?? 0)),
    subtotal: parseFloat(String(raw.subtotal ?? 0)),
    shipping_charge: parseFloat(String(raw.shipping_charge ?? raw.delivery_charge ?? 0)),
    delivery_charge: parseFloat(String(raw.delivery_charge ?? raw.shipping_charge ?? 0)),
    discount: parseFloat(String(raw.discount ?? raw.promo_discount ?? 0)),
    gst_amount: parseFloat(String(raw.gst_amount ?? raw.total_gst ?? 0)),
    promo_discount: parseFloat(String(raw.promo_discount ?? 0)),
    gift_card_discount: parseFloat(String(raw.gift_card_discount ?? 0)),
    invoice_downloadable: raw.invoice_downloadable === true,
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

export async function trackOrder(query: string): Promise<ApiOrder | null> {
  const res = await apiFetch<{ success: boolean; data: Record<string, unknown> }>(
    "/api/orders/track",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }
  );
  if (!res?.success || !res.data || typeof res.data !== "object" || Array.isArray(res.data)) return null;
  return normalizeOrder(res.data as Record<string, unknown>);
}

export async function downloadOrderInvoice(slug: string): Promise<Blob | null> {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE}/api/user/orders/${encodeURIComponent(slug)}/invoice`, {
      headers: { Accept: "application/pdf", ...getAuthHeaders(token) },
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.blob();
  } catch {
    return null;
  }
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function applyCoupon(
  code: string,
  cartTotal: number
): Promise<ApiCouponResult> {
  const INVALID: ApiCouponResult = { valid: false, code, discount_type: "fixed", discount_value: 0, discount_amount: 0, message: "Invalid coupon" };
  type ValidateRaw = {
    success: boolean;
    message: string;
    data: {
      promo_code: string;
      discount: number;
      promo_details: { discount_type: string; discount_amount: string | number } | null;
    };
  };
  const params = new URLSearchParams({ promo_code: code, cart_amount: String(cartTotal) });
  const raw = await apiAuth<ValidateRaw>(`/api/user/promos/validate?${params}`);
  if (!raw) return { ...INVALID, message: "Could not reach server" };
  if (!raw.success) return { ...INVALID, message: raw.message };

  // Map backend discount_type to frontend union
  const typeMap: Record<string, ApiCouponResult["discount_type"]> = {
    percent: "percentage",
    flat: "fixed",
    free_shipping: "free_shipping",
  };
  const discountType = typeMap[raw.data?.promo_details?.discount_type ?? ""] ?? "fixed";
  const discountValue = Number(raw.data?.promo_details?.discount_amount ?? 0);

  return {
    valid: true,
    code,
    discount_type: discountType,
    discount_value: discountValue,
    discount_amount: raw.data?.discount ?? 0,
    message: raw.message,
  };
}

export async function getPromoPopup(): Promise<ApiPromoPopupData | null> {
  const res = await apiFetch<ApiResponse<ApiPromoPopupData | null>>("/api/promos/popup");
  if (!res?.status || !res.data || Array.isArray(res.data) || typeof res.data !== "object") {
    return null;
  }

  const popup = res.data as ApiPromoPopupData;

  return {
    ...popup,
    products: Array.isArray(popup.products)
      ? popup.products.map((product) => ({
          ...product,
          image_url: normalizeMediaUrl(product.image_url),
        }))
      : [],
  };
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
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
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
  const [sysRes, authRes] = await Promise.all([
    fetch(`${API_BASE}/api/settings/system`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    } as RequestInit).then((r) => r.json()).catch(() => null) as Promise<{
      success?: boolean;
      data?: { value?: Record<string, unknown> } | Record<string, unknown>;
    } | null>,
    fetch(`${API_BASE}/api/settings/auth-config`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    } as RequestInit).then((r) => r.json()).catch(() => null) as Promise<{
      success?: boolean;
      data?: Record<string, unknown>;
    } | null>,
  ]);

  if (!sysRes || !sysRes.success || !sysRes.data) return null;

  const setting = ("value" in sysRes.data ? sysRes.data.value : sysRes.data) as Record<string, unknown> | undefined;
  if (!setting) return null;

  const appName = typeof setting.appName === "string" ? setting.appName.trim() : "";
  const logoRaw = typeof setting.logo === "string" ? setting.logo.trim() : "";
  const faviconRaw = typeof setting.favicon === "string" ? setting.favicon.trim() : "";

  const authData = (authRes?.success && authRes.data) ? authRes.data : {};

  return {
    appName: appName || "Pethiyan",
    logo: normalizeMediaUrl(logoRaw),
    favicon: normalizeMediaUrl(faviconRaw),
    smsOtpEnabled:   authData.sms_otp_enabled   === true,
    emailOtpEnabled: authData.email_otp_enabled  === true,
    showVariantColorsInGrid: setting.showVariantColorsInGrid !== false,
    showGstInGrid:           setting.showGstInGrid           === true,
    showCategoryNameInGrid:  setting.showCategoryNameInGrid  !== false,
    showMinQtyInGrid:        setting.showMinQtyInGrid        === true,
  };
}

export async function getWebSettings(): Promise<ApiWebSettings | null> {
  const res = await fetch(`${API_BASE}/api/settings/web`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  } as RequestInit).then((r) => r.json()).catch(() => null) as {
    success?: boolean;
    data?: { value?: Record<string, unknown> } | Record<string, unknown>;
  } | null;

  if (!res || !res.success || !res.data) return null;

  const s = ("value" in res.data ? res.data.value : res.data) as Record<string, unknown> | undefined;
  if (!s) return null;

  const str = (key: string) => (typeof s[key] === "string" ? (s[key] as string).trim() : "");

  return {
    googleAnalyticsId:      str("googleAnalyticsId"),
    googleTagManagerId:     str("googleTagManagerId"),
    facebookPixelId:        str("facebookPixelId"),
    metaTitle:              str("metaTitle"),
    metaDescription:        str("metaDescription"),
    metaKeywords:           str("metaKeywords"),
    metaCanonicalUrl:       str("metaCanonicalUrl"),
    metaRobots:             str("metaRobots") || "index,follow",
    metaAuthor:             str("metaAuthor"),
    metaPublisher:          str("metaPublisher"),
    googleSiteVerification: str("googleSiteVerification"),
    bingSiteVerification:   str("bingSiteVerification"),
    ogTitle:                str("ogTitle"),
    ogDescription:          str("ogDescription"),
    ogImage:                str("ogImage"),
    twitterCard:            str("twitterCard") || "summary_large_image",
    twitterSite:            str("twitterSite"),
    twitterCreator:         str("twitterCreator"),
    twitterTitle:           str("twitterTitle"),
    twitterDescription:     str("twitterDescription"),
    twitterImage:           str("twitterImage"),
    seoSchemaJson:          str("seoSchemaJson"),
  };
}

export async function getFooterData(): Promise<ApiFooterData | null> {
  const res = await fetch(`${API_BASE}/api/settings/footer`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  } as RequestInit).then((r) => r.json()).catch(() => null) as {
    success?: boolean;
    data?: Record<string, unknown>;
  } | null;

  if (!res?.success || !res.data) return null;

  const data = res.data as Record<string, unknown>;
  const brand = (data.brand ?? {}) as Record<string, unknown>;
  const menus = (data.menus ?? {}) as Record<string, unknown>;
  const footerSeo = (data.footerSeo ?? {}) as Record<string, unknown>;
  const highlightTicker = (data.highlightTicker ?? {}) as Record<string, unknown>;

  const boolValue = (value: unknown, fallback: boolean) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["1", "true", "yes", "on"].includes(normalized)) return true;
      if (["0", "false", "no", "off", ""].includes(normalized)) return false;
    }
    return value == null ? fallback : Boolean(value);
  };

  const mapLinks = (value: unknown): ApiFooterLink[] =>
    Array.isArray(value)
      ? value
          .map((entry) => {
            const item = entry as Record<string, unknown>;
            const label = typeof item.label === "string" ? item.label.trim() : "";
            const href = typeof item.href === "string" ? item.href.trim() : "";

            if (!label || !href) return null;

            return {
              id: typeof item.id === "number" ? item.id : undefined,
              label,
              href,
              target: typeof item.target === "string" ? item.target : undefined,
            } satisfies ApiFooterLink;
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
      : [];

  const mapMenu = (value: unknown): ApiFooterMenu | null => {
    if (!value || typeof value !== "object") return null;

    const item = value as Record<string, unknown>;
    const title = typeof item.title === "string" ? item.title.trim() : "";
    const name = typeof item.name === "string" ? item.name.trim() : title;
    const slug = typeof item.slug === "string" ? item.slug.trim() : "";

    if (!name || !slug) return null;

    return {
      id: typeof item.id === "number" ? item.id : 0,
      name,
      slug,
      title: title || name,
      links: mapLinks(item.links),
    };
  };

  return {
    brand: {
      appName: typeof brand.appName === "string" && brand.appName.trim() ? brand.appName.trim() : "Pethiyan",
      logo: normalizeMediaUrl(typeof brand.logo === "string" ? brand.logo : null),
      footerLogo: normalizeMediaUrl(typeof brand.footerLogo === "string" ? brand.footerLogo : null),
      copyrightText: typeof brand.copyrightText === "string" ? brand.copyrightText.trim() : "",
      shortDescription: typeof brand.shortDescription === "string" ? brand.shortDescription.trim() : "",
      companyGstin: typeof brand.companyGstin === "string" ? brand.companyGstin.trim() : "",
      address: typeof brand.address === "string" ? brand.address.trim() : "",
      supportEmail: typeof brand.supportEmail === "string" ? brand.supportEmail.trim() : "",
      supportNumber: typeof brand.supportNumber === "string" ? brand.supportNumber.trim() : "",
      socialLinks: Array.isArray(brand.socialLinks)
        ? brand.socialLinks
            .map((entry) => {
              const item = entry as Record<string, unknown>;
              const url = typeof item.url === "string" ? item.url.trim() : "";
              if (!url) return null;

              return {
                platform: typeof item.platform === "string" ? item.platform : "",
                label: typeof item.label === "string" && item.label.trim() ? item.label.trim() : "Social",
                url,
              } satisfies ApiFooterSocialLink;
            })
            .filter((item): item is ApiFooterSocialLink => Boolean(item))
        : [],
    },
    menus: {
      navigation: Array.isArray(menus.navigation)
        ? menus.navigation
            .map((entry) => mapMenu(entry))
            .filter((item): item is ApiFooterMenu => Boolean(item))
        : [],
      legal: mapMenu(menus.legal),
    },
    footerSeo: {
      enabled: boolValue(footerSeo.enabled, true),
      homepageOnly: boolValue(footerSeo.homepageOnly, false),
      introHtml: typeof footerSeo.introHtml === "string" ? footerSeo.introHtml.trim() : "",
    },
    highlightTicker: {
      homepageOnly: boolValue(highlightTicker.homepageOnly, true),
      items: Array.isArray(highlightTicker.items)
        ? highlightTicker.items
            .map((entry) => {
              const item = entry as Record<string, unknown>;
              const highlight = typeof item.highlight === "string" ? item.highlight.trim() : "";
              const text = typeof item.text === "string" ? item.text.trim() : "";

              if (!highlight && !text) return null;

              return { highlight, text } satisfies ApiFooterHighlightTickerItem;
            })
            .filter((item): item is ApiFooterHighlightTickerItem => Boolean(item))
        : [],
    },
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
    next: { revalidate: 600 },
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
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
      body: JSON.stringify({ product_variant_id: variantId, store_id: storeId, quantity }),
    });
    const body = await res.json();
    console.log("[serverCartAdd] HTTP", res.status, JSON.stringify(body));
    if (!res.ok) {
      const msg = (body && (body.message || body.error || (body.errors && Object.values(body.errors).flat()[0]))) || "Failed to add item to cart";
      try { toast.error(msg); } catch { /* ignore */ }
      return null;
    }
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
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
      // try to show server message
      try {
        const body = await res.json().catch(() => null);
        const msg = body && (body.message || body.error || (body.errors && Object.values(body.errors).flat()[0])) || "Failed to update cart item";
        try { toast.error(msg); } catch { /* ignore */ }
      } catch {
        /* ignore */
      }
      return false;
    }
    return true;
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
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
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
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncCartToServer(
  items: { variantId: number; storeId: number; quantity: number }[]
): Promise<{ success: boolean; message?: string; failedVariantIds?: number[] }> {
  console.log("[syncCartToServer] items:", items);
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE}/api/user/cart/sync`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
      body: JSON.stringify({
        items: items.map((i) => ({
          product_variant_id: i.variantId,
          store_id:           i.storeId,
          quantity:           i.quantity,
        })),
      }),
    });
    const body = await res.json() as {
      success?: boolean;
      message?: string;
      data?: {
        synced_items?: unknown[];
        failed_items?: { product_variant_id?: number }[];
      };
    };
    console.log("[syncCartToServer] HTTP", res.status, body);

    const syncedCount = body.data?.synced_items?.length ?? 0;
    const failedItems = body.data?.failed_items ?? [];
    const failedVariantIds = failedItems
      .map((f) => f.product_variant_id)
      .filter((id): id is number => typeof id === "number");

    // If the API reports success but nothing was actually synced, treat as failure
    if (body.success && syncedCount === 0 && failedItems.length > 0) {
      return {
        success: false,
        message: "Some items in your cart are not available. Please remove them and try again.",
        failedVariantIds,
      };
    }

    return { success: !!body.success, message: body.message, failedVariantIds };
  } catch (err) {
    console.error("[syncCartToServer] error:", err);
    return { success: false, message: "Cart sync failed." };
  }
}

export async function createCheckout(
  payload: ApiCheckoutPayload
): Promise<{ success: boolean; order_id?: number; order_number?: string; order_slug?: string; message?: string }> {
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
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
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

    const data = rawBody as { success?: boolean; message?: string; data?: { id?: number; order_number?: string; slug?: string; order_slug?: string } };
    if (data.success && data.data) {
      return {
        success: true,
        order_id:     data.data.id,
        order_number: data.data.order_number,
        order_slug:   data.data.slug ?? data.data.order_slug ?? '',
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
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
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
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
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
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
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
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
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
        ...getAuthHeaders(token),
      },
      cache: "no-store",
      credentials: "include",
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

// ─── Announcement Bar ─────────────────────────────────────────────────────────

export interface ApiAnnouncementBar {
  topBar: { active: boolean; text: string };
  ticker: { active: boolean; items: string[] };
}

export async function getAnnouncementBar(): Promise<ApiAnnouncementBar | null> {
  try {
    const res = await fetch(`${API_BASE}/api/announcement-bar`, {
      headers: { Accept: "application/json" },
      next: { tags: ["announcement-bar"] },
    });
    if (!res.ok) return null;
    return res.json() as Promise<ApiAnnouncementBar>;
  } catch {
    return null;
  }
}

/** Fetches hero section data with tag-based cache (invalidated on admin updates). */
export async function getHeroSection(): Promise<ApiHeroSection | null> {
  try {
    const res = await fetch(`${API_BASE}/api/hero-section`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
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
    placement: HomeSectionPlacement;
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
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as Record<string, unknown>;
    const settings = (json.settings ?? null) as Record<string, unknown> | null;

    return {
      videos: Array.isArray(json.videos)
        ? json.videos
            .map((entry) => {
              const item = entry as Record<string, unknown>;
              const id = Number(item.id ?? 0);
              const title = typeof item.title === "string" ? item.title.trim() : "";
              const videoUrl = typeof item.videoUrl === "string" ? item.videoUrl.trim() : "";

              if (!id || !title || !videoUrl) return null;

              return { id, title, videoUrl } satisfies ApiVideoStoryItem;
            })
            .filter((item): item is ApiVideoStoryItem => Boolean(item))
        : [],
      settings: {
        isActive: typeof settings?.isActive === "boolean" ? settings.isActive : Boolean(settings?.isActive),
        eyebrow: typeof settings?.eyebrow === "string" ? settings.eyebrow.trim() : "",
        heading: typeof settings?.heading === "string" ? settings.heading.trim() : "",
        subheading: typeof settings?.subheading === "string" ? settings.subheading.trim() : "",
        placement: normalizeHomeSectionPlacement(settings?.placement, "after_recently_viewed"),
        autoplayEnabled: typeof settings?.autoplayEnabled === "boolean" ? settings.autoplayEnabled : Boolean(settings?.autoplayEnabled),
        autoplayDelay: Math.max(1500, Number(settings?.autoplayDelay ?? 4500) || 4500),
        transitionDuration: Math.max(0, Number(settings?.transitionDuration ?? 420) || 420),
        animationStyle:
          settings?.animationStyle === "fade" || settings?.animationStyle === "none" ? settings.animationStyle : "slide",
      },
    };
  } catch {
    return null;
  }
}

// ─── Header Menu ─────────────────────────────────────────────────────────────

export interface ApiMenuNavLink {
  id: number;
  label: string;
  href: string;
  target: string;
}

export interface ApiMenuShopDropdownItem {
  id: number;
  label: string;
  href: string;
  target: string;
  icon: string | null;
  description: string | null;
  accent_color: string | null;
  badge: string | null;
}

export interface ApiMenuMegaProduct {
  image: string;
  name: string;
  price: number;
  currency_symbol: string;
  currency_code: string;
  slug: string;
  product_url: string;
}

export interface ApiMenuMegaMenuPanel {
  id: number;
  label: string;
  href: string;
  accent_color: string;
  image_path: string;
  tagline: string;
  sort_order: number;
  columns: { id: number; heading: string; links: ApiMenuNavLink[] }[];
  featured_products: ApiMenuMegaProduct[];
  top_products: ApiMenuMegaProduct[];
}

export interface ApiMenuItem {
  id: number;
  label: string;
  href: string;
  type: "link" | "shop_dropdown" | "mega_menu";
  target: string;
  icon: string | null;
  description: string | null;
  accent_color: string | null;
  badge: string | null;
  sort_order: number;
  shop_dropdown_items?: ApiMenuShopDropdownItem[];
  mega_menu_panels?: ApiMenuMegaMenuPanel[];
  featured_products?: ApiMenuMegaProduct[];
  top_products?: ApiMenuMegaProduct[];
}

export interface ApiHeaderMenu {
  id: number;
  name: string;
  slug: string;
  nav_items: ApiMenuItem[];
}

export async function getHeaderMenu(): Promise<ApiHeaderMenu | null> {
  try {
    const res = await fetch(`${API_BASE}/api/menus/header_main`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data as ApiHeaderMenu) ?? null;
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
  placement: HomeSectionPlacement;
}

export const HOME_SECTION_PLACEMENTS = [
  "after_hero",
  "after_categories",
  "after_featured_products",
  "after_your_items",
  "after_recently_viewed",
  "after_video_stories",
  "after_why_choose_us",
  "after_promo_banner",
  "after_social_proof",
  "after_newsletter",
] as const;

export type HomeSectionPlacement = (typeof HOME_SECTION_PLACEMENTS)[number];

function normalizeHomeSectionPlacement(value: unknown, fallback: HomeSectionPlacement): HomeSectionPlacement {
  return typeof value === "string" && HOME_SECTION_PLACEMENTS.includes(value as HomeSectionPlacement)
    ? (value as HomeSectionPlacement)
    : fallback;
}

export interface ApiWhyChooseUsSection {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  subheading: string;
  placement: HomeSectionPlacement;
  features: string[];
}

export interface ApiPromoBannerSection {
  enabled: boolean;
  badgeText: string;
  heading: string;
  subheading: string;
  placement: HomeSectionPlacement;
  offerPrimary: string;
  offerSecondary: string;
  buttonLabel: string;
  buttonLink: string;
}

export interface ApiSocialProofTestimonial {
  id: number;
  name: string;
  title: string;
  quote: string;
  stars: number;
  imageUrl: string | null;
}

export interface ApiSocialProofSection {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  subheading: string;
  placement: HomeSectionPlacement;
  testimonials: ApiSocialProofTestimonial[];
}

export async function getNewsletterSection(): Promise<ApiNewsletterSection | null> {
  try {
    const res = await fetch(`${API_BASE}/api/newsletter-section`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300, tags: ["newsletter-section"] },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as Record<string, unknown>;

    return {
      is_active: typeof json.is_active === "boolean" ? json.is_active : Boolean(json.is_active),
      badge_text: typeof json.badge_text === "string" ? json.badge_text.trim() : "",
      heading: typeof json.heading === "string" ? json.heading.trim() : "",
      heading_highlight: typeof json.heading_highlight === "string" ? json.heading_highlight.trim() : "",
      subheading: typeof json.subheading === "string" ? json.subheading.trim() : "",
      perks: Array.isArray(json.perks)
        ? json.perks.map((item) => (typeof item === "string" ? item.trim() : "")).filter((item) => item.length > 0)
        : [],
      form_title: typeof json.form_title === "string" ? json.form_title.trim() : "",
      form_subtitle: typeof json.form_subtitle === "string" ? json.form_subtitle.trim() : "",
      placement: normalizeHomeSectionPlacement(json.placement, "after_social_proof"),
    };
  } catch {
    return null;
  }
}

export async function getWhyChooseUsSection(): Promise<ApiWhyChooseUsSection | null> {
  try {
    const res = await fetch(`${API_BASE}/api/settings/why-choose-us-section`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300, tags: ["why-choose-us"] },
    } as RequestInit);

    if (!res.ok) return null;

    const json = await res.json();
    const data = (json?.data ?? null) as Record<string, unknown> | null;
    if (!data) return null;

    return {
      enabled: typeof data.enabled === "boolean" ? data.enabled : Boolean(data.enabled),
      eyebrow: typeof data.eyebrow === "string" ? data.eyebrow.trim() : "",
      heading: typeof data.heading === "string" ? data.heading.trim() : "",
      subheading: typeof data.subheading === "string" ? data.subheading.trim() : "",
      placement: normalizeHomeSectionPlacement(data.placement, "after_video_stories"),
      features: Array.isArray(data.features)
        ? data.features
            .map((item) => (typeof item === "string" ? item.trim() : ""))
            .filter((item) => item.length > 0)
        : [],
    };
  } catch {
    return null;
  }
}

export async function getPromoBannerSection(): Promise<ApiPromoBannerSection | null> {
  try {
    const res = await fetch(`${API_BASE}/api/settings/promo-banner-section`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300, tags: ["promo-banner"] },
    } as RequestInit);

    if (!res.ok) return null;

    const json = await res.json();
    const data = (json?.data ?? null) as Record<string, unknown> | null;
    if (!data) return null;

    return {
      enabled: typeof data.enabled === "boolean" ? data.enabled : Boolean(data.enabled),
      badgeText: typeof data.badgeText === "string" ? data.badgeText.trim() : "",
      heading: typeof data.heading === "string" ? data.heading.trim() : "",
      subheading: typeof data.subheading === "string" ? data.subheading.trim() : "",
      placement: normalizeHomeSectionPlacement(data.placement, "after_why_choose_us"),
      offerPrimary: typeof data.offerPrimary === "string" ? data.offerPrimary.trim() : "",
      offerSecondary: typeof data.offerSecondary === "string" ? data.offerSecondary.trim() : "",
      buttonLabel: typeof data.buttonLabel === "string" ? data.buttonLabel.trim() : "",
      buttonLink: typeof data.buttonLink === "string" ? data.buttonLink.trim() : "/shop",
    };
  } catch {
    return null;
  }
}

export async function getSocialProofSection(): Promise<ApiSocialProofSection | null> {
  try {
    const res = await fetch(`${API_BASE}/api/settings/social-proof-section`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300, tags: ["social-proof"] },
    } as RequestInit);

    if (!res.ok) return null;

    const json = await res.json();
    const data = (json?.data ?? null) as Record<string, unknown> | null;
    if (!data) return null;

    return {
      enabled: typeof data.enabled === "boolean" ? data.enabled : Boolean(data.enabled),
      eyebrow: typeof data.eyebrow === "string" ? data.eyebrow.trim() : "",
      heading: typeof data.heading === "string" ? data.heading.trim() : "",
      subheading: typeof data.subheading === "string" ? data.subheading.trim() : "",
      placement: normalizeHomeSectionPlacement(data.placement, "after_promo_banner"),
      testimonials: Array.isArray(data.testimonials)
        ? data.testimonials
            .map((entry) => {
              const item = entry as Record<string, unknown>;
              const id = Number(item.id ?? 0);
              const name = typeof item.name === "string" ? item.name.trim() : "";
              const quote = typeof item.quote === "string" ? item.quote.trim() : "";

              if (!id || !name || !quote) return null;

              return {
                id,
                name,
                title: typeof item.title === "string" ? item.title.trim() : "",
                quote,
                stars: Math.max(1, Math.min(5, Number(item.stars ?? 5) || 5)),
                imageUrl: normalizeMediaUrl(typeof item.imageUrl === "string" ? item.imageUrl : null),
              } satisfies ApiSocialProofTestimonial;
            })
            .filter((item): item is ApiSocialProofTestimonial => Boolean(item))
        : [],
    };
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
        next: { revalidate: 60 },
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

// ─── Search ───────────────────────────────────────────────────────────────────

export interface UnifiedSearchResults {
  query: string;
  products: RealApiProduct[];
  categories: ApiCategory[];
  blogs: ApiBlogSearchResult[];
  total: number;
}

export interface ApiBlogSearchResult {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  category: { title: string; slug: string } | null;
}

export async function unifiedSearch(
  q: string,
  type: "all" | "products" | "categories" | "blogs" = "all"
): Promise<UnifiedSearchResults> {
  const empty: UnifiedSearchResults = { query: q, products: [], categories: [], blogs: [], total: 0 };
  if (!q.trim()) return empty;
  const res = await apiFetch<UnifiedSearchResults>(
    `/api/search?q=${encodeURIComponent(q)}&type=${type}`
  );
  return res ?? empty;
}

export async function fetchTopSearches(limit = 8): Promise<string[]> {
  const res = await apiFetch<{ data: string[] }>(`/api/search/top-searches?limit=${limit}`);
  return res?.data ?? [];
}

export async function fetchTrendingProducts(limit = 4): Promise<RealApiProduct[]> {
  const res = await apiFetch<{ data: RealApiProduct[] }>(`/api/search/trending-products?limit=${limit}`);
  return res?.data ?? [];
}

/** Fire-and-forget: record a product view in the backend for logged-in users. */
export async function recordBrowsingHistory(productId: number): Promise<void> {
  const token = getToken();
  if (!token || token === AUTH_SESSION_MARKER) return;
  try {
    await fetch(`${API_BASE}/api/browsing-history`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...getAuthHeaders(token),
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ product_id: productId }),
    });
  } catch {
    // fire-and-forget
  }
}

export async function trackSearch(
  query: string,
  resultCount: number,
  entityTypes: string[] = ["products"],
  sessionId?: string
): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/search/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, result_count: resultCount, entity_types: entityTypes, session_id: sessionId }),
    });
  } catch {
    // fire-and-forget — never block the UI on tracking
  }
}

// ─── Your Items: Saved for Later (wishlist) ───────────────────────────────────

/**
 * Returns wishlist products as RealApiProduct[] for the "Saved for Later" tab.
 * Extracts slugs from wishlist items then fetches full product data.
 */
export async function getSavedForLaterProducts(): Promise<RealApiProduct[]> {
  const token = getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE}/api/user/wishlists`, {
      headers: { Accept: "application/json", ...getAuthHeaders(token) },
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) return [];
    const body = (await res.json()) as {
      success?: boolean;
      data?: { data?: Array<{ items?: Array<{ product?: { slug?: string } | null }> }> } | Array<{ items?: Array<{ product?: { slug?: string } | null }> }>;
    };
    if (!body.success || !body.data) return [];

    const wishlistRows = Array.isArray(body.data) ? body.data : (body.data.data ?? []);
    const slugs = wishlistRows
      .flatMap((w) => w.items ?? [])
      .map((item) => item.product?.slug)
      .filter((s): s is string => Boolean(s));

    if (slugs.length === 0) return [];

    const params = new URLSearchParams({ slugs: [...new Set(slugs)].join(","), per_page: "40" });
    const prodRes = await fetch(`${API_BASE}/api/products?${params}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!prodRes.ok) return [];
    const prodJson = (await prodRes.json()) as { data?: { data?: RealApiProduct[] } | RealApiProduct[] };
    const raw = (prodJson.data as { data?: RealApiProduct[] })?.data ?? (prodJson.data as RealApiProduct[]) ?? [];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

// ─── Your Items: Buy it Again (delivered orders) ──────────────────────────────

/**
 * Returns products from the user's past delivered orders as RealApiProduct[].
 * Backed by GET /api/buy-again (requires auth).
 */
export async function getBuyAgainProducts(): Promise<RealApiProduct[]> {
  const token = getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE}/api/buy-again`, {
      headers: { Accept: "application/json", ...getAuthHeaders(token) },
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { success?: boolean; data?: { data?: RealApiProduct[] } };
    if (!body.success || !body.data?.data) return [];
    return Array.isArray(body.data.data) ? body.data.data : [];
  } catch {
    return [];
  }
}
