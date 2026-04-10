import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { getSystemSettings, getWebSettings } from "@/lib/api";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { GTMScript, GTMNoScript } from "@/components/analytics/GoogleTagManager";
import FacebookPixel from "@/components/analytics/FacebookPixel";
import CartDrawer from "@/components/ui/CartDrawer";
import TopAnnouncementBar from "@/components/headers/TopAnnouncementBar";
import OfferTicker from "@/components/headers/OfferTicker";
import MainHeader from "@/components/headers/MainHeader1";
import NavigationMenu from "@/components/headers/NavigationMenuServer";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import ScrollToTop from "@/components/ui/ScrollToTop";
import Footer from "@/components/layout/Footercopy7";
import CouponPopup from "@/components/popups/CouponPopup";
import { organizationSchema, websiteSchema, jsonLd } from "@/lib/structured-data";
import { Toaster } from "react-hot-toast";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pethiyan.com";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#1f4f8a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const webSettings = await getWebSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Pethiyan — The Power of Perfect Packaging",
      template: "%s | Pethiyan",
    },
    description:
      "High-quality packaging products — pouches, jars, delivery boxes and custom packaging for modern brands. Shop online with GST invoice, fast shipping across India.",
    keywords: [
      "packaging",
      "pouches",
      "bags",
      "custom packaging",
      "ziplock bags",
      "standup pouches",
      "packaging products india",
      "wholesale packaging",
      "jars",
      "delivery boxes",
    ],
    authors: [{ name: "Pethiyan" }],
    creator: "Pethiyan",
    publisher: "Pethiyan",
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
      title: "Pethiyan — The Power of Perfect Packaging",
      description:
        "High-quality packaging products — pouches, jars, delivery boxes and custom packaging for modern brands.",
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "Pethiyan — The Power of Perfect Packaging",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Pethiyan — The Power of Perfect Packaging",
      description:
        "High-quality packaging products — pouches, jars, delivery boxes and custom packaging for modern brands.",
      images: ["/opengraph-image.png"],
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        "en":        "/",
        "x-default": "/",
      },
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
  const orgSchema = organizationSchema();
  const siteSchema = websiteSchema();
  const [siteSettings, webSettings] = await Promise.all([
    getSystemSettings().then(s => s ?? {
      appName: "Pethiyan", logo: null, favicon: null,
      showVariantColorsInGrid: false, showGstInGrid: false,
      showCategoryNameInGrid: false, showMinQtyInGrid: false,
    }),
    getWebSettings(),
  ]);

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script {...jsonLd(orgSchema)} key="org-schema" />
        <script {...jsonLd(siteSchema)} key="site-schema" />
        {webSettings?.googleAnalyticsId  && <GoogleAnalytics id={webSettings.googleAnalyticsId} />}
        {webSettings?.googleTagManagerId && <GTMScript      id={webSettings.googleTagManagerId} />}
      </head>
      <body className="antialiased bg-background text-foreground font-sans">
        {webSettings?.googleTagManagerId && <GTMNoScript   id={webSettings.googleTagManagerId} />}
        {webSettings?.facebookPixelId    && <FacebookPixel id={webSettings.facebookPixelId} />}
        {/* Portal root — sits above app-root in z-order, outside its stacking context */}
        <div id="portal-root" />

        {/* App root — explicit z:0 stacking context so portal-root always wins */}
        <div id="app-root" style={{ isolation: "isolate", position: "relative", zIndex: 0 }}>
        <SiteSettingsProvider settings={siteSettings}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {/* Non-sticky top bars */}
              <TopAnnouncementBar />
              <OfferTicker />

              {/* Sticky header: MainHeader + CategoryNav */}
              <div className="sticky top-0 z-40">
                <div className="relative z-20">
                  <MainHeader />
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

              {/* Mobile Bottom Navigation */}
              <MobileBottomNav />

              {/* Cart Drawer (portal) */}
              <CartDrawer />

              {/* Floating scroll-to-top */}
              <ScrollToTop />

              {/* Coupon popup — shown once per session after 2s */}
              <CouponPopup />

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
