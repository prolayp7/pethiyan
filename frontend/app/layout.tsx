import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { getAnnouncementBar, getHeaderMenu, getSystemSettings, getWebSettings } from "@/lib/api";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { GTMScript, GTMNoScript } from "@/components/analytics/GoogleTagManager";
import FacebookPixel from "@/components/analytics/FacebookPixel";
import CartDrawer from "@/components/ui/CartDrawer";
import CartPushLayout from "@/components/layout/CartPushLayout";
import TopAnnouncementBar from "@/components/headers/TopAnnouncementBar";
import OfferTickerClient from "@/components/headers/OfferTickerClient";
import MainHeader from "@/components/headers/MainHeader1";
import NavigationMenu from "@/components/headers/NavigationMenuServer";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import ScrollToTop from "@/components/ui/ScrollToTop";
import Footer from "@/components/layout/Footercopy7";
import CouponPopup from "@/components/popups/CouponPopup";
import CookieConsentPopup from "@/components/popups/CookieConsentPopup";
import { COOKIE_CONSENT_NAME, parseCookieConsent } from "@/lib/cookie-consent";
import { CART_COUNT_COOKIE, WISHLIST_COUNT_COOKIE, parseCountCookie } from "@/lib/count-preferences";
import { organizationSchema, websiteSchema, jsonLd } from "@/lib/structured-data";
import { Toaster } from "react-hot-toast";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pethiyan.com";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  // Minimise CLS from font swap — fallback metrics are tuned to match Inter
  adjustFontFallback: true,
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
});

export const viewport: Viewport = {
  themeColor: "#1f4f8a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const FALLBACK_TITLE       = "Pethiyan — The Power of Perfect Packaging";
const FALLBACK_DESCRIPTION = "High-quality packaging products — pouches, jars, delivery boxes and custom packaging for modern brands. Shop online with GST invoice, fast shipping across India.";
const FALLBACK_OG_IMAGE    = "/opengraph-image.png";

export async function generateMetadata(): Promise<Metadata> {
  const [webSettings, siteSettings] = await Promise.all([
    getWebSettings(),
    getSystemSettings(),
  ]);
  const faviconVersion = siteSettings?.favicon ? encodeURIComponent(siteSettings.favicon) : "default";
  const faviconUrl = `/api/site-icon?v=${faviconVersion}`;

  const defaultTitle = webSettings?.metaTitle       || FALLBACK_TITLE;
  const description  = webSettings?.metaDescription || FALLBACK_DESCRIPTION;
  const keywords     = webSettings?.metaKeywords    || undefined;
  const author       = webSettings?.metaAuthor      || "Pethiyan";
  const publisher    = webSettings?.metaPublisher   || "Pethiyan";
  const ogTitle      = webSettings?.ogTitle         || defaultTitle;
  const ogDesc       = webSettings?.ogDescription   || description;
  const ogImage      = webSettings?.ogImage         || FALLBACK_OG_IMAGE;
  const twCard       = (webSettings?.twitterCard as "summary" | "summary_large_image" | "app" | "player") || "summary_large_image";
  const twTitle      = webSettings?.twitterTitle    || ogTitle;
  const twDesc       = webSettings?.twitterDescription || ogDesc;
  const twImage      = webSettings?.twitterImage    || ogImage;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultTitle,
      template: "%s | Pethiyan",
    },
    description,
    ...(keywords ? { keywords } : {}),
    authors: [{ name: author }],
    creator: author,
    publisher,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: SITE_URL,
      siteName: "Pethiyan",
      title: ogTitle,
      description: ogDesc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: twCard,
      title: twTitle,
      description: twDesc,
      images: [twImage],
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        "en":        "/",
        "x-default": "/",
      },
    },
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    verification: {
      ...(webSettings?.googleSiteVerification
        ? { google: webSettings.googleSiteVerification }
        : {}),
      ...(webSettings?.bingSiteVerification
        ? { other: { "msvalidate.01": webSettings.bingSiteVerification } }
        : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const consent = parseCookieConsent(cookieStore.get(COOKIE_CONSENT_NAME)?.value);
  const initialCartCount = parseCountCookie(cookieStore.get(CART_COUNT_COOKIE)?.value);
  const initialWishlistCount = parseCountCookie(cookieStore.get(WISHLIST_COUNT_COOKIE)?.value);
  const orgSchema = organizationSchema();
  const siteSchema = websiteSchema();
  const [siteSettings, webSettings, headerMenu, announcementBar] = await Promise.all([
    getSystemSettings().then(s => s ?? {
      appName: "Pethiyan", logo: null, favicon: null,
      smsOtpEnabled: false, emailOtpEnabled: false,
      showVariantColorsInGrid: false, showGstInGrid: false,
      showCategoryNameInGrid: false, showMinQtyInGrid: false,
    }),
    getWebSettings(),
    getHeaderMenu(),
    getAnnouncementBar(),
  ]);

  const DEFAULT_TICKER = [
    "🚚 Free Shipping on Orders Above $50",
    "⚡ Fast Global Delivery Available",
    "📦 Premium Packaging for Modern Brands",
    "🎁 Bundle & Save — Buy 3 Get 1 Free",
    "🌿 100% Eco-Friendly Material Options",
  ];
  const topBarText   = announcementBar?.topBar.text ?? "The Power of Perfect Packaging — Trusted by 10,000+ Brands Worldwide";
  const topBarActive = announcementBar?.topBar.active ?? true;
  const tickerActive = announcementBar?.ticker.active ?? true;
  const tickerItems  = announcementBar?.ticker.items?.length ? announcementBar.ticker.items : DEFAULT_TICKER;

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script {...jsonLd(orgSchema)} key="org-schema" />
        <script {...jsonLd(siteSchema)} key="site-schema" />
        {consent.analytics && webSettings?.googleAnalyticsId  && <GoogleAnalytics id={webSettings.googleAnalyticsId} />}
        {consent.analytics && webSettings?.googleTagManagerId && <GTMScript      id={webSettings.googleTagManagerId} />}
      </head>
      <body className="antialiased bg-background text-foreground font-sans">
        {consent.analytics && webSettings?.googleTagManagerId && <GTMNoScript   id={webSettings.googleTagManagerId} />}
        {consent.marketing && webSettings?.facebookPixelId    && <FacebookPixel id={webSettings.facebookPixelId} />}
        {/* Portal root — sits above app-root in z-order, outside its stacking context */}
        <div id="portal-root" />

        {/* App root — explicit z:0 stacking context so portal-root always wins */}
        <div id="app-root" style={{ isolation: "isolate", position: "relative", zIndex: 0 }}>
        <SiteSettingsProvider settings={siteSettings}>
        <AuthProvider>
          <WishlistProvider initialCount={initialWishlistCount}>
            <CartProvider initialItemCount={initialCartCount}>
              <CartPushLayout>
                {/* Non-sticky top bars */}
                {topBarActive && <TopAnnouncementBar text={topBarText} />}
                {tickerActive && <OfferTickerClient items={tickerItems} />}

                {/* Sticky header: MainHeader + CategoryNav */}
                <div className="sticky top-0 z-40">
                  <div className="relative z-20">
                    <MainHeader mobileNavItems={headerMenu?.nav_items} />
                  </div>
                  <div className="relative z-10">
                    <NavigationMenu />
                  </div>
                </div>

                {/* Page Content */}
                <main id="main-content" tabIndex={-1}>
                  {children}
                </main>

                {/* Footer */}
                <Footer />
              </CartPushLayout>

              {/* Mobile Bottom Navigation */}
              <MobileBottomNav />

              {/* Cart Drawer (portal) */}
              <CartDrawer />

              {/* Floating scroll-to-top */}
              <ScrollToTop />

              {/* Coupon popup — shown once per session after 2s */}
              <CouponPopup />

              {/* Cookie preferences */}
              <CookieConsentPopup />

              {/* Toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: 600,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                  },
                  success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
                  error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
                }}
              />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
        </SiteSettingsProvider>
        </div>{/* /app-root */}
      </body>
    </html>
  );
}
